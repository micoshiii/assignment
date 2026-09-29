import type { Request , Response } from "express";
import { ClassSchema , StudentSchema } from "../validators/schema";
import { ClassModel } from "../models/class.model";
import { ApiResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";
import { UserModel } from "../models/user.model" ;
import mongoose from "mongoose";

export const createClass = async(req:Request , res:Response)=>{
    const {data , success} = ClassSchema.safeParse(req.body);
    if(!success){
        return res.status(400).json(new ApiError("Invalid request schema"));
    }

    const { className } = data;

    const result =  await ClassModel.create({
        className , 
        teacherId: req.user.id , 
        studentIds: []
    });

    return res.status(201).json(new ApiResponse({
        _id: result._id,
      className: result.className,
      teacherId: result.teacherId,
      studentIds: result.studentIds,
    }))

}

export const addStudent = async(req:Request , res:Response)=>{
    const {data , success} = StudentSchema.safeParse(req.body);
    
    if(!success){
       return res.status(400).json(new ApiError("Invalid request schema"));  // bcoz this checks the schema
    }

     const { studentId } = data ;

    const classId = req.params.id as string ;

    const existingClass = await ClassModel.findById(classId);

    if(!existingClass){
        return res.status(404).json(new ApiError("Class not found")); // writing return is extremely important !!
    }

    if(existingClass.teacherId?.toString() !== req.user.id){
        return res.status(403).json(new ApiError("Forbidden, not class teacher"));
    }

    const student = await UserModel.findById(studentId);

    if(!student){
        return res.status(404).json(new ApiError("Student not found"));
    }
    
    const studentObjectId = new mongoose.Types.ObjectId(studentId); //converting string to objectId 
    if(!existingClass.studentIds.includes(studentObjectId)){
        existingClass.studentIds.push(studentObjectId);
        await existingClass.save();
    }

    return res.status(200).json(new ApiResponse({
        _id : existingClass._id,
        className : existingClass.className ,
        teacherId : existingClass.teacherId ,
        studentIds : existingClass.studentIds
    }))

}

export const classInfo = async(req:Request , res:Response )=>{
    const classId = req.params.id as string;

    const classInfo = await ClassModel.findById(classId).populate({
        path: "studentIds" ,
        select: "_id name email"
    });

    if(!classInfo){
        return res.status(404).json(new ApiError("Class not found"))
    };

    const isTeacher = 
    req.user.role === "teacher" && 
    req.user.id === classInfo.teacherId?.toString(); //Is this particular user the teacher assigned to THIS class?

    const isEnrolledStudent =
    req.user.role === "student" &&
    classInfo.studentIds.some( (s)=> s._id.toString() === req.user.id);

    if(!isTeacher && !isEnrolledStudent){
        return res.status(403).json(new ApiError("Forbidden, not class teacher"))
    }
   

    return res.status(200).json(new ApiResponse({
        _id: classInfo._id ,
        className : classInfo.className ,
        teacherId : classInfo.teacherId ,
        students : classInfo.studentIds ,
    }))

}