const express = require("express")
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

//sendConnectionRequest api
requestRouter.post("/sendConnectionRequest",userAuth,async (req , res)=>{

    const user = req.user;
    
    //sending connection request
    res.send(user.firstName + " Sent the connection request");
})

module.exports = requestRouter;