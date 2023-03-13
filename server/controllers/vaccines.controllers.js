import { pool } from "../db/db.js";
import dotenv from "dotenv";

dotenv.config();

export const getVaccines = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM vacunas ORDER BY id_vacuna"
    );
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

export const getVaccine = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM vacunas WHERE id_vacuna = ?",
      [req.params.id]
    );
    if (result.length === 0)
      return res.status(404).json({ statusText: "Vacuna no encontrado" });
    // Calcular la cantidad de dosis
    let doseLength = Object.values(result[0]).filter((el) => el).length - 2;
    result[0].dosis = doseLength;
    return res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

// Actualizando usuario

export const updateVaccine = async (req, res) => {
  try {
    console.log(req.body);
    delete req.body.dosis
    const [result] = await pool.query(
      "UPDATE vacunas SET ? WHERE id_vacuna = ?",
      [req.body, req.params.id]
    );
    // console.log(result);
    res.status(200).json({ statusText: "Vacuna actualizado" });
  } catch (error) {
    res.status(500).json({ statusText: error.message });
  }
};

// CREAR USUARIO

export const createVaccine = async (req, res) => {
  try {
    const { nombre, dosis1, dosis2, dosis3, dosis4, dosis5 } = req.body;
    console.log(req.body);
    const [result] = await pool.query(
      "INSERT INTO vacunas(nombre, dosis1, dosis2, dosis3, dosis4, dosis5) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, dosis1, dosis2, dosis3, dosis4, dosis5]
    );

    res.status(200).json({
      statusText: "Registro exitoso",
      vaccineData: {
        id_vacuna: result.insertId,
        nombre,
        dosis1,
        dosis2,
        dosis3,
        dosis4,
        dosis5,
      },
    });
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

// ELIMINAR Vacuna

export const deleteVaccine = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM vacunas WHERE id_vacuna = ?",
      [req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ statusText: "Vacuna no encontrado" });
    res.status(201).json({ statusText: "Vacuna eliminada" });
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

// Validar si el vacuna existe

export const vaccineExist = async (req, res, next) => {
  try {
    const { usuario, identificacion } = req.body;
    // console.log(req.body);
    const [result] = await pool.query(
      "SELECT id_usuario, usuario, identificacion FROM usuarios ORDER BY id_usuario"
    );
    // Verificamos si es una petición PUT o POST
    if (!req.params.id) {
      if (result.some((el) => el.usuario === usuario)) {
        return res.status(409).json({ statusText: "Ya existe un usuario" });
      }
      if (result.some((el) => el.identificacion === parseInt(identificacion))) {
        return res
          .status(409)
          .json({ statusText: "Identificación ya registrada" });
      }
      return next();
    } else {
      // Array de usuarios filtrados separarando los registros entre los usuarios de la base de datos y el usuario al cual se va a actualizar.

      let filterResults = result.filter(
        (el) => el.id_usuario !== parseInt(req.params.id)
      );

      // Verificar si los datos a actualizar no están duplicados
      if (
        filterResults.some(
          (el) =>
            el.usuario === usuario ||
            el.identificacion === parseInt(identificacion)
        )
      ) {
        return res.status(409).json({
          statusText:
            "No se puede duplicar un registro, cambie el usuario o identificaicón",
        });
      } else {
        return next();
      }
    }
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};
