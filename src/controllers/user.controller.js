import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import mongoose from "mongoose"
import {User} from "../model/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"


const registerUser = asyncHandler(async (req, res) => {
    
    console.log("Register controller hit!");

    /*
    1) get user info from fronted
    2) validate user info -> empty
    3) check if user all ready exists in DB
    4) check for images 
    5) upload them to cloudinary
    6) check if images uploaded to cloudinary to successfully
    7) create user object -> create user entry in DB (mongodb)
    8) check for user creation
    9) return a response
     */

    // step-1
    const {fullName, email, username, password} = req.body


    console.log("Request Body:", req.body);
    console.log("Full Name:", fullName);
    console.log("Email:", email);
    console.log("Username:", username);
    // step-2
    // if([fullName, email, username, password].some((field)=>field.trim() == "")){
    //     throw new ApiError(400, "all fiedls are required")
    // }
    if ([fullName, email, username, password].some((field) => !field || !field.trim())) {
    throw new ApiError(400, "All fields are required");
}

    // step-3
    const existedUser = await User.findOne({
        $or:[
            {username}, {email}
        ]
    })

    if(existedUser){
        throw new ApiError(405, "user already exists")

    }




    // step-4
    const avatarLocalPath = req.files?.avatar[0]?.path
    let coverImageLocalPath;
    if(req.files && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files?.coverImage[0]?.path
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "avatar not found")

    }

    console.log(req.files);
    console.log(avatarLocalPath);

    // step-5
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(400, "avatar not found")
    }


    

    //step-6
    const user = await User.create({
        fullName: fullName,
        // email: email, 
        // password: password,
        // if their field name same, we can write just one time
        email,
        password,
        username: username.toLowerCase(),
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })

    // step-7
    const createdUser = await User.findById(user._id).select("-password")

    // step-8
    if(!createdUser){
        throw new ApiError(500, "data not found, something went wrong !!!")
    }

    // step-9
    return res.status(201).json(
        new ApiResponse(201, createdUser, "user Registered Successful")
    )
   
})



const loginUser = asyncHandler(async (req, res) => {
    
    console.log("Login controller hit!");

    /*
    1) we have to extarct the data from req
    2) check
    3) find the user
    4) password check
    5) generate accessd and refresh toekn 
    6) refresh token save in DB
    7) cookies --> save reshesh and access token
    8) response
    */

    const {email, username, password} = req.body
    // test
    console.log(email, username, password);
    
    if(!username && !email){
        throw new ApiError(400, "username and email required")
    }

    const user = await User.findOne({
        $or: [
            {email}, {username}
        ]
    })

    //3rd step
    if(!user){
        throw new ApiError(404, "user is not found !!!")
    }


    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid Password")

    }

    // step-5

    const accessToken = await user.generateAccessToken();

    const refreshToken = await user.generateRefreshToken();


    //step-6
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    if(!loggedInUser){
        throw new ApiError(500, "Something went wrong")

    }

    const options = {
        httpOnly: true,
        secure: true
    }


    return res
    .status(200)
    .cookie("access_token", accessToken, options)
    .cookie("refresh_token", refreshToken, options)
    .json(
        new ApiResponse(200, {
            user: loggedInUser,
            accessToken,
            refreshToken
        }
    ,"user logged in successfully")
    )



})




// logout

const logoutUser = asyncHandler(async(req, res) => {
    // 1. find ta user
    // 2.update its refresh token value to undefined
    // 3. cookies --> refresh ans access token clear
    // 4. send a response

    await User.findByIdAndUpdate(
        req.user,{
            $sunset: {
                
            } 
        }
    )
})


export {registerUser, loginUser, logoutUser}