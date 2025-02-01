const mongoose = require("mongoose");


const DB = process.env.DATABASE;

mongoose.connect(DB).then(()=>{
    console.log("Connection with database successful")}).catch((e)=>{
        console.log("No connection");
    
})