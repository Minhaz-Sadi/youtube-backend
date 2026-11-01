import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true, // don't get address
        index: true // for find the user
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, // cloudinary url
    },
    coverImage: {
        type: String, // cloudinary url
    },
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        } // single video's details

    ], //  array for multiple video in watch history
    password: {
        type: String,
        required: [true, "password is required"] // massage show
    }
},{
    timestamps: true // time update of creation
})

userSchema.pre("save",  async function() {
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    return next()
})

export const User = mongoose.model('User', userSchema); // User table follows userSchema
