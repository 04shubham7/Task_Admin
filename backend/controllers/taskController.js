const {Task,User}=require('../models/Task'); //Imports Task and User from our models index
const {Op} = require('sequelize');

//Create Task
exports.createTask=async(req,res)=>{
    try{
        const{title,description,status,priority,dueDate,assignedTo}=req.body;

        //Extract S3 URLs from uploaded files
        const documents=req.files ? req.files.map(file=>file.location) : [];

        //Create new task
        const task=await Task.create({
            title,
            description,
            status,
            priority,
            dueDate,
            assignedTo:assignedTo || req.user.id, // Default to creator if not specified
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
            include:[{model:User,attributes:['email']}] // Include assigned user's email
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

        //Authorization:Ensure user owns the task or is Admin
        if(req.user.role!=='Admin' && task.assignedTo!==req.user.id){
            return res.status(403).json({message:'Access denied: not your task'});
        }

        const updatedData=req.body;
        if(req.files && req.files.length>0){
            updatedData.documents=req.files.map(file=>file.location);
        }

        await task.update(updatedData);
        res.json(task);
    }catch(err){
        res.status(500).json({message:'Error updating task',err});
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