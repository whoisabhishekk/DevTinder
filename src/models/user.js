const mongooose = require("mongoose")


const userSchema = new mongooose.Schema({
    firstName:{
        type : String,

    },
    lastName:{
        type:String
    },
    emailId:{
        type:String
    },
    password:{
        type:String
    },
    age:{
        type:Number
    },
    gender:{
        type:String
    }
});

module.exports = mongooose.model("User",userSchema);
