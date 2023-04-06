//import sequelize from db config
const sequelize=require("../db.config");

//import datatypes from sequelize
const {DataTypes}=require("sequelize");


//creating employee model using define method
exports.EmployeeModel=sequelize.define("employees",{
    emp_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    emp_name:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    timestamps:false,
    freezeTableName:true
})