import express from "express";
import authRouter from "./routes/auth.route";
import classRouter from "./routes/class.router";

import { connectDB } from "./config/db";

const app = express();
app.use(express.json());

app.use("/auth" , authRouter); 
app.use("/class" , classRouter);

connectDB()
.then(()=>{
    app.listen(3000 ,()=>{
        console.log("Server running on port 3000");
    })
}).catch(()=>{
    console.error("Server error...");
})