import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./routes/index";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;


mongoose.connect(process.env.MONGO_URI as string)
.then(()=>{console.log("successfully connected to mongoDB")})
.catch((err)=>{console.error("error connecting to mongoDB" , err)})

app.use("/api/v1", router);
app.listen(port,()=>{
    console.log(`successfully connected to port ${port}`);
})