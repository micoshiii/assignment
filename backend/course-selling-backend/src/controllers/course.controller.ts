import{request, type Request , type Response} from "express";
import { prisma } from "../../db";
import { CreateCourseSchema } from "../validators/schema.validator";

const createCourse = async (req:Request , res:Response)=>{
    const {data , success } = CreateCourseSchema.safeParse(req.body);

    if(!success){
        return res.status(400).json({ message: "invalid input"});
    }

    const instructorId = req.user!.id;

    const {title , description , price } = data;

    const course= await prisma.course.create({
        data:{
            title ,
            description,
            price,
            instructorId

        }
    });

    return res.json({ message: "course created " , id:course.id});

};

const getAllCourse = async(req:Request , res:Response)=>{
    const page = Number(req.query.page) || 1 ;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    try{
        const data = await prisma.course.findMany({
            skip,
            take: limit
        });
        return res.json(data);
    } catch(error){
        console.error("no course available" , error);
    }
};

const getCourseWithAllLessons = async ( req:Request , res:Response)=>{
    const courseWithLessons = await prisma.course.findUnique({
        where:{
            id: req.params.id as string,
        } ,
        include:{
            lessons: true
        }
    });

    if(!courseWithLessons){
        return res.status(400).json({
            message: "this course doesnt exists"
        });
    }

    return res.json(courseWithLessons);
};

const updateCourse = async(req:Request , res:Response)=>{
    const {success , data}=CreateCourseSchema.partial().safeParse(req.body);

    if(!success){
        return res.status(400).json({
            message:"invalid input"
        });
    }

    const { title , description , price }= data;

    const updatedCourse = await prisma.course.update({
        where:{
            id:req.params.id as string,
        },
        data:{
            title,
            description,
            price
        }
    });

    if(!updatedCourse){
        return res.status(400).json({message:"invalid course id"});
    }

    return res.json(updatedCourse);
};

const deleteCourse = async (req: Request, res: Response) => {
  const course = await prisma.course.delete({
    where: {
      id: req.params.id as string
    }
  });

  if (!course) {
    return res.status(404).json({ 
        message: "no such course exists" 
    });
  }

  res.json({ message: "Course deleted" })
};

const courseRevenueStats = async (req: Request, res: Response) => {
  const course = await prisma.course.findUnique({
    where: {
      id: req.params.id as string,
    },
  });

  if (!course) {
    return res.status(404).json({
      message: "Course not found",
    });
  }

  const totalPurchases = await prisma.purchase.count({
    where: {
      courseId: req.params.id as string,
    },
  });

  const totalRevenue = totalPurchases * course.price;

  return res.json({
    totalPurchases,
    totalRevenue,
    coursePrice: course.price,
  });
};

export{ createCourse,
  getAllCourse,
  getCourseWithAllLessons,
  updateCourse,
  deleteCourse,
  courseRevenueStats,
} ;
