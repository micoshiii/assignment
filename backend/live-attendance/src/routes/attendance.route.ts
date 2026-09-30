import { Router } from "express";
import { OnlyTeacher, verifyUser } from "../middleware/auth.middleware";
import { startAttendance } from "../controllers/attendance.controller";
const router = Router();

router.post("/start" , verifyUser , OnlyTeacher , startAttendance);

export default router;