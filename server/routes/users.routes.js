import { Router } from "express";
import {
  confirmPassword,
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  userExist,
} from "../controllers/users.controllers.js";
const router = Router();

// Rutas de Usuario

// Obtener usuarios
router.get("/api/usuarios", getUsers);
// Obtener usuario
router.get("/api/usuarios/:id", getUser);
// Crear usuario
router.post("/api/usuarios", userExist, createUser);
// Actualizar usuario
router.put("/api/usuarios/:id",userExist, updateUser);
// Eliminar usuario
router.delete("/api/usuarios/:id", deleteUser);

export default router;
