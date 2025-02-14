require("dotenv").config();
require("./config/dbConfig.js");
const PORT = process.env.PORT || 5000;
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const User = require("./models/userModel.js");
//----------------------------------------------------------------------------------

const app = express();


//----------------------------------------------------------------------------------
app.use(cors());
app.use(express.json());
app.use((req,res,next)=>{
    console.log("request received -->", req.url);
    next(); 
});

app.use(morgan("dev"));

app.get("/users",(req,res)=>{
    try{



    }catch(err){
        console.log("Error in GET /users");
        console.log(err.message);
        res.status(500);
        res.json({
            status:'fail',
            message: "Internal Server Error"
    })
        
        
    }

});
app.post("/users",async (req,res)=>{
    try{

        const userInfo = req.body;
        const newUser = await User.create(userInfo);
        res.status(201);
        res.json({
            status:"success",
            data:{
                user:{
                    email: newUser.email,
                    fullName:newUser.fullName,
                },
            },

    });

    }catch(err){
        console.log("Error in POST /users");
        console.log(err.name,err.code);
        console.log(err.message);
        if(err.name =="ValidationError"){
            res.status(400);
            res.json({
                status:"fail",
                message:"Data validation failed" +err.message,
            });

        }else if(err.code === 11000){
            res.status(400);
            res.json({
                status:"fail",
                message:"Email already exists",
            })
        }
        else{
        res.status(500);
        res.json({
            status:'fail',
            message: "Internal Server Error"
        });
    }

    }

});





//----------------------------------------------------------------------------------

app.listen(PORT,()=>{
    console.log(`--------------------------Server Started on PORT: ${PORT}--------------------------`);
    
});