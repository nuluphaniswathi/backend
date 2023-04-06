//import jwt web token
const jwt=require("jsonwebtoken");
//import dotenv
require('dotenv').config();

//verifying received token
const verifyToken=(req,res,next)=>{
    
    //token verification logic
    //get bearer token from headers of request object
    let bearerToken=req.headers.authorization;
    console.log(bearerToken);
    //check existance of bearer token
    if(bearerToken===undefined)
    {
        res.status(401).send({message:"unauthorized access"});
    }

    //if bearer token is existed get token from bearer token
    else{
        let token=bearerToken.split(" ")[1];//[bearer,token]
       
        try{
             //decode the token
        let decode=jwt.verify(token,process.env.SECRET_KEY||"");
        console.log(decode);
        if(decode.role==="admin"){
        next()
        }
        else{
            res.status(401).send({message:"unauthorized access..only Admin can access"});
        }
        
        }
        catch(err)
        {
            res.status(401).send({message:"please relogin to continue..."})

        }

    }
    //decode the token=verification
}
//export
module.exports=verifyToken;