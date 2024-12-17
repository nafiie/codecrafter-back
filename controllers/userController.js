const User = require('../model/User')
const bcryptjs = require("bcryptjs")
const sendMail = require('../config/mailService')
const jwt = require('jsonwebtoken')

exports.getAllUsers = async(req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users)
    } catch (error) {
        console.log(error.message);                
    }
}
exports.createUsers = async(req,res, next) => {
    try {
        const {name ,email, password} = req.body;
        const hashedPassword = await bcryptjs.hash(password, 10)
        const newUser = await User.create({name, email, password:hashedPassword});
        
         //send welcome mail
         const subject = 'welcome to code crafters';
         const text = `hi ${name}, welcome to our platform.We're glad to have you on board`;
         const html = `
         <h1>Welcome, ${name}</h1>
         <h1>Email: ${email}</h1>
         
         <p>We're excited to have you join us.If you have any question, feel free to reach out to our support taem</p>
         `;
         await sendMail(email, subject, text, html)
        res.status(201).json({message: 'user created successfully.Check your mailbox for a welcome message', user: newUser, email: new User})

    } catch (error) {
        console.log(error.message);              
    }
}

exports.loginUser = async(req,res, next) => {
    try {
     const {email, password} = req.body;
     const user = await User.findOne({email});

     if (!user) {
        return res.status(401).json({message:'invalid email or password'})
     }
     const isMatch = await bcryptjs.compare(password, user.password)

     if (!isMatch) {
        return res.status(401).json({message:'invalid email or password'})        
     }
     const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'})
     res.status(200).json({token, user}) 

    } catch (error) {
        console.log(error.message);        
    }
}
exports.getUserByid = async(req,res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) {
            return res.status(404).json({message: 'user not found'});
        } 
        res.status(200).json(user);       
    } catch (error) {
        console.log(error.message);
        
        
    }
}
exports.updateUserByid = async(req,res, next) =>{
    try {
        const {name ,email, password} = req.body;
        const hashedPassword = await bcryptjs.hash(password, 10)
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {name, email, password:hashedPassword},
            {new:true}
        );
        if (!updatedUser) {
            return res.status(404).json({message:'user not found'})
        }
        return res.status(200).json({message: 'user updated successfully', user: updatedUser})
    } catch (error) {
        console.log(error.message);              
    }
}

exports.deleteUserByid = async(req,res, next) =>{
    try {
        const deleteUser = await User.findByIdAndDelete(
          req.params.id,
        );
    if (!deleteUser) {
            return res.status(404).json({message:'user not found'})
        }
        return res.status(200).json({message: 'user deleted successfully', user: deleteUser})
    } catch (error) {
        console.log(error.message);              
    }
}

