import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import noteRouter from './routes/note.route.js';
import authRouter from './routes/auth.route.js'
import cors from 'cors';
dotenv.config();


mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
})

const app = express();

app.use(express.json({ limit: "50mb" }))
app.use(cors());
app.listen(5000, () => {
    console.log("Server is running on port 5000");
})

app.use('/api', userRouter);
app.use('/api', noteRouter);
app.use('/auth', authRouter)