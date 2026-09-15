import mongoose , { Schema } from "mongoose";

const attendanceSchema = new Schema({

    classId:{
        type:Schema.Types.ObjectId,
        ref: "Class"
    } ,
    studentId:{
       type:Schema.Types.ObjectId,
        ref: "Class" 
    }
});

export const AttendanceModel = mongoose.model("Attendance" , attendanceSchema);
