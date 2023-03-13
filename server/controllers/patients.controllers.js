import { pool } from "../db/db.js";
import dotenv from "dotenv";
import { fixDate } from "../helpers/fixDate.js";

dotenv.config();

// Obtener Pacientes

export const getPatients = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM pacientes ORDER BY id_paciente"
    );
    const resultFixed = result.map(fixDate);

    return res.json(resultFixed);
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
    if (result.length === 0)
      return res.status(404).json({ statusText: "Paciente no encontrado" });

    //Arreglar fecha
    const resultFixed = result.map(fixDate);

    if (result[0].edad < 18) {
      const [result2] = await pool.query(
        "SELECT * FROM representantes WHERE paciente_id = ?",
        [req.params.id]
      );
      return res.json({
        ...result[0],
        id_representante: result2[0].id_representante,
        rnombre: result2[0].nombre,
        rapellido: result2[0].apellido,
        ridentificacion: result2[0].identificacion,
      });
    } else {
      return res.json(resultFixed[0]);
    }
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

export const getPatientByCI = async (req, res) => {
  try {
    console.log(req.params);
    const [result] = await pool.query(
      "SELECT * FROM pacientes WHERE identificacion = ?",
      [req.params.ci]
    );
    if (result.length === 0)
      return res.status(404).json({ statusText: "Paciente no encontrado" });

    //Arreglar fecha
    const resultFixed = result.map(fixDate);
    if (result[0].edad < 18) {
      const [result2] = await pool.query(
        "SELECT * FROM representantes WHERE paciente_id = ?",
        [result[0].id_paciente]
      );
      return res.json({
        ...result[0],
        id_representante: result2[0].id_representante,
        rnombre: result2[0].nombre,
        rapellido: result2[0].apellido,
        ridentificacion: result2[0].identificacion,
      });
    } else {
      return res.json(resultFixed[0]);
    }
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

// Actualizar Paciente

export const updatePatient = async (req, res) => {
  try {
    const {
      id_paciente,
      nombre,
      apellido,
      edad,
      identificacion,
      sexo,
      fecha_nacimiento,
      representante,
      rnombre,
      rapellido,
      ridentificacion,
      direccion,
    } = req.body;
    const [result] = await pool.query(
      "UPDATE pacientes SET ? WHERE id_paciente = ?",
      [
        {
          nombre,
          apellido,
          edad,
          identificacion,
          sexo,
          fecha_nacimiento,
          direccion,
        },
        req.params.id,
      ]
    );
    const [result2] = await pool.query(
      "UPDATE representantes SET ? WHERE paciente_id = ?",
      [
        {
          nombre: rnombre,
          apellido: rapellido,
          identificacion: ridentificacion,
          direccion,
          paciente_id: id_paciente,
        },
        req.params.id,
      ]
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
    const {
      nombre,
      apellido,
      edad,
      identificacion,
      sexo,
      fecha_nacimiento,
      representante,
      rnombre,
      rapellido,
      ridentificacion,
      direccion,
    } = req.body;
    const [result] = await pool.query(
      "INSERT INTO pacientes(nombre, apellido, edad, identificacion, sexo, fecha_nacimiento, direccion) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        nombre,
        apellido,
        edad,
        identificacion,
        sexo,
        fecha_nacimiento,
        direccion,
      ]
    );
    if (representante) {
      const [result2] = await pool.query(
        "INSERT INTO representantes(nombre, apellido, identificacion, direccion, paciente_id) VALUES (?, ?, ?, ?, ?)",
        [rnombre, rapellido, ridentificacion, direccion, result.insertId]
      );
    }
    console.log(result);
    res.status(201).json({
      statusText: "Registro exitoso",
      patientData: {
        id_paciente: result.insertId,
        nombre,
        apellido,
        edad,
        identificacion,
        sexo,
        fecha_nacimiento: fecha_nacimiento,
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

// Verificar si ya existe un paciente

export const patientExist = async (req, res, next) => {
  try {
    const { identificacion } = req.body;
    console.log(req.body);
    const [result] = await pool.query(
      "SELECT id_paciente, identificacion FROM pacientes ORDER BY id_paciente"
    );
    // Verificamos si es una petición PUT o POST
    if (!req.params.id) {
      if (result.some((el) => el.identificacion === parseInt(identificacion))) {
        return res
          .status(409)
          .json({ statusText: "Identificación ya registrada" });
      }
      return next();
    } else {
      // Array de pacientes filtrados separarando los registros entre los pacientes de la base de datos y el paciente al cual se va a actualizar.
      let filterResults = result.filter(
        (el) => el.id_paciente !== parseInt(req.params.id)
      );

      // Verificar si los datos a actualizar no están duplicados

      if (
        filterResults.some(
          (el) => el.identificacion === parseInt(identificacion)
        )
      ) {
        return res.status(409).json({
          statusText:
            "No se puede duplicar un registro, cambie el usuario o identificación",
        });
      } else {
        return next();
      }
    }
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};
