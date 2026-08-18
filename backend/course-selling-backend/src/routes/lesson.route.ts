import {Router} from "express";
const router = Router();

import { authMiddleware , requireRole } from "../middlewares/auth.middleware";
import { createLesson ,getLessons} from "../controllers/lesson.controller";

router.post("/lessons", authMiddleware, requireRole("INSTRUCTOR"), createLesson);

router.get("/courses/:courseId/lessons" , getLessons);

export default router;