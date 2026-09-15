import {Router} from "express";
import {getMe , handleSignup , handleLogin } from "../controllers/auth.controller";
import {verifyUser } from "../middleware/auth.middleware";

const router= Router();

router.post("/signup" , handleSignup);
router.post("/login" , handleLogin);
router.get("/me" , verifyUser , getMe);

export default router;