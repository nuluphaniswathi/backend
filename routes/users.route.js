//import express module
const exp=require("express");

//creating express mini router
const userApp=exp.Router();


//bodyparser
userApp.use(exp.json())

//import user controllers
const {register,login,forgetpassword,resetPassword}=require("../controllers/user.controller")



//route to register the user
userApp.post("/register",register);

//route for login user
userApp.post("/login",login);

//route for forgetpassoword 
userApp.post("/forget-password",forgetpassword)

//route for reset password route
userApp.post("/reset-password/email/:email",resetPassword)


//export userapp
module.exports=userApp