import { Router } from "express";
import {
  createVaccination,
  deleteVaccination,
  getVaccination,
  getVaccinations,
} from "../controllers/vaccinations.controllers.js";
const router = Router();

// Rutas de Usuario

// Obtener vacunacion
router.get("/api/vacunacion", getVaccinations);
// Obtener vacunacion
router.get("/api/vacunacion/:id", getVaccination);
// Crear vacunacion
router.post("/api/vacunacion", createVaccination);
// Actualizar vacunacion
// router.put("/api/vacunacion/:id", updateVaccination);
// Eliminar vacunacion
router.delete("/api/vacunacion/:id", deleteVaccination);

export default router;
