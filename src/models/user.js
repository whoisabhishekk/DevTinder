const bcrypt = require("bcrypt")
const mongooose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")


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

// JWT token generation method
userSchema.methods.getJwtToken = async function (){

    const user = this;

   const token = await jwt.sign({ _id: user._id }, "abhishek" , {expiresIn : '1d'});
   return token;
}

// Password Validation
userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
}

module.exports = mongooose.model("User",userSchema);
