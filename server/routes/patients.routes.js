import { Router } from "express";
import {
  createPatient,
  deletePatient,
  getPatient,
  getPatientByCI,
  getPatients,
  patientExist,
  updatePatient,
} from "../controllers/patients.controllers.js";
const router = Router();

// Rutas de paciente

// Obtener pacientes
router.get("/api/pacientes", getPatients);
// Obtener paciente
router.get("/api/pacientes/:id", getPatient);
router.get("/api/pacientesci/:ci", getPatientByCI);
// Crear paciente
router.post("/api/pacientes", patientExist, createPatient);
// Actualizar paciente
router.put("/api/pacientes/:id", patientExist, updatePatient);
// Eliminar paciente
router.delete("/api/pacientes/:id", deletePatient);

export default router;
