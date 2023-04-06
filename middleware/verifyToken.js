//import jwt web token
const jwt=require("jsonwebtoken");

//configure dotenv
require('dotenv').config();


const verifyToken=(req,res,next)=>{
    console.log("verify token")
    //token verification logic
    //get bearer token from headers of request object
    let bearerToken=req.headers.authorization;
    //console.log(bearerToken);
    //check existance of bearer token
    if(bearerToken===undefined)
    {
        res.status(401).send({message:"unauthorized access"});
    }

    //if bearer token is existed get token from bearer token
    else{
        let token=bearerToken.split(" ")[1];//[bearer,token]
       
        try{
             //decode the token using jwt verify method
        let decoded=jwt.verify(token,process.env.SECRET_KEY);

        next()
        //res.status(200).send({message:"authenticated"})
        }
        catch(err)
        {
            res.send({message:"please relogin to continue..."})

        }


    }
    //decode the token=verification
}
//export
module.exports=verifyToken;