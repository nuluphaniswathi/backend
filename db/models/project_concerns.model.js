//importing sequelize from database
const sequelize=require("../db.config");

//importing datatypes from sequelize
const {DataTypes}=require("sequelize");

//creating projectconcerns model
exports.project_concernsModel=sequelize.define("project_concerns",{
    project_id:{
        type:DataTypes.INTEGER,
    },
    concern_desc:{
        type:DataTypes.STRING,
        allowNull:false
    },
    raised_by:{
        type:DataTypes.STRING,
        allowNull:false
    },
    raised_on_date:{
        type:DataTypes.DATE,
        allowNull:false
    },
    severity:{
        type:DataTypes.STRING,
        allowNull:false
    },
    concern_raised_internally:{
        type:DataTypes.STRING,
        allowNull:false
    },
    status:{
        type:DataTypes.STRING,
        allowNull:false

    },
    mitigated_on:{
        type:DataTypes.DATE,
        allowNull:false
    }

},{
    timestamps:false,
    freezeTableName:true
})
//sequelize.sync({force:true})