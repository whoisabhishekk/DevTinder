const express = require("express");
const connectDB = require("../src/confiq/database");
const cookieParser = require("cookie-parser")

//importing api routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRequestRouter = require("./routes/request");

// using middlewares
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",connectionRequestRouter);

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