//importing sequelize
const sequelize=require("../db.config");
//importing datatypes
const {DataTypes}=require("sequelize");

//create team_composition model
exports.team_CompositionModel=sequelize.define("team_composition",{
    project_id:{
        type:DataTypes.INTEGER
    },
    emp_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    emp_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    role:{
        type:DataTypes.STRING,
        allowNull:false
    },
    start_date:{
        type:DataTypes.DATE,
        allowNull:false
    },
    end_date:{
        type:DataTypes.DATE,
        allowNull:false
    },
    status:{
        type:DataTypes.STRING,
        allowNull:false
    },
    billing_status:{
        type:DataTypes.STRING,
        allowNull:false
    },
    exposed_to_customer:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    allocation_type:{
        type:DataTypes.STRING,
        allowNull:false

    }


},{
    timestamps:false,
    freezeTableName:true
})
