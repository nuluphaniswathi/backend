//import express async handler to handle errors
const expressAsyncHandler=require("express-async-handler");

//importing sequelize from db.config for establishing connection
const sequelize=require("../db/db.config");

//import bcryptjs module for implementing security related operations
const bcryptjs=require("bcryptjs");

//importing jwt for generating token
const jwt=require("jsonwebtoken");


//namedexport of user model
let {UserModel}=require("../db/models/users.model");

//import employee model
let {EmployeeModel}=require("../db/models/Employee.model");

//configure dotenv
require("dotenv").config();

//import nodemailer
const nodemailer = require('nodemailer');

//create connection to smtp
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE_PROVIDER,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD // app password
  }
})

//Creating otps object
let otps={};

//forget password
exports.forgetpassword=expressAsyncHandler(async(req,res)=>{
  //generating 6 digit random number as otp to reset password
  let otp=Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
  //add OTP to otps object
  otps[req.body.email]=otp
  //draft email
  let mailOptions = {
      from: 'miniprojectpulsebackend@gmail.com',
      to: req.body.email,
      subject: 'OTP to reset password',
      text: `Hello ,
       We received a request to reset your password .Enter the following OTP to reset your password :
        `+otp
    }
  //send email
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    })
  //setting valid time to OTP(10 minutes)
  setTimeout(()=>{
      //delete OTP from object after 10 minutes
      delete otps[req.body.email]
  },600000)
  res.status(200).send({message:"OTP to reset your password is sent to your email"})
})

//reset password
exports.resetPassword=expressAsyncHandler(async(req,res)=>{
  //otp matches
  if(req.body.otp==otps[req.params.email]){
      console.log("password verified");
      //update password with new password
      await UserModel.update({password:req.body.password},{where:{
          email:req.params.email
      }})
      res.status(200).send({message:"Reset password is sucessfull"})
  }
  else{
      res.status(408).send({message:"Invalid OTP"})
  }
})


//register a user
exports.register=expressAsyncHandler(async(req,res)=>{
   //Only employees can have access to register the portal so check if employee existed or not
    let checkEmployee=await EmployeeModel.findOne({where:{emp_name:req.body.user_name}})
    //if employee not existed
    if(checkEmployee==undefined){
      res.status(401).send({message:"No access to register"});
    }
     //check if user already existed
    let user=await UserModel.findOne({where:{email:req.body.email}})
    console.log(user);
    if(user!=null){
        res.status(409).send({message:"user already registered"})
    }
    //hash the password and then create
    else{
        let {password}=req.body
        //hash() is a method having two parameters password and salt value
        let newPassword=await bcryptjs.hash(password,5)
        console.log("password:",newPassword);
        //update password with new onee
        req.body.password=newPassword
        //query to create user
        await UserModel.create(req.body)
        res.status(201).send({message:"User registered",payload:user})
    }
})

//user login
exports.login=expressAsyncHandler(async(req,res)=>{
    //check if email exist
    let {email,password}=req.body;
    let user=await UserModel.findOne({where:{email:email}})
    console.log(user);
    //if user not existed
    if(user==null){
        res.status(404).send({message:"Invalid email"})
    }
    else{
    //verify password
   console.log(password);
   console.log(user.password);
   //it compares the password
    let result=await bcryptjs.compare(password,user.password)
    console.log(result);
    //if passwords not matched
    if(result==false){
        res.status(404).send({message:"Invalid password"})
    }
    else{
        //if role not assigned
        if(user.dataValues.role==null){
            res.status(401).send({message:"Unauthorized access..Please contact your super admin for role assignment"})
        }
        //if role is assigned
        else{
          console.log(user.email);
            //create jwt token and send to client
            let signedToken=jwt.sign({role:user.role,email:user.email},process.env.SECRET_KEY||"",{expiresIn:"10d"})
            //remove password
            delete user.password
            //send jwt response
            res.status(200).send({message:"success",token:signedToken,user:user})
        }
    }
    }
})

