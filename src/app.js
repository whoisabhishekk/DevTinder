const express = require("express");
const bcrypt = require("bcrypt")
const connectDB = require("../src/confiq/database");
const User = require("./models/user");
const validateSignupData = require("../src/utils/validation")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");


//Making app using express
const app = express();


//Middlewares
app.use(express.json());
app.use(cookieParser());

//APIs

//Signup api
app.post("/signup", async (req, res) => {

    //Validate the data
    validateSignupData(req.body);

    //Encryption of password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    //Storing user data in DB
    const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash
    });
    try {
        await user.save();
        res.send("signup successfull")

    } catch (err) {
        console.log("Error :" + err);
    }
})


//Profile
app.get("/profile", userAuth, async (req, res) => {

    try {
        const user = req.user;

        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

//Login APi
app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        //Check user is availbale in my db or not
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("Invalid credentials");
        }

        //Checking password using bcrypt
        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {

            //create a jwt token
            const token = await user.getJwtToken();

            //add the token to cookie and send the response to the user
            res.cookie("token", token);
            res.send("Login successful!!!");

        } else {
            throw new Error("Invalid credentials")
        }

    } catch (error) {
        res.status(400).send("Error :" + error);

    }
});

app.post("/sendConnectionRequest",userAuth,async (req , res)=>{

    const user = req.user;
    
    //sending connection request
    res.send(user.firstName + " Sent the connection request");
})
//DB connection 
connectDB()
    .then(() => {
        console.log("Database established");
        app.listen(8787, () => {
            console.log("Server is running at port 8787");
        })
    }).catch(err => {
        console.log("Dabatabe not connected");
        console.log("Error:" + err);
    })