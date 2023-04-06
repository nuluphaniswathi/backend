//import sequelize
const {Sequelize}=require("sequelize")

//configure dotenv by importing dotenv
require("dotenv").config();

//create instance for sequelize
const sequelize=new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host:'localhost',
        dialect:"mysql"
    }
);

//create tables using sync() for all models
sequelize.sync();

//export sequelize
module.exports=sequelize;