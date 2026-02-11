import express, {Request,Response} from 'express';
import 'dotenv/config';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import cors from "cors";
import userRouter from './routes/userRoutes.js';
import projectRouter from './routes/projectRoutes.js';
import { stripeWebHook } from './controllers/StripeWebhook.js';


const app=express();
const PORT=3000;

const corsOptions = {
    origin: process.env.TRUSTED_ORIGINS?.split(',') || [],
    credentials: true,
}
app.use(cors(corsOptions));
app.post('/api/stripe',express.raw({type: 'application/json'}),stripeWebHook)
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json({
    limit: '50mb'
}))

app.get('/',(req:Request,res:Response)=>{
    res.send('Hello World!');
})
app.use('/api/user',userRouter)
app.use('/api/project',projectRouter)

app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
})
