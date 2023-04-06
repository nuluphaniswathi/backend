//import express async handler
const expressAsyncHandler=require("express-async-handler");

//importing sequelize from db.config
const sequelize=require("../db/db.config");

//import bcryptjs
const bcryptjs=require("bcryptjs");

//importing jwt
const jwt=require("jsonwebtoken");


//import op and date from sequelize
const {Op,DATE}=require("sequelize");

//importing team_composition model
const {team_CompositionModel}=require("../db/models/team_composition.model");

//importing project model
const {ProjectModel}=require("../db/models/project.model");

//importing employee model
const {EmployeeModel}=require("../db/models/Employee.model");

//importing resorcing request model
const {Resourcing_requestModel}=require("../db/models/resourcing_request.model");

//importing project updates model
const {project_updatesModel}=require("../db/models/project_updates.model");

//importing project concerns model
const {project_concernsModel}=require("../db/models/project_concerns.model")


//establishing relationship between projectmodel and team_composition model(one-to-many)
ProjectModel.team_CompositionModel=ProjectModel.hasMany(team_CompositionModel,
    {
        foreignKey:"project_id",
        onDelete: 'CASCADE',
        onUpdate:'CASCADE'

});



// Association between ProjectModel and ProjectUpdatesModel (one-to-many)
console.log(ProjectModel.project_updatesModel)
ProjectModel.project_updatesModel = ProjectModel.hasMany(project_updatesModel, {
    foreignKey: "project_id",
    onDelete:"cascade",
    onUpdate:"cascade"
  });
  
// Association between ProjectModel and Project_ConcernModel (one-to-many)
ProjectModel.project_concernsModel = ProjectModel.hasMany(project_concernsModel, {
    foreignKey: "project_id",
    onDelete:"cascade",
    onUpdate:"cascade"
  });


//adding member to team by gdo head
exports.team=expressAsyncHandler(async(req,res)=>{
    let team=await team_CompositionModel.create(req.body);
    res.status(201).send({message:"team member added",payload:team});
})

//raising a resourcing request for a project
exports.resourcerequest=expressAsyncHandler(async(req,res)=>{
    //get projectid from request
    let projectidfromUrl=req.params.projectId;
    //query to check the project exists or not before raising request
    let getProject=await ProjectModel.findOne({where:{project_id:projectidfromUrl}})
    //if no projects
    if(getProject==undefined){
        res.status(204).send({message:"The project is not existed to raise the request"})
    }
    //if proeject exists
    else{
    await Resourcing_requestModel.create(req.body);
    //send response
    res.status(200).send({message:"resourcing request raised"});
    }
})

//get all the projects under him
exports.getProjects=expressAsyncHandler(async(req,res)=>{
    //get the gdohead email
    let gdoHeadEmail=req.email;
    //sequelize query to find all the projects under the specified gdo
    let projectRecord=await ProjectModel.findAll({
        where:{
            GdoHeadEmail:gdoHeadEmail
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
    res.status(200).send({message:"all projects under gdo with email",payload:projectRecord});
    }
})


//get specific projectdetails under gdo
exports.getSpecificProjectDetails=expressAsyncHandler(async(req,res)=>{
    //get project id from request url
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
     if(teamMember.billing_status==="billed") teamSize++;
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

//update team details by gdo
exports.updateTeamByGdo=expressAsyncHandler(async(req,res)=>{
    //query for finding respective employee of certain project under gdo
    let  check=await team_CompositionModel.findOne({where:{[Op.and]:[
        
           {project_id:req.params.projectId},
            {emp_id:req.params.empId}
    ]}})
    //if not exists
    if(check==undefined){
        res.status(204).send({message:"no employee to update by gdo under given project"})
    }
    //if exists
    else{
        await team_CompositionModel.update(req.body,{where:{
            project_id:req.params.projectId,
            emp_id:req.params.empId
        }})
        res.status(200).send({message:"employee details updated by gdo"})
    }
})
//delete team member in the project under gdo
exports.deleteTeamByGdo=expressAsyncHandler(async(req,res)=>{
    //checking the employee is existed or not before deleting
    let check=await team_CompositionModel.findOne({where:{
        project_id:req.params.projectId,
        emp_id:req.params.Empid
    }})
    //if not exists
    if(check==undefined){
        res.status(204).send({message:"no employee with that id existed to delete"})
    }
    //if employee is existed then delete
    else{
        await team_CompositionModel.destroy({where:{
            project_id:req.params.projectId,
            emp_id:req.params.Empid
        }})
        //send response as deleted
        res.status(200).send({message:"team member deleted by gdo"});

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
    //send response
    res.status(200).send({message:"last two weeks updates details",payload:projectupdates})
  })
