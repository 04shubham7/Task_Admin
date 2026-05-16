const {User}=require('../models/Task'); //Imports User from our models index
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Register User
exports.register = async (req, res) => {
    try{
        const {email, password, role} = req.body;
        if(!email || !password)return res.status(400).json({message: 'Email and password are required'});

        //Check if user already exists
        const existingUser = await User.findOne({where:{email}});
        if(existingUser){
            return res.status(400).json({message: 'User with this email already exists'});
        }
    

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create new user
    const user = await User.create({
        email,
        password: hashedPassword,
        role:role || 'User', //Default role is User
    });
    const safeUser = {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
    };

    res.status(201).json({message: 'User created successfully', user: safeUser});
    }catch(err){
        res.status(500).json({message: 'Error creating user', err});
    }
}

// Login User
exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password)return res.status(400).json({message: 'Email and password are required'});

        //Find user by email
        const user=await User.findOne({where:{email}});
        if(!user){
            return res.status(400).json({message: 'User not found'});
        }

        //Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: 'Invaild email or password'});
        }

        //Generate custom JWT
        const token=jwt.sign({
            id:user.id,
            email:user.email,
            role:user.role
        }, process.env.JWT_SECRET, {expiresIn: '1h'});

        const safeUser = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        res.status(200).json({message: 'Login successful', token, user: safeUser}); //Return safe user data along with token
    }catch(err){
        res.status(500).json({message: 'Error logging in user', err});
    }
};
        

    
