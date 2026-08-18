import type { Request , Response , NextFunction} from "express";
import { prisma } from "../../db";
import { PurchaseCourseSchema } from "../validators/schema.validator";

export const purchaseCourse = async (req:Request , res:Response)=>{
    const { success , data } = PurchaseCourseSchema.safeParse(req.body);

    if(!success){
        return res.status(401).json({message: "invalid purchase"});
    }
    
    const { courseId} = req.body;

    const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });
  if (!course) {
    return res.status(404).json("course not found");
  }
  const purchase = await prisma.purchase.create({
    data: {
      userId: req.user!.id,
      courseId,
      cost: course.price,
    },
  });

  return res.json(purchase);
}

export const purchaseCoursesOfUser = async(req:Request , res:Response)=>{
    const userId= req.params.id as string;
    if (req.user!.id !== userId) {
    return res.status(403).json("forbidden");
  }
  const purchases = await prisma.purchase.findMany({
    where: {
      userId,
    },
    include: {
      course: true,
    },
  });

  return res.json(purchases);

}