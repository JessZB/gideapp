import { Router } from "express";
import { loginUser } from "../controllers/login.controllers.js";
const router = Router();

router.post("", guessUser);

export default router;
