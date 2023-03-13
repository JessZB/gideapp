import { Router } from "express";
import {
  createExam,
  deleteExam,
  getExam,
  getExams,
} from "../controllers/exams.controllers.js";
const router = Router();

// Rutas de Usuario

// Obtener vacunacion
router.get("/api/examenes", getExams);
// Obtener examenes
router.get("/api/examenes/:id", getExam);
// Crear examenes
router.post("/api/examenes", createExam);
// Actualizar examenes
// router.put("/api/examenes/:id", updateExam);
// Eliminar examenes
router.delete("/api/examenes/:id", deleteExam);

export default router;
