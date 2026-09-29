import {Router } from "express";
import { OnlyTeacher, verifyUser } from "../middleware/auth.middleware";
import { addStudent, classInfo, createClass } from "../controllers/class.controller";

const router = Router();

router.post("/" , verifyUser , OnlyTeacher , createClass );
router.post("/:id/add-student" , verifyUser , OnlyTeacher , addStudent);
router.get("/:id" , verifyUser  , classInfo )

export default router;