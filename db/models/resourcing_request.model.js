//importing sequelize from db
const sequelize=require("../db.config");

//importing datatypes from sequelize
const {DataTypes}=require("sequelize");

//creating resourcing_request model
exports.Resourcing_requestModel=sequelize.define("resourcing_request",{
    
    gdoemail:{
        type:DataTypes.STRING,
        allowNull:false
    },
    project_id:{
        type:DataTypes.INTEGER
    },
    request_desc:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    timestamps:false,
    freezeTableName:true
})
