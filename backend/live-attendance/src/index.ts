import { connectDB } from "./config/db";
import { app , server } from "./server";

import express from "express";

import authRouter from "./routes/auth.route";
import classRouter from "./routes/class.router";
import studentRouter from "./routes/student.route";
import attendanceRouter from "./routes/attendance.route";


app.use(express.json());

app.use("/auth" , authRouter); 
app.use("/class" , classRouter);
app.use("/students" , studentRouter);
app.use("/attendance" , attendanceRouter)

connectDB()
.then(()=>{
    server.listen(3000 ,()=>{
        console.log("Server running on port 3000");
    })
}).catch(()=>{
    console.error("Server error...");
})