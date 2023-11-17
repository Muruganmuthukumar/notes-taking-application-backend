import express from 'express';
import mongoose from 'mongoose'; 
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import noteRouter from './routes/note.route.js';
import bodyParser from 'body-parser';
import cors from 'cors';
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
})

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.listen(5000,()=>{
    console.log("Server is running on port 5000");
})

app.use('/api', userRouter);
app.use('/api',noteRouter);