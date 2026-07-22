require('dotenv').config(); // must be first
console.log("ENV:", process.env.DB_CONNECT_STRING); // add this
console.log("PORT:", process.env.PORT);  
const express = require('express');
const app = express();
const main = require('./config/db');
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/userAuth");
const redisClient = require('./config/redis');

app.use(express.json());
app.use(cookieParser());

app.use('/user',authRouter);


const InitalizeConnection=async ()=>{
    try{

        await Promise.all([main(),redisClient.connect()]);
        console.log("DB Connected");

        app.listen(process.env.PORT, ()=>{
            console.log("Server listening at port number: "+ process.env.PORT);
        })
    }
    catch(err){
        console.log("Error: "+err);
    }
}

InitalizeConnection();
