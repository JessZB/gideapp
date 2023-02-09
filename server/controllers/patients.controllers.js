import { pool } from "../db/db.js";
import dotenv from "dotenv";

dotenv.config();

// Obtener Pacientes

export const getPatients = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM pacientes ORDER BY id_paciente"
    );
    res.json(result);
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

// Obtener Paciente

export const getPatient = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM pacientes WHERE id_paciente = ?",
      [req.params.id]
    );
    console.log(result);
    if (result.length === 0)
      return res.status(404).json({ statusText: "Paciente no encontrado" });

    return res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

// Actualizar Paciente

export const updatePatient = async (req, res) => {
  try {
    console.log(req.body);
    const [result] = await pool.query(
      "UPDATE pacientes SET ? WHERE id_paciente = ?",
      [req.body, req.params.id]
    );
    console.log(result);
    res.status(201).json({ statusText: "Paciente actualizado" });
  } catch (error) {
    res.status(500).json({ statusText: error.message });
  }
};

// Crear Paciente

export const createPatient = async (req, res) => {
  try {
    console.log(req.body);
    const {
      nombre,
      apellido,
      edad,
      identificacion,
      sexo,
      fechaNacimiento,
      representante,
      rnombre,
      rapellido,
      ridentificacion,
      direccion,
    } = req.body;
    console.log(parseInt(req.body.fechaNacimiento));
    console.log(fechaNacimiento);
    const [result] = await pool.query(
      "INSERT INTO pacientes(nombre, apellido, edad, identificacion, sexo, fecha_nacimiento) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, apellido, edad, identificacion, sexo, fechaNacimiento]
    );
    if (representante) {
      const [result2] = await pool.query(
        "INSERT INTO representantes(nombre, apellido, identificacion, direccion, paciente_id) VALUES (?, ?, ?, ?, ?)",
        [rnombre, rapellido, ridentificacion, direccion, result.insertId]
      );
    }

    res.status(201).json({
      statusText: "Registro exitoso",
      patientData: {
        id_paciente: result.insertId,
        nombre,
        apellido,
        edad,
        identificacion,
        sexo,
        fecha_nacimiento: fechaNacimiento,
      },
    });
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

// Eliminar Paciente

export const deletePatient = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM pacientes WHERE id_paciente = ?",
      [req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ statusText: "Paciente no encontrado" });
    res.json({ statusText: "Paciente eliminado" });
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};
