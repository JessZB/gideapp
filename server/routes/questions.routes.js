import { Router } from "express";
import {
  createQuestion,
  deleteQuestion,
  getQuestion,
  getQuestions,
  getUserQuestions,
  updateQuestions,
} from "../controllers/questions.controllers.js";

const router = Router();

// Rutas de Pregunta

// Obtener Preguntas
router.get("/api/preguntas", getQuestions);
// Obtener Pregunta por usuario
router.get("/api/preguntasusuario/:id", getUserQuestions);
// Obtener Pregunta
router.get("/api/preguntas/:id", getQuestion);
// Crear Pregunta
router.post("/api/preguntas", createQuestion);
// Actualizar Pregunta
router.put("/api/preguntas/:id", updateQuestions);
// Eliminar Pregunta
router.delete("/api/preguntas/:id", deleteQuestion);

export default router;
