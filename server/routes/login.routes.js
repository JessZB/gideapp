import { Router } from "express";
import { authSession, authUser, logout } from "../controllers/login.controllers.js";
const router = Router();

router.post("/auth", authUser);
router.get("/auth", authSession);
router.get("/logout", logout)

export default router;
