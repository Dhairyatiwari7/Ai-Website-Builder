import express, {Request,Response} from 'express';
import 'dotenv/config';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import cors from "cors";


const app=express();
const PORT=3000;

const corsOptions = {
    origin: process.env.TRUSTED_ORIGINS?.split(',') || [],
    credentials: true,
}
app.use(cors(corsOptions));

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get('/',(req:Request,res:Response)=>{
    res.send('Hello World!');
})

app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
})