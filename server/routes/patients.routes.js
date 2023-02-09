import { Router } from "express";
import {
  createPatient,
  deletePatient,
  getPatient,
  getPatients,
  updatePatient,
} from "../controllers/patients.controllers.js";
const router = Router();

// Rutas de Usuario

// Obtener pacientes
router.get("/pacientes", getPatients);
// Obtener paciente
router.get("/pacientes/:id", getPatient);
// Crear paciente
router.post("/pacientes", createPatient);
// Actualizar paciente
router.put("/pacientes/:id", updatePatient);
// Eliminar paciente
router.delete("/pacientes/:id", deletePatient);

export default router;
