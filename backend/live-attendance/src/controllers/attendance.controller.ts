import type { Request , Response } from "express";
import { AttendanceSchema } from "../validators/schema";
import { ApiError } from "../utils/apiError";
import { ClassModel } from "../models/class.model";
import { activeSession } from "../store/activeSession.store";
import { ApiResponse } from "../utils/apiResponse";

export const startAttendance = async(req:Request , res:Response)=>{
    const { success , data} = AttendanceSchema.safeParse(req.body);

    if(!success){
        return res.status(400).json(new ApiError("Invalid request schema"));
    }

    const { classId } = data;

    const existingClass = await ClassModel.findById(classId);

    if(!existingClass){
        return res.status(404).json(new ApiError("Class not found"));
    }

    if(existingClass.teacherId?.toString() !== req.user.id){
        return res.status(403).json(new ApiError("Forbidden, not class teacher"));
    }

    //now u gotta update in the activeSession ;
    activeSession.classId = classId;
    activeSession.startedAt = new Date().toISOString();
    activeSession.attendance = {} 

    const result ={
        classId: activeSession.classId ,
        startedAt: activeSession.startedAt ,
    };

    return res.status(200).json(new ApiResponse(result));

};