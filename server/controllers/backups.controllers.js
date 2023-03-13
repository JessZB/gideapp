import { pool } from "../db/db.js";
import dotenv from "dotenv";
import mysqldump from "mysqldump";
import Importer from "mysql-import";
import { join } from "path";
import { __dirname } from "../index.js";
import { existsSync, unlink } from "fs";
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from "../config/config.js";
dotenv.config();

const importer = new Importer({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

export const getBackups = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM respaldos ORDER BY id_respaldo"
    );
    const resultFix = result.map((el) => {
      el.fecha_respaldo = el.fecha_respaldo.toLocaleDateString();
      return el;
    });

    return res.json(resultFix);
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

export const getBackup = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * from respaldos WHERE id_respaldo = ?",
      [req.params.id]
    );

    if (result.length === 0)
      return res.status(404).json({ statusText: "Respaldo no encontrado" });
    return res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

// Actualizando usuario

// export const updateUser = async (req, res) => {
//   try {
//     const { contrasena } = req.body;
//     console.log(req.body);
//     const passwordHash = await encryptText(contrasena);
//     req.body.contrasena = passwordHash;
//     console.log(req.body);
//     const [result] = await pool.query(
//       "UPDATE usuarios SET ? WHERE id_usuario = ?",
//       [req.body, req.params.id]
//     );
//     // console.log(result);
//     res.status(200).json({ statusText: "Usuario actualizado" });
//   } catch (error) {
//     res.status(500).json({ statusText: error.message });
//   }
// };

// CREAR respaldo

export const createBackup = async (req, res) => {
  try {
    const { nombre, usuario_id } = req.body;
    const fecha_respaldo = new Date();
    let anio = fecha_respaldo.getFullYear();
    let month = fecha_respaldo.getMonth() + 1;
    let day = fecha_respaldo.getDate();
    let hour = fecha_respaldo.getHours();
    let minute = fecha_respaldo.getMinutes();
    let second = fecha_respaldo.getSeconds();

    const fechaString = `${anio}-${month}-${day} ${hour}-${minute}-${second}`;

    const backupName = `Respaldo (${nombre || fechaString})`;

    const ruta = `/backups/${backupName}.sql`;
    mysqldump({
      connection: {
        host: "localhost",
        user: "root",
        password: "",
        database: "gidedb",
      },
      dumpToFile: `${__dirname}/${ruta}`,
    });

    const [result] = await pool.query(
      "INSERT INTO respaldos(nombre, ruta, fecha_respaldo, usuario_id) VALUES (?, ?, ?, ?)",
      [backupName, ruta, fecha_respaldo, usuario_id]
    );

    console.log(result);

    return res.status(200).json({
      statusText: "Respaldo exitoso",
      backupData: {
        id_respaldo: result.insertId,
        nombre: backupName,
        fecha_respaldo: fecha_respaldo.toLocaleDateString(),
        usuario_id,
      },
    });
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

// Restaurar base de datos

export const restoreBackup = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * from respaldos WHERE id_respaldo = ?",
      [req.params.id]
    );

    if (result.length === 0)
      return res.status(404).json({ statusText: "Respaldo no encontrado" });

    const restoreRoute = __dirname + result[0].ruta;

    if (!existsSync(restoreRoute)) {
      const [deleteResult] = await pool.query(
        "DELETE FROM respaldos WHERE id_respaldo = ?",
        [req.params.id]
      );
      // console.log(!existsSync(restoreRoute));
      return res.status(404).json({
        statusText:
          "No se ha encontrado un archivo correspondiente a este registro, se eliminará el registro",
      });
    }

    // Borrar la base de datos actual

    const [dropResult] = await pool.query(`DROP DATABASE ${DB_NAME}`);

    // Crear la base de datos para insertar los datos

    const [createResult] = await pool.query(`CREATE DATABASE ${DB_NAME}`);

    // Restauración de base de datos

    importer.onProgress((progress) => {
      var percent =
        Math.floor((progress.bytes_processed / progress.total_bytes) * 10000) /
        100;
      console.log(`${percent}% Completed`);
    });

    importer
      .import(restoreRoute)
      .then(() => {
        var files_imported = importer.getImported();
        console.log(`${files_imported.length} SQL file(s) imported.`);
      })
      .catch((err) => {
        console.error(err);
      });

    const [useDatabase] = await pool.query(`use ${DB_NAME}`);
    console.log(useDatabase);

    return res
      .status(201)
      .json({ statusText: "Se ha restaurado la base de datos" });
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};

// ELIMINAR Respaldo

export const deleteBackup = async (req, res) => {
  try {
    const [getResult] = await pool.query(
      "SELECT * from respaldos WHERE id_respaldo = ?",
      [req.params.id]
    );

    const [result] = await pool.query(
      "DELETE FROM respaldos WHERE id_respaldo = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ statusText: "Respaldo no encontrado" });

    // Eliminar archivo
    unlink(join(__dirname, getResult[0].ruta), function (error) {
      if (error) console.error("Error Occured:", error);
      console.log("File deleted!");
    });
    console.log(join(__dirname, getResult[0].ruta));

    return res.status(201).json({ statusText: "Respaldo eliminado" });
  } catch (error) {
    return res.status(500).json({ statusText: error.message });
  }
};
