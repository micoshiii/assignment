import mongoose , {Schema} from "mongoose";

const userSchema = new Schema({
  name: {
    type: String ,
    required: true
  } , 

  email:{
    type: String ,
    required: true ,
    unique: true // email should be unique
  } , 

  password:{
    type : String ,
    required: true
  } ,

  role:{
    type:String ,
    enum: ["teacher" , "student"] ,
    default: "student"
  }
  
})

export const UserModel = mongoose.model("User" , userSchema) 