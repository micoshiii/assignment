import express from "express";
const app = express();
app.use(express.json());

import { prisma } from    "../db";
import { authMiddleware } from "./middlewares/auth.middleware";

import authRouter from "./routes/user.route"
import lessonRouter from "./routes/lesson.route"
import purchaseRouter from "./routes/purchase.route"
import courseRouter from "./routes/course.route"

app.use("/auth" , authRouter);
app.use("/courses" , courseRouter)
app.use("/" , lessonRouter)
app.use("/" , purchaseRouter)

app.get("/me" , authMiddleware, async(req,res)=>{
    const user = await prisma.user.findFirst({
        where: {
            id: req.user!.id,
            role:req.user!.role
        }
    });
    return res.json({
        id: user!.id ,
        role: user!.role , 
        email: user?.email , 
        name: user?.name
    })
});

app.listen(3000 , ()=>{console.log("server is running on port 3000")});