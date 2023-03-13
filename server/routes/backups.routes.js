import { Router } from "express";
import {
  createBackup,
  deleteBackup,
  getBackup,
  getBackups,
  restoreBackup,
} from "../controllers/backups.controllers.js";

const router = Router();

// Rutas de Usuario

// Obtener vacunacion
router.get("/api/respaldos", getBackups);
// Obtener examenes
router.get("/api/respaldos/:id", getBackup);
// Crear respaldo
router.post("/api/respaldos", createBackup);
// Restaurar respaldo
router.get("/api/restaurar/:id", restoreBackup);
// Actualizar respaldos
// router.put("/api/respaldos/:id", updateExam);
// Eliminar respaldos
router.delete("/api/respaldos/:id", deleteBackup);

export default router;
