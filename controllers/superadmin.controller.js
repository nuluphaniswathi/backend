//import express async handler
const expressAsyncHandler=require("express-async-handler");
//importing sequelize from db.config
const sequelize=require("../db/db.config");

//import usermodel
let {UserModel}=require("../db/models/users.model");


//assigning role to users
exports.assignRole=expressAsyncHandler(async(req,res)=>{
    //check if the user exists
    let user=await UserModel.findOne({where:{email:req.body.email}})
    //if user not existed
    if(user==null){
        res.status(404).send({message:"user do not exist"})
    }
    else{
        //check if user already has role
        // if(user.role!=undefined){
        //     res.status(409).send({message:"User is already assigned with a role"})
        // }
        // if{
            //assign role to employee with that mail
            await UserModel.update({role:req.body.role},{where:{email:req.body.email}})
            res.status(200).send({message:"Role is assigned for user"})

        // }
        
    }
})
//super admin get all the users data
exports.userData=expressAsyncHandler(async(req,res)=>{
    //query to find all users data
    let usersData=await UserModel.findAll({attributes:{
        exclude:["password"]
    }});
    //send response
    res.status(200).send({message:"user data",payload:usersData});
})

//super admin get the users whose role is null
exports.userDataRoleNull=expressAsyncHandler(async(req,res)=>{
    //query to get the user who haven't any role
    let dataWithNoRole=await UserModel.findOne({where:{role:null},attributes:{
        exclude:["password"]
    }});
    //send response
    res.status(200).send({message:"users with no role assigned",payload:dataWithNoRole});
})
