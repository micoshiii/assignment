import{request, type Request , type Response} from "express";
import { prisma } from "../../db";
import { CreateLessonSchema } from "../validators/schema.validator";

export const createLesson = async (req:Request , res:Response)=>{
    const { success , data} = CreateLessonSchema.safeParse(req.body);

    if(!success){
       return res.status(401).json({message: "couldnt find the data"});
    }
    const {title , content , courseId} = data;

    const lesson = await prisma.lesson.create({
        data:{
            title,
            content,
            courseId
        }
    });

    return res.status(200).json(data);
}

export const getLessons = async(req:Request , res:Response)=>{
    const lesson = await prisma.lesson.findMany({
        where:{
            courseId:req.params.courseId as string, 
        }
    });

    if(!lesson){
        return res.status(401).json({message: "invalid course id"});
    }

    return res.json(lesson);
}