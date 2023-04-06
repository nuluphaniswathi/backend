//import express async handler
const expressAsyncHandler=require("express-async-handler");

//importing sequelize from db.config
const sequelize=require("../db/db.config");

//import op and date from sequelize
const {Op,DATE}=require("sequelize");

//importing  models
//namedexports
let {ProjectModel}=require("../db/models/project.model");
let {project_concernsModel}=require("../db/models/project_concerns.model");
let {project_updatesModel}=require("../db/models/project_updates.model");
let {team_CompositionModel}=require("../db/models/team_composition.model");
let {Resourcing_requestModel}=require("../db/models/resourcing_request.model");



//establishing associations
// Association between ProjectModel and ProjectUpdatesModel (one-to-many)
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
  
  // Association between projectModel and team composition model (one-to-many)
  ProjectModel.team_CompositionModel = ProjectModel.hasMany(team_CompositionModel, {
    foreignKey: "project_id",
    onDelete:"cascade",
    onUpdate:"cascade"
  });

  // Association between projectModel and resource request model (one-to-many)
  ProjectModel.Resourcing_requestModel=ProjectModel.hasMany(Resourcing_requestModel,{
    foreignKey: "project_id",
    onDelete:"cascade",
    onUpdate:"cascade"

  })

  

//creating a project
exports.createProject=expressAsyncHandler(async(req,res)=>{
    //create a project from req.body
    await ProjectModel.create(req.body);
    res.status(201).send({message:"project created by admin"})
})

//get all projects under admin
exports.getAllProjects=expressAsyncHandler(async(req,res)=>{
    let Allprojects=await ProjectModel.findAll({attributes:{
      exclude:["team_size"]
    }});
    // if  no projects exists
    if(Allprojects.length==0){
        res.status(400).send({message:"no projects"})
    }
    //if projects exists get all projects data
    else{
    res.status(200).send({message:"all projects",payload:Allprojects});
    }
})

//get specified project details
exports.getSpecificProjectDetails=expressAsyncHandler(async(req,res)=>{
  //get projectid from request
    let projectidfromUrl=req.params.projectId;
    //get data based on mentioned project--detailedview
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
    if (concern.status === true) concernIndicator++;
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
//update project details
exports.updateProject=expressAsyncHandler(async(req,res)=>{
  //destructuring the data from request 
    let {project_id,project_name,client,
    client_account_manager,
    status_of_project,
    start_date,
    end_date,
    overall_project_fitness_indicator,
    Domain,
    type_of_project,
    team_size,
    GdoHeadEmail,
    project_Manager_Email}=req.body;
      //update the project details with new project details
    let update=await ProjectModel.update({
        project_id:project_id,
        project_name:project_name,
        client:client,
        client_account_manager: client_account_manager,
        status_of_project:status_of_project,
        start_date:start_date,
        end_date:end_date,
        overall_project_fitness_indicator: overall_project_fitness_indicator,
        Domain:Domain,
        type_of_project:type_of_project,
        team_size:team_size,
        GdoHeadEmail:GdoHeadEmail,
        project_Manager_Email:project_Manager_Email
    },{where:{project_id:req.params.projectId}})
    //no updates available
    if(update==0){
        res.status(404).send({message:"nothing to update"})
    }
    //send respose as successfulupdated
    else{
        res.status(200).send({message:"updated successfully"})
    }
})

//delete a project
exports.deleteProject=expressAsyncHandler(async(req,res)=>{
  //get projectid from url
    let projectidfromUrl=req.params.projectId;
    //get specific project details based on projectid
    let project=await ProjectModel.findOne({where:{'project_id':projectidfromUrl}})
    console.log(project);
    //if project is not existed
    if(project==undefined){
        res.status(404).send({message:"project doesnot exist"})
    }
    //if project is existed then delete and send response
    else{
        ProjectModel.destroy({where:{project_id:projectidfromUrl}})
        res.status(200).send({message:"project deleted"})
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
  //send response projectupdates
  res.status(200).send({message:"last two weeks updates details",payload:projectupdates})
})

//admin can get resourcing requests
exports.getResourcingRequest=expressAsyncHandler(async(req,res)=>{
  //to get resourcing request data
 let  getResourceRequestData=await Resourcing_requestModel.findAll({attributes:{
  exclude:["id"]
 } 
 });
 //send response
 res.send({message:"Resourcing request data",payload:getResourceRequestData});
})