const { Task, User } = require('../models/Task'); //Imports Task and User from our models index
const { Op } = require('sequelize');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_KEY,
    },
});

const normalizeStatus = (status) => {
    if (status === 'In-Progress') return 'In Progress';
    return status;
};

const canManageTaskStatus = (task, user) => {
    if (!task || !user) return false;
    if (user.role === 'Admin' && (!task.assignedBy || task.assignedBy === user.id)) return true;
    return task.assignedTo === user.id;
};

const isS3Configured = Boolean(
    process.env.AWS_BUCKET_NAME &&
    (process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY) &&
    (process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_KEY)
);

const taskIncludes = [
    {model:User,attributes:['email']},
    {model:User,as:'AssignedByUser',attributes:['email'],required:false},
];

const getObjectKeyFromUrl = (fileUrl) => {
    try {
        const parsedUrl = new URL(fileUrl);
        const bucketName = process.env.AWS_BUCKET_NAME;
        if (!bucketName || !parsedUrl.hostname.includes(bucketName)) {
            return null;
        }

        return decodeURIComponent(parsedUrl.pathname.replace(/^\/+/, ''));
    } catch {
        return null;
    }
};

//Create Task
exports.createTask=async(req,res)=>{
    try{
        const{title,description,status,priority,dueDate,assignedTo}=req.body;
        const normalizedStatus = normalizeStatus(status);

        if (req.files && req.files.length > 0 && !isS3Configured) {
            return res.status(503).json({message:'File uploads are not configured on this server'});
        }

        //Extract S3 URLs from uploaded files
        const documents=req.files ? req.files.map(file=>file.location).filter(Boolean) : [];

        //Create new task
        const task=await Task.create({
            title,
            description,
            status: normalizedStatus,
            priority,
            dueDate,
            assignedTo:assignedTo || req.user.id, // Default to creator if not specified
            assignedBy: req.user.id,
            documents,
        });

        res.status(201).json({message:'Task created successfully',task});
    }catch(err){
        res.status(500).json({message:'Error creating task',err});
    }
};

//Get Task by ID
exports.getTasks=async(req,res)=>{
    try{
        const {status,priority,sortBy,order,page=1,limit=10}=req.query;
        const offset=(page-1)*limit;

        //RBAC:Users only see their assigned tasks
        let whereClause=req.user.role==='Admin'? {} : {assignedTo:req.user.id};

        if(status) whereClause.status=status;
        if(priority) whereClause.priority=priority;

        const tasks=await Task.findAndCountAll({
            where:whereClause,
            order:[[sortBy||'createdAt',order||'DESC']],
            limit:parseInt(limit),
            offset:parseInt(offset),
            include: taskIncludes // Include assigned user's email and assigning admin
        });
        res.json({
            total:tasks.count,
            pages:Math.ceil(tasks.count/limit),
            data:tasks.rows
        });
    }catch(err){
        res.status(500).json({message:'Error getting tasks',err});
    }
};

//UPDATE TASK
exports.updateTask=async(req,res)=>{
    try{
        const task=await Task.findByPk(req.params.id);
        if(!task)return res.status(404).json({message:'Task not found'});

        //Authorization: Ensure the assignee or assigning admin can edit the task
        if(!canManageTaskStatus(task, req.user)){
            return res.status(403).json({message:'Access denied: not your task'});
        }

        const updatedData=req.body;
        if(updatedData.status){
            updatedData.status = normalizeStatus(updatedData.status);
        }
        if(req.files && req.files.length>0){
            if (!isS3Configured) {
                return res.status(503).json({message:'File uploads are not configured on this server'});
            }
            updatedData.documents=req.files.map(file=>file.location);
        }

        await task.update(updatedData);
        const refreshedTask = await Task.findByPk(req.params.id, { include: taskIncludes });
        res.json(refreshedTask || task);
    }catch(err){
        res.status(500).json({message:'Error updating task',err});
    }
};

exports.updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({message:'Task not found'});

        if (!canManageTaskStatus(task, req.user)) {
            return res.status(403).json({message:'Access denied: not your task'});
        }

        const nextStatus = normalizeStatus(req.body.status);
        if (!nextStatus) {
            return res.status(400).json({message:'Status is required'});
        }

        await task.update({ status: nextStatus });
        const refreshedTask = await Task.findByPk(req.params.id, { include: taskIncludes });
        res.json({ message: 'Task status updated successfully', task: refreshedTask || task });
    } catch (err) {
        res.status(500).json({message:'Error updating task status',err});
    }
};

//Delete Task
exports.deleteTask=async(req,res)=>{
    try{
        const task=await Task.findByPk(req.params.id);
        if(!task)return res.status(404).json({message:'Task not found'});

        if(req.user.role!=='Admin' && task.assignedTo!==req.user.id){
            return res.status(403).json({message:'Access denied: not your task'});
        }

        await task.destroy();
        res.json({message:'Task deleted successfully'});
    }catch(err){
        res.status(500).json({message:'Error deleting task',err});  
    }
};

exports.downloadDocument = async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ message: 'Document URL is required' });
        }

        const key = getObjectKeyFromUrl(url);
        if (!key || !key.startsWith('tasks/')) {
            return res.status(400).json({ message: 'Invalid document URL' });
        }

        const filename = path.basename(key);
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            ResponseContentType: 'application/pdf',
            ResponseContentDisposition: `inline; filename="${filename}"`,
        });

        const response = await s3Client.send(command);
        res.setHeader('Content-Type', response.ContentType || 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

        if (response.Body && typeof response.Body.pipe === 'function') {
            response.Body.pipe(res);
            return;
        }

        return res.status(500).json({ message: 'Unable to stream document' });
    } catch (err) {
        console.error('Download document error:', err);
        return res.status(500).json({ message: 'Unable to load document' });
    }
};