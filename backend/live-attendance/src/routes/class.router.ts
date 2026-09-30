import {Router } from "express";
import { OnlyTeacher, verifyUser } from "../middleware/auth.middleware";
import { addStudent, classInfo, createClass, studentAttendance, } from "../controllers/class.controller";

const router = Router();

router.post("/" , verifyUser , OnlyTeacher , createClass );
router.post("/:id/add-student" , verifyUser , OnlyTeacher , addStudent);
router.get("/:id" , verifyUser  , classInfo );
router.get("/:id/my-attendance" , verifyUser , studentAttendance)

export default router;