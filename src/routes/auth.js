const express = require("express")
const authRouter = express.Router();
const validateSignupData = require("../utils/validation")
const User = require("../models/user");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");


//signup api
authRouter.post("/signup", async (req, res) => {

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

//login api
authRouter.post("/login", async (req, res) => {
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

module.exports = authRouter;