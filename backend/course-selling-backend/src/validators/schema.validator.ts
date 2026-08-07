import { z } from "zod";

export const SignupSchema= z.object({
    email: z.email() ,  //valid email hona chhaiye 
    password: z.string().min(6) ,
    name: z.string() ,  // name bss string hona chahiye
    role: z.enum(["STUDENT" , "INSTRUCTOR"])
});

export const LoginSchema = SignupSchema.pick({
    email: true,
    password: true
});

export const CreateCourseSchema = z.object({
    title: z.string().min(1) , 
    description: z.string().min(1) ,
    price: z.int()
});

export const LessonSchema= z.object({
    title: z.string().min(1) ,
    content:z.string() ,
    courseId: z.string()
});

export const PurchaseCourseSchema= z.object({
    courseId: z.string()
});
