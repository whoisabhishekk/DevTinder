const express = require("express")
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

// profile/view api
profileRouter.get("/profile/view", userAuth, async (req, res) => {

    try {
        const user = req.user;

        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

// profile/edit api
profileRouter.patch("/profile/edit", userAuth ,async(req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid edit request");
        }

        const user = req.user;
        Object.keys(req.body).forEach(key=>{
            user[key] = req.body[key];
        });
        await user.save();
        res.send(`${user.firstName} , your profile has been updated successfully! `);

    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
    
})
module.exports = profileRouter;