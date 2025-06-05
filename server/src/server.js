import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import dbConnection from './dbConfig/dbConnection.js';
import userRouter from './routes/userRoutes.js';
import blogRouter from './routes/blogRoutes.js' 
import path from 'path'

dotenv.config();
const port = process.env.PORT || 8001;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true               
}));
app.use("/photo_user", express.static(path.join(process.cwd(), "photo_user")));
app.use('/photo_blog', express.static(path.join(process.cwd(), "photo_blog")));

// database
dbConnection();


// routes
app.use('/blog_app/api', userRouter);
app.use('/blog_app/api', blogRouter);
app.use("/photo_user", express.static("photo_user"));

// server 
app.listen(port, () => {
    console.log(`server run on port : ${port}`);
})