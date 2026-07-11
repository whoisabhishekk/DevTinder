const express = require("express");
const connectDB = require("../src/confiq/database");
const User = require("../src/models/User");


const app = express();

app.use(express.json());


//NOTE - Signup api
app.post("/signup",async (req,res)=>{
    const user = new User(req.body);
    try{
        await user.save();
        res.send("signup successfull")

    } catch(err){
        console.log("Error :"+err);
    }
})

//NOTE - get user by email
app.get("/user", async (req,res)=>{
    const userEmail = req.body.emailId;

    try{
        const users = await User.find({emailId : userEmail});
        if(users.length === 0){
            res.status(404).send("User doesnt found");
        }
        res.send(users);
    } catch(error){
        res.status(400).send("Error:"+error)
    }
})

//NOTE - Feed API - GET /feed - get all the users from the database
app.get("/feed" , async(req,res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }catch(error){
        res.status(400).send("Error:"+error)
    }

})

//NOTE - delete a user
app.delete("/user",async (req,res)=>{
    const userId = req.body.userId;
    try{
       await User.findByIdAndDelete({_id : userId });
        res.send("User deleted successfully");
    } catch(error){
        res.status(400).send("Error:"+error)
    }
})


//NOTE - Update data of the user
app.patch("/user/:userId" , async (req,res)=>{
    
    const userId = req.params?.userId;
    try{
        const ALLOWED_UPDATES = ["about","photoUrl","gender","age","skills"];

        const isUpdateAllowed = Object.keys(data).every((k)=>{
        ALLOWED_UPDATES.includes(k);
        })

        if(!isUpdateAllowed){
            throw new Error("Update not allowed")
        }

        if(data.skills.length > 10){
            throw new Error("Skill can be more than 10")
        }
        
        const user = await User.findByIdAndUpdate(userId , data,{
            returnDocument:"after",
            runValidators:true
        })
        res.send("User updated successfully");

    }catch(error){
        res.status(400).send("Error:"+error)
    }
})

//ANCHOR - DB connection
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
