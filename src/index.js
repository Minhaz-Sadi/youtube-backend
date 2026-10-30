import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

dotenv.config({
    path: './.env'
})
const app = express();

// IIFE (Immediately Invoked Function Expressions)
;(
   async () => {
        try {
            await mongoose.connect(`${process.env.MONGODB_URI}/youtube`);
            console.log("Successfully Conneted to Database");
            // if another error comes after connect
            app.on("error", (error)=>{
                console.log("ERROR : ", error);
                throw error;
            })

            // server listen
            app.listen(process.env.PORT, () => {
                console.log(`listening on port ${process.env.PORT}`);
            })
            
        } 
        catch (e) {
            console.error("ERROR : ", e);
            throw e;
        }
        
    }
) 
();


