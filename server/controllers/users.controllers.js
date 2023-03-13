import { pool } from "../db/db.js";
import dotenv from "dotenv";
import { compareText, encryptText } from "../helpers/handleBcrypt.js";

dotenv.config();

export const getUsers = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT id_usuario, usuario, nombre, apellido, identificacion, privilegio FROM usuarios ORDER BY id_usuario"
    );
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT id_usuario, usuario, nombre, apellido, identificacion, privilegio FROM usuarios WHERE id_usuario = ?",
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
    const { contrasena } = req.body;
    console.log(req.body);
    const passwordHash = await encryptText(contrasena);
    req.body.contrasena = passwordHash;
    console.log(req.body);
    const [result] = await pool.query(
      "UPDATE usuarios SET ? WHERE id_usuario = ?",
      [req.body, req.params.id]
    );
    // console.log(result);
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
    const passwordHash = await encryptText(contrasena);

    const [result] = await pool.query(
      "INSERT INTO usuarios(usuario, contrasena, nombre, apellido, identificacion, privilegio) VALUES (?, ?, ?, ?, ?, ?)",
      [usuario, passwordHash, nombre, apellido, identificacion, privilegio]
    );
    res.status(200).json({
      statusText: "Registro exitoso",
      userData: {
        id_usuario: result.insertId,
        usuario,
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
    res.status(201).json({ statusText: "Usuario eliminado" });
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

// Validar si el usuario existe

export const userExist = async (req, res, next) => {
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
        return res
          .status(409)
          .json({
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

// Confirmar contraseña

export const confirmPassword = async (req, res, next) => {
  try {
    const { contrasena } = req.body;
    if (!contrasena)
      return res
        .status(401)
        .json({ statusText: "Debe introducir una contraseña" });

    const [result] = await pool.query(
      "SELECT id_usuario, contrasena FROM usuarios WHERE id_usuario = ?",
      [req.params.id]
    );

    // Verificar si es la misma contraseña
    const passwordHash = await compareText(contrasena, result[0].contrasena);

    if (!passwordHash)
      return res.status(401).json({ statusText: "Contraseña no coincide" });
    next();
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};
