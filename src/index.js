// require('dotenv').config({path : './env'})
// import mongoose from "mongoose";
// import {DB_NAME} from "./constants"
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

// Configure dotenv to load environment variables
dotenv.config({ path: './.env' });

const app = express();

// Function to start the server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start the server
        const port = process.env.PORT || 8000;
        app.listen(port, () => {
            console.log(`App is listening on port: ${port}`);
        });

        // Handle server errors
        app.on('error', (error) => {
            console.error("Error:", error);
            throw error;
        });

    } catch (error) {
        console.error("MongoDB connection failed", error);
    }
};

// Start the server
startServer();

export default app;


// import express from "express"
// const app = express()

// (async () =>{
//     try {
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//        app.on("error", (error) => {
//     console.log ("Error:", error);
//     throw error
//        } )

//        app.listen(process.env.PORT, () =>{
//         console.log(`App is listening on port ${process.env.PORT}`);
//        })
//     } catch (error) {
//         console.error("ERROR:", error)
//         throw error
//     }
// })()