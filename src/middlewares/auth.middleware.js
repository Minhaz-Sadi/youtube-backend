import { verify } from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import jwt from "jsonwebtoken"
import { User } from "../model/user.model";




export const verifyJWT = asyncHandler(
    async(req, res, next)=> {
        const token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer", "")
        

        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }


        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        // decodedToken--> _id, username, fullName, email

       const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        
       if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }


        req.user = user
        // we add a new object in req
    }
)