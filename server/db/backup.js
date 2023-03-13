import mysqldump from 'mysqldump';
import moment from 'moment';
import fs from 'fs';

// Configuración para conectarse a la base de datos
const config = {
  database: 'nombre_de_la_base_de_datos',
  host: 'localhost',
  user: 'usuario',
  password: 'contraseña'
};

// Nombre del archivo de respaldo con la fecha actual
const nombreArchivo = `respaldo_${moment().format('YYYY-MM-DD_HH-mm-ss')}.sql`;

// Ruta donde se guardará el archivo de respaldo
const rutaArchivo = `${__dirname}/${nombreArchivo}`;

// Generamos el archivo sql
mysqldump({
  ...config, // Pasamos la configuración de la conexión a MySQL
  dest: rutaArchivo // Indicamos la ruta donde se guardará el archivo de respaldo
})
  .then(() => {
    console.log('Respaldo realizado correctamente');
    // Aquí podrías enviar el archivo a un servidor externo o enviar un correo con el archivo adjunto, por ejemplo.
  })
  .catch(error => {
    console.error(error);
    // Manejo de errores
  });