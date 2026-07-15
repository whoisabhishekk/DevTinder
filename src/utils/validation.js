const validator = require("validator")


const validateSignupData = (data)=>{
    const {firstName,lastName,emailId,password} = data;

    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }

    else if(!validator.isEmail(emailId)){
        throw new Error("Invalid emailid")
    }

    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password!")
    }
};

module.exports = validateSignupData;