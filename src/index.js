const express = require("express");
const mongoose = require('mongoose');

const cors = require('cors');
require("dotenv").config();

const { PORT, MONGODB_URI, NODE_ENV, ORIGIN} = require('../config');
const { API_ENDPOINT_NOT_FOUND_ERR, SERVER_ERR}= require('../error');



// routes

const authRoutes = require('../routes/auth.route');

//init express app
 const app = express();


 //middlewares
 app.use(express.json());

 app.use(
    cors({
        credentials:true,
        origin:ORIGIN,
        optionsSuccessStatus:200,
    })
 );

//log in development environment

if (NODE_ENV==='development'){
    const morgan = require("morgan");
    app.use(morgan("dev"));
}

// index routes

app.get('/',(req,res)=>{
    res.status(200).json({
        type:"success",
        message:"Server is up and running",
        data:null,
    });
});


// routes middleares

app.use("/api/auth", authRoutes);

// page not found error handling middleware

app.use("*", (req, res, next)=>{
    const error={
        status: 404,
        message:API_ENDPOINT_NOT_FOUND_ERR,
    };
    next(error);
});


// global error handling middleware

app.use((err, req, res, next)=>{
    console.log(err);
    const status = err.status || 500;
    const message = err.message || SERVER_ERR;
    const data = err.data || null;

    res.status(status).json({
        type:"error",
        message,
        data,
    });
});

async function main(){
    // console.log("hereeeeee")
    try{
        // await mongoose.connect(MONGODB_URI, {
        //     useNewUrlParser:true,
        //     useCreateIndex: true,
        //     useFindAndModify: false,
        //     useUnifiedTopology:true,
        // });

        const MongoClient = require('mongodb').MongoClient
        const MONGOURI = "mongodb://localhost:27017/mbev2";
        const InitiateMongoServer = async () => {
            MongoClient.connect(MONGOURI, { promiseLibrary: Promise,useUnifiedTopology: true }, (err,client) => {
                if(err){
                    console.log("Error in Mongo Connection",err);
                }
                global.db = client.db("mbev1");
                console.log("MongoDB Connection Successfull")
            })
        };

        console.log("Database connected");

        app.listen(PORT, ()=> console.log(`Server listening on the port ${PORT}`));
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}

main();
