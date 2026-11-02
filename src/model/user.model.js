import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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
    // next()
})



userSchema.method.generateAccessToken = function(){
    return jwt.sign(
        {
            // payload;
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },

        // access_token_secret
        process.env.ACCESS_TOKEN_SECRET,

        {
            // expiry
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.method.generateRefreshToken = function(){
    return jwt.sign(
        {
            // payload;
            _id: this._id,

        },
        
        // access_token_secret
        process.env.REFRESH_TOKEN_SECRET,
        
        {
            // expiry
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}





export const User = mongoose.model('User', userSchema); // User table follows userSchema
