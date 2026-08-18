import { Router } from "express";
import {
  purchaseCoursesOfUser,
  purchaseCourse,
} from "../controllers/purchase.controller";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware";

const router = Router();

router.post("/purchases", authMiddleware, requireRole("STUDENT"), purchaseCourse);

router.get("/users/:id/purchases",authMiddleware,requireRole("STUDENT"), purchaseCoursesOfUser);



export default router;