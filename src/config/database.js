const mongoose = require("mongoose")

const connectDB = async()=>{
    await mongoose.connect(
        "mongodb+srv://abhi48677:abhi48677@harkirat.1yzspdy.mongodb.net/devTinder"
    );
};
module.exports = connectDB;


 