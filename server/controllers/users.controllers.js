import { pool } from "../db/db.js";
import dotenv from "dotenv";

dotenv.config();

export const getUsers = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM usuarios ORDER BY id_usuario"
    );
    res.json(result);
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM usuarios WHERE id_usuario = ?",
      [req.params.id]
    );
    if (result.length === 0)
      return res.status(404).json({ statusText: "Usuario no encontrado" });
    return res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

// Actualizando usuario

export const updateUser = async (req, res) => {
  try {
    console.log(req.body);
    const [result] = await pool.query(
      "UPDATE usuarios SET ? WHERE id_usuario = ?",
      [req.body, req.params.id]
    );
    console.log(result);
    res.status(200).json({ statusText: "Usuario actualizado" });
  } catch (error) {
    res.status(500).json({ statusText: error.message });
  }
};

// CREAR USUARIO

export const createUser = async (req, res) => {
  try {
    const {
      usuario,
      contrasena,
      nombre,
      apellido,
      identificacion,
      privilegio,
    } = req.body;
    console.log(req.body);
    const [result] = await pool.query(
      "INSERT INTO usuarios(usuario, contrasena, nombre, apellido, identificacion, privilegio) VALUES (?, ?, ?, ?, ?, ?)",
      [usuario, contrasena, nombre, apellido, identificacion, privilegio]
    );

    res.status(200).json({
      statusText: "Registro exitoso",
      userData: {
        id: result.insertId,
        usuario,
        contrasena,
        nombre,
        apellido,
        identificacion,
        privilegio,
      },
    });
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

// ELIMINAR USUARIO

export const deleteUser = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM usuarios WHERE id_usuario = ?",
      [req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ statusText: "Usuario no encontrado" });
    res.status(204).json({ statusText: "Usuario eliminado" });
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};
