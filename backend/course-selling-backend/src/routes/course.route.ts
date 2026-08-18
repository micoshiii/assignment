import { Router } from "express";

import {
  courseRevenueStats,
  createCourse,
  deleteCourse,
  getAllCourse,
  getCourseWithAllLessons,
  updateCourse,
} from "../controllers/course.controller";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware";

const router = Router();

router
.route("/")   //here u cant use ; bcoz then u will not be able to use router for the ones written below 
.post(authMiddleware , requireRole("INSTRUCTOR") , createCourse)
.get(getAllCourse);

router
  .route("/:id")
  .get( getCourseWithAllLessons)
  .patch(authMiddleware, requireRole("INSTRUCTOR"), updateCourse)
  .delete(authMiddleware, requireRole("INSTRUCTOR"), deleteCourse);

router.get("/:id/stats", authMiddleware, courseRevenueStats);

export default router;