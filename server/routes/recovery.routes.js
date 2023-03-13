import { Router } from "express";
import {
  confirmQuestions,
  getUser,
  passwordReset,
} from "../controllers/recovery.controllers.js";
const router = Router();

// Verificar si usuario existe
router.post("/api/recuperarusuario", getUser);
router.post("/api/preguntasseguridad", confirmQuestions);
router.put("/api/restablecercontrasena", passwordReset);

router.get("/api/recuperar/:id");

export default router;
