import { Router } from "express";

const router = Router();

import{ handleLogin , handleSignup } from "../controllers/user.controller";

router.post("/signup" , handleSignup);
router.post("/login" , handleLogin);

export default router;
 