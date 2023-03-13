import { pool } from "../db/db.js";
import dotenv from "dotenv";
import { compareText, encryptText } from "../helpers/handleBcrypt.js";

dotenv.config();

// Obtener preguntas

export const getQuestions = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM preguntas_seguridad ORDER BY usuario_id"
    );
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

// Obtener preguntas por usuario

export const getUserQuestions = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM preguntas_seguridad WHERE usuario_id = ?",
      [req.params.id]
    );
    if (result.length === 0)
      return res.status(404).json({
        statusText: "No se ha encontrado preguntas para este usuario",
      });
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

export const getQuestion = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM preguntas_seguridad WHERE id_pregunta = ?",
      [req.params.id]
    );
    if (result.length === 0)
      return res.status(404).json({ statusText: "Pregunta no encontrada" });
    return res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

// Actualizando pregunta

export const updateQuestions = async (req, res) => {
  try {
    const { pregunta, respuesta } = req.body;
    // req.body.pregunta = pregunta.toLowerCase();
    // req.body.respuesta = respuesta.toLowerCase();
    console.log(req.body);
    const [result] = await pool.query(
      "UPDATE preguntas_seguridad SET ? WHERE id_pregunta = ?",
      [req.body, req.params.id]
    );
    // console.log(result);
    res.status(200).json({ statusText: "Pregunta actualizada" });
  } catch (error) {
    res.status(500).json({ statusText: error.message });
  }
};

// CREAR Pregunta

export const createQuestion = async (req, res) => {
  try {
    const { pregunta, respuesta, usuario_id } = req.body;
    // req.body.pregunta = pregunta.toLowerCase();
    // req.body.respuesta = respuesta.toLowerCase();

    const [questionsResult] = await pool.query(
      "SELECT * FROM preguntas_seguridad WHERE usuario_id = ?",
      [usuario_id]
    );
    // Verificar si la pregunta ya fue registrada por el usuario
    const questionExist = questionsResult.some(
      (el) => el.pregunta === pregunta
    );
    if (questionExist) {
      return res.status(403).json({
        statusText:
          "Ya tiene esta pregunta registrada, intente con otra opción",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO preguntas_seguridad(pregunta, respuesta, usuario_id ) VALUES (?, ?, ?)",
      [pregunta, respuesta, usuario_id]
    );
    return res.status(200).json({
      statusText: "Registro exitoso",
      questionData: {
        // id_pregunta: result.insertId,
        pregunta,
        respuesta,
        usuario_id,
      },
    });
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

// ELIMINAR Pregunta

export const deleteQuestion = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM preguntas_seguridad WHERE id_pregunta = ?",
      [req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ statusText: "Pregunta no encontrada" });
    res.status(201).json({ statusText: "Pregunta eliminada" });
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};
