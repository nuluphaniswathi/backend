//import express async handler
const expressAsyncHandler=require("express-async-handler");
//importing sequelize from db.config
const sequelize=require("../db/db.config");
//import bcryptjs
const bcryptjs=require("bcryptjs");
//importing jwt
const jwt=require("jsonwebtoken");

//import project model
const {ProjectModel}=require("../db/models/project.model")

//import  project updates model
const {project_updatesModel}=require("../db/models/project_updates.model");

//import projectconcerns model
const {project_concernsModel}=require("../db/models/project_concerns.model");

//importing team_composition model
const {team_CompositionModel}=require("../db/models/team_composition.model");


//import op and date from sequelize
const {Op,DATE}=require("sequelize");

//creating association between projectmodel and project updates model
ProjectModel.project_updatesModel=ProjectModel.hasMany(project_updatesModel,
    {
        foreignKey:"project_id",
        onDelete: 'CASCADE',
        onUpdate:'CASCADE'
    })


//creating association between project model and project concerns model
ProjectModel.project_concernsModel=ProjectModel.hasMany(project_concernsModel,{
    foreignKey:"project_id",
    onDelete: 'CASCADE',
    onUpdate:'CASCADE'

})

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



//create update project by project manager
exports.createProjectUpdate=expressAsyncHandler(async(req,res)=>{
    //query to check project is existed or not 
    let checkProject=await ProjectModel.findOne({where:{project_id:req.params.projectId}});
    //if project not existed
    if(checkProject==undefined){
        res.status(204).send("project is not existed so can't create project updates")
    }
    else{
    //insert data into projects updates model
    await project_updatesModel.create(req.body);
    res.status(201).send({message:"project update created"})
    }
    

})

//raise project concern by project manager
exports.raiseprojectconcern=expressAsyncHandler(async(req,res)=>{
    //get data of specific project
    let project=await ProjectModel.findOne({where:{project_id:req.params.projectId}});
    console.log(project);
    let gdoheademail=project.dataValues.GdoHeadEmail;
    //let gdoheademail=await ProjectModel.findOne({where:{project_id:req.params.projectId}})
    if(project==undefined){
        res.status(204).send({message:"no project to raise the project concern"})
    }
    else{
    //draft mail
    let mailOptions = {
        from: "miniprojectpulsebackend@gmail.com",
        to: [gdoheademail,"sashi@westagilelabs.com","pramod@westagilelabs.com","varun@westagilelabs.com"],
        subject: `Project concern is raised for project ${req.body.project_id} by ${req.body.raised_by}`,
        text: `Hello Admin,
         A project concern is raised for the above project and the concern description is: ${req.body.concern_desc}
         severity of project concern:${req.body.severity} `,
      };
      //send email
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
   
    
    //insert data into project concerns model
    await project_concernsModel.create(req.body);
    //send response
    res.status(201).send({message:"project concern raised"});
    }
})



exports.getProject=expressAsyncHandler(async(req,res)=>{
    //get the gdohead email
    let ProjectManagerEmail=req.email;
    console.log("projectManagerEmail:",ProjectManagerEmail)
    //sequelize query to find all the projects under the specified gdo
    let projectRecord=await ProjectModel.findAll({
        where:{
            project_Manager_Email:ProjectManagerEmail
        },
        attributes:{
           exclude: [  
            "Domain",
            ]
        }
    });
    //if there are no projects for gdo
    if(projectRecord.length===0){
        res.status(204).send({message:"no projects "})
    }
    //if  projects exists send all projects as response
    else{
    res.status(200).send({message:"all projects under manager with email",payload:projectRecord});
    }
})




//get specific projectdetails under project manager
exports.getSpecificProjectDetails=expressAsyncHandler(async(req,res)=>{
    let projectidfromUrl=req.params.projectId;
    //let gdoHeadEmail=req.email;
    let projectRecord=await ProjectModel.findOne(
        {where:{project_id:projectidfromUrl},
        include:[
            {
                association:ProjectModel.project_updatesModel
            },
            {
                association:ProjectModel.project_concernsModel
            },
            {
                association:ProjectModel.team_CompositionModel
            }

        ]
    });
    console.log(projectRecord);
   // return project fitness, concern indicator ,Team members get these values from projectRecord
   let projectFitness = projectRecord.dataValues.overall_project_fitness_indicator;
   // find team size
   let teamSize=0;
   projectRecord.dataValues.team_compositions.forEach((teamMember)=>{
     if(teamMember.billing_status=="billed") teamSize++;
   })
   // find number of concerns that are  active
   let concernIndicator = 0;
   projectRecord.dataValues.project_concerns.forEach((concern) => {
     if (concern.status == true) concernIndicator++;
   });
   // send response
   res.status(200).send({
     message: `Project Details for projectId ${projectidfromUrl}`,
     projectFitness: projectFitness,
     teamSize: teamSize,
     concernIndicator: concernIndicator,
     payload: projectRecord,
   });
})

//project manager can update the projectupdate details
exports.updateProjectUpdate=expressAsyncHandler(async(req,res)=>{
    //query to check whether the project under projectmanager exists or not
    let checkproject=await ProjectModel.findOne({where:{project_id:req.body.project_id ,
        project_Manager_Email:req.params.ProjectManagerEmail}});
    //if project is not existed
    if(checkproject==undefined){
        res.status(204).send({message:"project is not existed to update by projectmanager"})
    }
    //if project existed then update the details
    else{
        await project_updatesModel.update(req.body,{where:{project_id:req.body.project_id}})
        res.status(200).send({message:"projectupdates updated by projectmanager"})
    }
})


//project manager can delete project update details
exports.deleteProjectUpdates=expressAsyncHandler(async(req,res)=>{
    //query to check project with the given id has project updates or not
    let checkProject=await project_updatesModel.findOne({where:{project_id:req.params.projectId}});
    //if not exists
    if(checkProject==undefined){
        res.status(204).send({message:"projectupdate not existed to delete "})
    }
    //if exists
    else{
        //query to delete the project_updates
        await project_updatesModel.destroy({where:{project_id:req.params.projectId}})
        res.status(200).send({message:"project updates deleted by project manager"})
    }

})

//last two weeks updates
exports.lastTwoWeeksUpdates=expressAsyncHandler(async(req,res)=>{
    //today date
    let todayDate=new Date();
    //create object to store the date of the day before two weeks
    let dateBeforeTwoWeeks=new Date();
    //assign date of the date of the day before two weeks
    dateBeforeTwoWeeks.setDate(todayDate.getDate()-14);
    //get projectupdates
    let projectupdates=await project_updatesModel.findAll({where:{
      project_id:req.params.projectId,
      Date:{
        [Op.between]:[dateBeforeTwoWeeks,todayDate]
      }
    }})
    console.log("projectupdates",projectupdates);
    //send response
    res.status(200).send({message:"last two weeks updates details",payload:projectupdates})
  })

  //project concern updated by project manager
exports.projectConcernUpdate=expressAsyncHandler(async(req,res)=>{
    //query to check whether project is existed or not before updating
    let checkProjectInProjects=await ProjectModel.findOne({where:{
        project_id:req.params.projectId,
        project_Manager_Email:req.params.projectManagerEmail
    }});
    //if project not existed
    if(checkProjectInProjects==undefined){
        res.send({message:"project not existed so cant raise concern"})
    }
    else{

    //if project existed and check concern raised for that project or not
    let checkProject=await project_concernsModel.findOne({where:{project_id:req.params.projectId}})
    //if not raised
    if(checkProject==undefined){
        res.send({message:"no concern raised for the project to update concern"})
    }
    //if concern raised
    else{
        await project_concernsModel.update(req.body,{where:{
            project_id:req.params.projectId
        }})
        res.send({message:"concern updated",payload:req.body});

    }
    }
  })

