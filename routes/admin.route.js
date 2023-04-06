//import express module
const exp=require("express");

//creating express mini router
const adminApp=exp.Router();

//import admin middleware
let verifyToken=require('../middleware/admin.middleware');

//bodyparser
adminApp.use(exp.json())

//import admin controllers
const {createProject,getAllProjects,getSpecificProjectDetails,updateProject,deleteProject,lastTwoWeeksUpdates,
    getResourcingRequest}=require("../controllers/admin.controller")

// route for creating project by admin
adminApp.post("/create-project",verifyToken,createProject)

//route to read all projects by admin
adminApp.get("/admin/portfolio-dashboard",verifyToken,getAllProjects);

//route for getting specific project details by admin
adminApp.get("/admin/portfolio-dashboard/projectId/:projectId",verifyToken,getSpecificProjectDetails);

//route for getting last two updates of particular project by admin
adminApp.get("/admin/projectupdate/projectId/:projectId",verifyToken,lastTwoWeeksUpdates);

//route for getting resourcing requests by admin
adminApp.get("/admin/resourcerequest",getResourcingRequest)

//route to update project details by admin
adminApp.put("/admin/projectId/:projectId",verifyToken,updateProject);

//route to delete project details by admin
adminApp.delete("/admin/projectId/:projectId",verifyToken,deleteProject);

//default export adminapp
module.exports=adminApp;