import type{Request,Response} from "express";
import {prisma } from "../../db";
import { LoginSchema , SignupSchema } from "../validators/schema.validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const handleSignup = async(req:Request , res:Response)=>{
    const { data , success} = SignupSchema.safeParse(req.body);

    if(!success){
        return res.status(400).json({
            message: "invaid input"
        });
    }

    const { email , password , name , role} = data;
    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if(existingUser){
        return res.status(400).json({
            message: "User already exists"
        })

    }
    const hashedPassword = await bcrypt.hash(password , 10);

    const user = await prisma.user.create({
        data:{
            email,
            password: hashedPassword,
            name,
            role
        } , 
        omit :{
            password: true
        }
    });
    return res.json({message: "singup successful"})
}

const handleLogin = async (req: Request, res: Response) => {
  const { data, success } = LoginSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({ message: "invalid input" });
  }

  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "invalid credentials" });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).json({ message: "invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET!
  );

  return res.json({ message: "logged in", token });
};

export { handleLogin, handleSignup };