//importing express module
const exp = require("express");

//creating express application
const app = exp();

//for application protection
const helmet=require('helmet')
//it returns helmet middleware to hide the details of express implementation
//it is for security of backend
app.use(helmet())

//import dotenv and configure
require("dotenv").config();
//cors enables express application access control to allow restricted resources from being accesesd 
//from external domains
const cors = require('cors')
//middleware
app.use(cors())
//bodyparser
app.use(exp.json());

//importing sequelize from db.config.js
const sequelize = require("./db/db.config.js");
//creating port
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`http server runiing on ${port}`))

//connecting build of react app with nodejs web server
// const path=require("path");
// console.log("path:",path);
//to server static files use express.static() middleware function method
// app.use(exp.static(path.join(__dirname,"../build")))


//establlishing db connection using sequelize
sequelize.authenticate()
    .then(() => console.log("DB conection is suceess"))
    .catch(err => console.log("err in DB connection", err))

//importing userapi,superadminapp,adminapp,gdoheadapp,projectmanagerapp
const userApp = require("./routes/users.route")
const SuperadminApp = require("./routes/superadmin.route")
const adminApp = require("./routes/admin.route")
const GdoHeadApp = require("./routes/gdohead.route")
const ProjectManagerApp = require("./routes/projectmanager.route")


//middlewares for route
app.use("/user-api", userApp);
app.use("/admin-api", adminApp);
app.use("/gdoHead-api", GdoHeadApp);
app.use("/project-manager-api", ProjectManagerApp)
app.use("/superadmin-api", SuperadminApp)



//page refresh
// app.use((req,res)=>{
//     res.sendFile(path.join(__dirname,"../build/index.html"))
// })

app.use((err, req, res, next) => {
    res.status(400).send({ message: "error", payload: err })
})

//invalid path middleware
app.use("*", (req, res, next) => {
    res.status(400).send({ message: "invalid path" })
})

//default errror handling middleware
app.use((err, req, res, next) => {

    res.status(400).send({ "errMsg": err.message });
})


//module.exports=app