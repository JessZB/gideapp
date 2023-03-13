import { pool } from "../db/db.js";
import dotenv from "dotenv";

dotenv.config();

export const getExams = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM examenes ORDER BY fecha_creacion"
    );
    const resultFix = result.map((el) => {
      el.resultados = JSON.parse(el.resultados);
      el.fecha_creacion = el.fecha_creacion.toLocaleDateString();
      return el;
    });
    return res.json(resultFix);
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

export const getExam = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM examenes WHERE id_examen = ?",
      [req.params.id]
    );
    result[0].resultados = JSON.parse(result[0].resultados);
    result[0].fecha_creacion = result[0].fecha_creacion.toLocaleDateString();
    if (result.length === 0)
      return res.status(404).json({ statusText: "Examen no encontrado" });

    return res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

// // Actualizando Vacunacion

// export const updateExam = async (req, res) => {
//   try {
//     console.log(req.body);
//     delete req.body.dosis
//     const [result] = await pool.query(
//       "UPDATE vacunas SET ? WHERE id_vacuna = ?",
//       [req.body, req.params.id]
//     );
//     // console.log(result);
//     res.status(200).json({ statusText: "Vacuna actualizado" });
//   } catch (error) {
//     res.status(500).json({ statusText: error.message });
//   }
// };

// CREAR registro de vacunacion

export const createExam = async (req, res) => {
  try {
    const {
      paciente_identificacion,
      tipo,
      dengue,
      vih,
      vdrl,
      hepatitis,
      fecha_creacion,
    } = req.body;
    const resultados = { dengue, vih, vdrl, hepatitis };
    console.log(resultados);
    const [result] = await pool.query(
      "INSERT INTO examenes(paciente_identificacion, tipo, resultados, fecha_creacion) VALUES (?, ?, ?, ?)",
      [
        paciente_identificacion,
        tipo,
        JSON.stringify(resultados, null, 2),
        fecha_creacion,
      ]
    );
    return res.status(200).json({
      statusText: "Registro exitoso",
      examData: {
        id_examen: result.insertId,
        paciente_identificacion,
        tipo,
        resultados,
        fecha_creacion,
      },
    });
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

// ELIMINAR Vacuna

export const deleteExam = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM examenes WHERE id_examen= ?",
      [req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ statusText: "Examen no encontrado" });
    return res.status(201).json({ statusText: "Examen eliminado" });
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};
