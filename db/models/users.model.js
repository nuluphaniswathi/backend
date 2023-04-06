//importing sequelize from database
const sequelize=require("../db.config");

//importing datatypes from sequelize
const {DataTypes}=require("sequelize");

//creating user model
exports.UserModel=sequelize.define("user",{
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            //validating email
            checkEmail(email){
                //split with @
                let result=email.split("@")
                console.log(result)
                //check if email ends with westa
                if(result[1]!="westagilelabs.com"){
                    throw new Error("Email should end with @westagilelabs.com")
                }
                else{
                    console.log("Email validated")
                }
            }

        }
    },
    user_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    role:{
        type:DataTypes.STRING,
        defaultValue:null

    }
},{
    timestamps:false,
    freezeTableName:true
})
