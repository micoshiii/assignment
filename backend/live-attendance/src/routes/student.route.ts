import { Router } from "express";
import { OnlyTeacher, verifyUser } from "../middleware/auth.middleware";
import type{ Request , Response } from "express";
import { UserModel } from "../models/user.model";
import { ApiResponse } from "../utils/apiResponse";

const router = Router();

router.get("/" , verifyUser , OnlyTeacher , async(req:Request , res:Response)=>{
    const students = await UserModel.find({
        role: "student"
    }).select("_id name email");



    return res.status(200).json(new ApiResponse(students));
})
export default router;