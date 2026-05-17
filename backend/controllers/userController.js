const User = require('../models/User');
const bcrypt = require('bcryptjs');

//get all users
exports.getUsers=async(req,res)=>{
    try{
        const users=await User.findAll({attributes:{exclude:['password']}}); // Exclude password from response
        res.json(users);
    }catch(err){
        res.status(500).json({message:'Error getting users',err});
    }
};

//get user by id
exports.getUser=async(req,res)=>{
    try{
        const user=await User.findByPk(req.params.id);
        if(!user)return res.status(404).json({message:'User not found'});
        res.json(user);
    }catch(err){
        res.status(500).json({message:'Error getting user',err});
    }
};

//Create User
exports.adminCreateUser=async(req,res)=>{
    try{
        const{email,password,role}=req.body;

        const existingUser=await User.findOne({where:{email}});
        if(existingUser){
            return res.status(400).json({message:'User with this email already exists'});
        }

        //Hash password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password, salt);

        //Create new user
        const newUser=await User.create({
            email,
            password:hashedPassword,
            role:role || 'User', //Default role is User
        });

        res.status(201).json({id: newUser.id,email: newUser.email, role: newUser.role});
        }catch(err){
            res.status(500).json({message:'Error creating user',err});
        }
    };

    //update user(change role or password)
    exports.updateUser=async(req,res)=>{
        try{
            const {id}=req.params;
            const {email,role}=req.body;

            const user=await User.findByPk(id);
            if(!user)return res.status(404).json({message:'User not found'});

            await user.update({email,role});
            res.json({message:'User updated successfully',user});
        }catch(err){
            res.status(500).json({message:'Error updating user',err});
        }
    };

    //delete user
    exports.deleteUser=async(req,res)=>{
        try{
            const {id}=req.params;
            const user=await User.findByPk(id);
            if(!user)return res.status(404).json({message:'User not found'});

            await user.destroy();
            res.json({message:'User deleted successfully'});
        }catch(err){
            res.status(500).json({message:'Error deleting user',err});
        }
    };