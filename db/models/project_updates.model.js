//importing sequelize
const sequelize=require("../db.config");

//importing datatypes
const {DataTypes}=require("sequelize");

//creating projectupdates model
exports.project_updatesModel=sequelize.define("project_updates",{
    project_id:{
        type:DataTypes.INTEGER
    },
    Date:{
        type:DataTypes.DATE,
        allowNull:false
    },
    status_update:{
        type:DataTypes.STRING,
        allowNull:false
    },
    schedule_status:{
        type:DataTypes.STRING,
        allowNull:false

    },
    resourcing_status:{
        type:DataTypes.STRING,
        allowNull:false

    },
    quality_status:{
        type:DataTypes.STRING,
        allowNull:false
    },
    client_inputs:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    }

},{
    timestamps:false,
    freezeTableName:true

})