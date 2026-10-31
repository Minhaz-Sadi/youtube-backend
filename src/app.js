import express from 'express';



const app = express();
app.use(cors({
    origin: "process.env.CORS_ORIGIN", // all can req server if set *
    Credential: true // client can info/token pass in server
})) 

export default app