import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String, // cloudinary url
        required: true
    },
    thumbnail: {
        type: String, // cloudinary url
        required: true
    },
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    duration: {
        type: String,  // cloudinary url
        // when we uplaod in thing in cloudinary we can get the duration
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    videoUploader: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" // user details, like mySQL relation 

    }
   
},{
    timestamps: true
})


export const Video = mongoose.model('Video', videoSchema); // Videos(auto mongobd creates)


/*

workflow -->

user uplaod file  --> store this file in our local disk storage(multer package)
--> from local we upload the file in cloudinary
--> loacal stoage file delete

*/