import { pool } from "../db/db.js";
import dotenv from "dotenv";

dotenv.config();

export const getVaccinations = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM vacunacion ORDER BY fecha_vacunacion"
    );
    const resultFix = result.map((el) => {
      el.fecha_vacunacion = el.fecha_vacunacion.toLocaleDateString();
      return el;
    });
    return res.json(resultFix);
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

export const getVaccination = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM vacunacion WHERE id_vacunacion = ?",
      [req.params.id]
    );
    if (result.length === 0)
      return res.status(404).json({ statusText: "Registro no encontrado" });

    return res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

// // Actualizando Vacunacion

// export const updateVaccine = async (req, res) => {
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

export const createVaccination = async (req, res) => {
  try {
    const { vacuna_nombre, paciente_identificacion, dosis, fecha_vacunacion } =
      req.body;
    console.log(req.body);
    const [result] = await pool.query(
      "INSERT INTO vacunacion(vacuna_nombre, paciente_identificacion, dosis, fecha_vacunacion) VALUES (?, ?, ?, ?)",
      [vacuna_nombre, paciente_identificacion, dosis, fecha_vacunacion]
    );

    res.status(200).json({
      statusText: "Registro exitoso",
      vaccineData: {
        id_vacunacion: result.insertId,
        vacuna_nombre,
        paciente_identificacion,
        dosis,
        fecha_vacunacion,
      },
    });
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

// ELIMINAR Vacuna

export const deleteVaccination = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM vacunacion WHERE id_vacunacion= ?",
      [req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ statusText: "Registro no encontrado" });
    return res.status(201).json({ statusText: "Registro eliminado" });
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};