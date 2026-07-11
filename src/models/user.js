const mongooose = require("mongoose")
const validator = require("validator")

const userSchema = new mongooose.Schema({
    firstName:{
        type : String,
        required : true,
        minlength : 3,
        maxlength : 50
    },
    lastName:{
        type:String,

    },
    emailId:{
        type:String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        validate (value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email address : "+ value);
            }
        }
    },
    password:{
        type:String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password");
            }
        }
    },
    age:{
        type:Number,
        min : 18
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not invalid")
            }
        }
    },
    photoUrl:{
        type:String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo url");
            }
        }

    },
    about:{
        type:String,
        default:"This is a default description of a user"
    },
    skills:{
        type:[String]
    }
},{timestamps:true});

module.exports = mongooose.model("User",userSchema);
