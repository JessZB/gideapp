import { pool } from "../db/db.js";
import dotenv from 'dotenv';

dotenv.config();


let sessions = [];

export const authUser = async (req, res) => {

  console.log(req.body)
  let { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) return res.status(400).send({statusText:"No puede enviar los campos vacíos"})

  try {
    
    const [result] = await pool.query(
      "SELECT * FROM usuarios WHERE usuario = ? OR contrasena = ?",
      [usuario, contrasena]
    );

    // Si el usuario no existe
    if (result.length === 0 || result[0].usuario !== usuario) return res.status(401).json({auth: false, statusText:"Usuario no existe"})

    // Si la contraseña no es correcta
    if (result[0].contrasena !== contrasena) {
      res.status(500).json({auth: false,statusText:"Contraseña Incorrecta"});
      return res.end()
    }
    // Extraemos los valores
    req.session.loggedIn = true;
    req.session.usuario = result[0].usuario
    req.session.privilegio = result[0].privilegio
    req.session.nombre = result[0].nombre
    console.log(req.session)

    // Si se ha encontrado un usuario se devuelve una autenticación en true junto al usuario y el permiso

    return res.status(200).json({auth:true, statusText: "Logueado con éxito"});
  } catch (error) {
    console.log(error)
    return res.status(500).json({auth: false, statusText: "Ha ocurrido un error"});
  }
};

export const authSession = (req,res)=>{
  console.log("Hola")
  console.log(req.session)
    res.json({auth: req.session.loggedIn, user: req.session.usuario, role: req.session.privilegio})
}


export const logout = (req,res)=>{
  req.session.destroy();
  console.log(req.session)
    res.json({message: "Ha cerrado sessión"})
}


    // const token = tokenGenerator(result[0].id_usuario);
    // const tokenOptions = {
    //   expires: new Date(Date.now() + process.env.JWT_COOKIES_EXPIRES * 24 * 60 * 60 * 1000),
    //   httpOnly:true}