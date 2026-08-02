const mongoose = require("mongoose");

const connectionReqSchema = new mongoose.Schema({

    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status:{
        type: String,
        enum:{
            values : ["ignore", "accepted", "rejected","interested"],  
            message : `{VALUE} is not a valid status!`,
        },
        default: "interested"
    }
},{timestamps:true});

connectionReqSchema.pre("save",async function(next){
    const connectionRequest = this;

    //condition to stop duplicate request
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself");

    }
    next();
})

module.exports = mongoose.model("ConnectionRequest" , connectionReqSchema); 