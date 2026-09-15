import type { Response, Request } from "express";
import { SignupSchema , LoginSchema } from "../validators/schema";
import { UserModel } from "../models/user.model";
import { ApiError  } from "../utils/apiError";
import { ApiResponse  } from "../utils/apiResponse";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
import { password } from "bun";

export const handleSignup = async(req:Request , res:Response)=>{

    const { success , data }= SignupSchema.safeParse(req.body);

    if(!success){
        return res.status(400).json(
            new ApiError("Invalid request schema")
        )
    };

    const { name , email , password , role } = data;

    const existingUser = await UserModel.findOne({ email });

    if(existingUser){
        return res.status(400).json(new ApiError("Email already exists"))
    };

    const hashedPassword = await bcrypt.hash(password , 10);

    const user = await UserModel.create({
        name ,
        email ,
        password: hashedPassword ,
        role
    });

    return res.status(201).json(new ApiResponse({
    "_id": user._id ,
    "name": user.name,
    "email": user.email ,
    "role": user.role 
    }))

};


export const handleLogin = async(req:Request , res:Response)=>{

    const { success , data } = LoginSchema.safeParse(req.body);

    if(!success){
        return res.status(400).json(new ApiError("Invalid request schema"))
    };

    const { email , password} = data;

    const user = await UserModel.findOne({email});

    if(!user){
        return res.status(400).json(new ApiError("Invalid email or password"))
    };

    const validPassword = await bcrypt.compare(password , user.password);

    if(!validPassword){
        return res.status(400).json(new ApiError("Invalid email or password"))
    };

    const token = jwt.sign({
        id: user._id,
      role: user.role,
    } , "secret");

    return res.status(200).json(new ApiResponse({ token }));

}

export const getMe = async(req:Request,res:Response)=>{
    const userId = req.user.id; //from the middleware that we made

    const user = await UserModel.findById(userId);

    if(!user){
       return res.status(404).json(new ApiError("User not found")) 
    };

    return res.status(200).json(new ApiResponse({
    "_id": user._id,
    "name": user.name,
    "email": user.email,
    "role": user.role,
    }))
}

