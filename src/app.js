const express = require("express");
const bcrypt = require("bcrypt")
const connectDB = require("../src/confiq/database");
const User = require("../src/models/User");
const validateSignupData = require("../src/utils/validation")

const app = express();

app.use(express.json());


//NOTE - Signup api
app.post("/signup",async (req,res)=>{
    
    //ANCHOR - Validate the data
    validateSignupData(req.body);

    //ANCHOR - Encryption of password
    const {firstName , lastName , emailId , password} = req.body;
    const passwordHash = await bcrypt.hash(password,10);

    //ANCHOR - Storing user data in DB
    const user = new User({
        firstName,
        lastName,
        emailId,
        password : passwordHash
    });
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

//ANCHOR - Login api
app.post("/login", async (req,res)=>{
    try{
        const {emailId,password} = req.body;
        
        //NOTE - Check user is availbale in my db or not
        const user = await User.findOne({emailId});
        if(!user){
            throw new Error("Invalid credentials");
        }

        //NOTE - Checking password using bcrypt
        const isPasswordValid = bcrypt.compare(password,user.password);

        if(isPasswordValid){
            res.send("Login Successfully!!!")
        } else{
            throw new Error("Invalid credentials")
        }

    } catch(error){
        res.status(400).send("Error :"+error);
    }
});

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
