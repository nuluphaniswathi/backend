//importing express module
const exp=require("express");

//creating express mini router
const GdoHeadApp=exp.Router();

//import gdohead middleware
let verifyToken=require('../middleware/gdohead.middleware');

//bodyparser
GdoHeadApp.use(exp.json())


//import gdohead controllers
const {team,resourcerequest,getProjects,
    getSpecificProjectDetails,updateTeamByGdo,deleteTeamByGdo,lastTwoWeeksUpdates}=require("../controllers/gdohead.controller")

//route to create team by gdohead
GdoHeadApp.post("/team",verifyToken,team);

//route to create resource request by gdohead
GdoHeadApp.post("/projectId/:projectId/resourcing-request",verifyToken,resourcerequest); 

//route to get all projects under specific gdohead
GdoHeadApp.get("/projects/gdoemail",verifyToken,getProjects);

//route to get specific project details under specific gdohead
GdoHeadApp.get("/projectId/:projectId/gdoemail/",verifyToken,getSpecificProjectDetails)

//route to get lastweeksupdates 
GdoHeadApp.get("/projectupdate/lasttwoweeks/projectId/:projectId",lastTwoWeeksUpdates);

//route to update team member of the project by gdohead
GdoHeadApp.put("/projects/teamcomposition/updateteam/projectId/:projectId/Empid/:empId",verifyToken,updateTeamByGdo)

//route to delete team member of specific project by gdohead
GdoHeadApp.delete("/teamcomposition/deleteteam/projectId/:projectId/Empid/:Empid",verifyToken,deleteTeamByGdo)


//default export of gdoheadapp
module.exports=GdoHeadApp;