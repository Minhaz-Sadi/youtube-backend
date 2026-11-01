import express from 'express';
import cors from 'cors';
import userRouter from "./routes/user.route.js"

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN, // all can req server if set *
    credentials: true // client can info/token pass in server
})) 

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

// users ---> Router

// localhost:3000/api/v1/users/register
app.use("/api/v1/users", userRouter)
// app.use("api/v1/video", videoRouter)

export default app