const express = require("express");
const connectDB = require("../src/confiq/database");
const User = require("../src/models/User");

const app = express();

app.use(express.json());

app.post("/signup",async (req,res)=>{
    const user = new User ({
        firstName:"Abhishek",
        lastName:"Kumar",
        emailId:"Abhi@gmail.com",
        password:"12345"
    }); 

    try{
        await user.save();
        res.send("signup successfull")

    } catch(err){
        console.log("Error :"+err);
    }
})

connectDB()
    .then(()=>{
        console.log("Database established");
        app.listen(8787,()=>{
            console.log("Server is running at port 8787");
        })
    }).catch(err=>{
        console.log("Dabatabe not connected");
        console.log("Error:" + err); 
    })
