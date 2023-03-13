import { pool } from "../db/db.js";
import dotenv from "dotenv";
import { compareText, encryptText } from "../helpers/handleBcrypt.js";
import bcryptjs from "bcryptjs";

dotenv.config();

export const getUser = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT id_usuario FROM usuarios WHERE usuario = ?",
      [req.body.usuario]
    );
    if (result.length === 0) {
      return res
        .status(404)
        .json({ statusText: "Este usuario no se encuentra registrado" });
    }
    console.log(result);
    const [questionsResult] = await pool.query(
      "SELECT id_pregunta, pregunta, usuario_id FROM preguntas_seguridad WHERE usuario_id = ?",
      [result[0].id_usuario]
    );

    if (questionsResult.length === 0) {
      return res
        .status(404)
        .json({ statusText: "Este usuario no tiene preguntas de seguridad establecidas" });
    }
    let randomNumber = Math.floor(Math.random() * questionsResult.length);
    const userQuestion = questionsResult[randomNumber];
    return res.status(201).json({
      auth: true,
      userQuestion,
      statusText: "Responda las siguiente preguntas",
    });
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

export const confirmQuestions = async (req, res) => {
  try {
    const { id_pregunta, pregunta, respuesta } = req.body;
    const [result] = await pool.query(
      "SELECT pregunta,respuesta FROM preguntas_seguridad WHERE id_pregunta = ?",
      [id_pregunta]
    );
    console.log(req.body);
    console.log(result);
    if (result.length === 0) {
      return res.status(404).json({ statusText: "Pregunta no registrada" });
    }

    if (
      result[0].pregunta === pregunta &&
      result[0].respuesta.toLowerCase() === respuesta.toLowerCase()
    ) {
      return res.status(201).json({
        auth: true,
        statusText: "Respuestas coinciden. Reestablezca su contraseña",
      });
    } else {
      return res.status(401).json({
        auth: false,
        statusText: "Respuestas no coinciden, intente de nuevo",
      });
    }
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

export const passwordReset = async (req, res) => {
  try {
    const { contrasena } = req.body;
    const passwordHash = await encryptText(contrasena);
    console.log(req.body)
    console.log(contrasena, passwordHash);
    const [result] = await pool.query(
      "UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?",
      [passwordHash, req.body.usuario_id]
    );
    console.log(result);
    if (result.length === 0) {
      return res
        .status(404)
        .json({ statusText: "Este usuario no se encuentra registrado" });
    }

    return res.status(201).json({ statusText: "Contraseña restablecida" });
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

export const getUserQuestions = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM usuarios WHERE usuario = ?",
      [req.body.usuario]
    );
    if (result.length === 0) {
      return res
        .status(404)
        .json({ statusText: "Este usuario no se encuentra registrado" });
    }

    return res
      .status(201)
      .json({ auth: true, statusText: "Responda las siguiente preguntas" });
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};
