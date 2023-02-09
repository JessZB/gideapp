import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/users.controllers.js";
const router = Router();

// Rutas de Usuario

// Obtener usuarios
router.get("/usuarios", getUsers);
// Obtener usuario
router.get("/usuarios/:id", getUser);
// Crear usuario
router.post("/usuarios", createUser);
// Actualizar usuario
router.put("/usuarios/:id", updateUser);
// Eliminar usuario
router.delete("/usuarios/:id", deleteUser);

export default router;
