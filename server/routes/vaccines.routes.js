import { Router } from "express";
import {
  createVaccine,
  deleteVaccine,
  getVaccine,
 getVaccines,
 updateVaccine
} from "../controllers/vaccines.controllers.js";
const router = Router();

// Rutas de Usuario

// Obtener usuarios
router.get("/api/vacunas", getVaccines);
// Obtener usuario
router.get("/api/vacunas/:id", getVaccine);
// Crear usuario
router.post("/api/vacunas",createVaccine);
// Actualizar usuario
router.put("/api/vacunas/:id",updateVaccine);
// Eliminar usuario
router.delete("/api/vacunas/:id", deleteVaccine);

export default router;
