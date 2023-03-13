/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: examenes
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `examenes` (
  `id_examen` int(11) NOT NULL AUTO_INCREMENT,
  `paciente_identificacion` int(11) NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `resultados` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`resultados`)),
  `fecha_creacion` date NOT NULL,
  PRIMARY KEY (`id_examen`),
  KEY `fk_pacientes_examenes` (`paciente_identificacion`),
  CONSTRAINT `fk_pacientes_examenes` FOREIGN KEY (`paciente_identificacion`) REFERENCES `pacientes` (`identificacion`) ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 10 DEFAULT CHARSET = utf8mb4;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: pacientes
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `pacientes` (
  `id_paciente` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `edad` int(4) NOT NULL,
  `identificacion` int(11) NOT NULL,
  `sexo` varchar(11) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `direccion` varchar(255) NOT NULL,
  PRIMARY KEY (`id_paciente`),
  UNIQUE KEY `identificacion` (`identificacion`)
) ENGINE = InnoDB AUTO_INCREMENT = 46 DEFAULT CHARSET = utf8mb4;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: preguntas_seguridad
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `preguntas_seguridad` (
  `id_pregunta` int(11) NOT NULL AUTO_INCREMENT,
  `pregunta` varchar(255) NOT NULL,
  `respuesta` varchar(255) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  PRIMARY KEY (`id_pregunta`),
  KEY `fk_usuario_pregunta` (`usuario_id`),
  CONSTRAINT `fk_usuario_pregunta` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: representantes
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `representantes` (
  `id_representante` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `identificacion` int(11) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `paciente_id` int(11) NOT NULL,
  PRIMARY KEY (`id_representante`),
  KEY `fk_paciente_representante` (`paciente_id`),
  CONSTRAINT `fk_paciente_representante` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id_paciente`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: respaldos
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `respaldos` (
  `id_respaldo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `ruta` varchar(255) NOT NULL,
  `fecha_respaldo` date NOT NULL,
  `usuario_id` int(11) NOT NULL,
  PRIMARY KEY (`id_respaldo`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `respaldos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 37 DEFAULT CHARSET = utf8mb4;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: usuarios
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `identificacion` int(11) NOT NULL,
  `privilegio` int(11) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `usuario` (`usuario`),
  UNIQUE KEY `identificacion` (`identificacion`)
) ENGINE = InnoDB AUTO_INCREMENT = 96 DEFAULT CHARSET = utf8mb4;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: vacunacion
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `vacunacion` (
  `id_vacunacion` int(11) NOT NULL AUTO_INCREMENT,
  `vacuna_nombre` varchar(255) NOT NULL,
  `dosis` int(11) NOT NULL,
  `paciente_identificacion` int(11) NOT NULL,
  `fecha_vacunacion` date NOT NULL,
  PRIMARY KEY (`id_vacunacion`),
  KEY `fk_vacunacion_vacuna` (`vacuna_nombre`),
  KEY `fk_vacunacion_paciente` (`paciente_identificacion`),
  CONSTRAINT `fk_vacunacion_paciente` FOREIGN KEY (`paciente_identificacion`) REFERENCES `pacientes` (`identificacion`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `fk_vacunacion_vacuna` FOREIGN KEY (`vacuna_nombre`) REFERENCES `vacunas` (`nombre`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 18 DEFAULT CHARSET = utf8mb4;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: vacunas
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `vacunas` (
  `id_vacuna` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `dosis1` int(11) DEFAULT NULL,
  `dosis2` int(11) DEFAULT NULL,
  `dosis3` int(11) DEFAULT NULL,
  `dosis4` int(11) DEFAULT NULL,
  `dosis5` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_vacuna`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE = InnoDB AUTO_INCREMENT = 38 DEFAULT CHARSET = utf8mb4;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: examenes
# ------------------------------------------------------------

INSERT INTO
  `examenes` (
    `id_examen`,
    `paciente_identificacion`,
    `tipo`,
    `resultados`,
    `fecha_creacion`
  )
VALUES
  (
    5,
    30091947,
    'sangre',
    '{\"dengue\":true,\"vih\":false,\"vdrl\":false,\"hepatitis\":false}',
    '2023-03-01'
  );
INSERT INTO
  `examenes` (
    `id_examen`,
    `paciente_identificacion`,
    `tipo`,
    `resultados`,
    `fecha_creacion`
  )
VALUES
  (
    8,
    78878787,
    'Sangre',
    '{\n  \"dengue\": false,\n  \"vih\": false,\n  \"vdrl\": false,\n  \"hepatitis\": false\n}',
    '2023-03-05'
  );
INSERT INTO
  `examenes` (
    `id_examen`,
    `paciente_identificacion`,
    `tipo`,
    `resultados`,
    `fecha_creacion`
  )
VALUES
  (
    9,
    78878787,
    '',
    '{\n  \"dengue\": true,\n  \"vih\": true,\n  \"vdrl\": true,\n  \"hepatitis\": true\n}',
    '2023-02-15'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: pacientes
# ------------------------------------------------------------

INSERT INTO
  `pacientes` (
    `id_paciente`,
    `nombre`,
    `apellido`,
    `edad`,
    `identificacion`,
    `sexo`,
    `fecha_nacimiento`,
    `direccion`
  )
VALUES
  (
    37,
    'Jesus',
    'Zapata',
    22,
    30091947,
    'M',
    '2000-11-30',
    'Las isoras'
  );
INSERT INTO
  `pacientes` (
    `id_paciente`,
    `nombre`,
    `apellido`,
    `edad`,
    `identificacion`,
    `sexo`,
    `fecha_nacimiento`,
    `direccion`
  )
VALUES
  (
    41,
    'Luis ',
    'Aguirre',
    18,
    30091942,
    'F',
    '2023-01-02',
    'asd'
  );
INSERT INTO
  `pacientes` (
    `id_paciente`,
    `nombre`,
    `apellido`,
    `edad`,
    `identificacion`,
    `sexo`,
    `fecha_nacimiento`,
    `direccion`
  )
VALUES
  (
    44,
    'Arlena',
    'Barrio',
    14,
    78878787,
    'F',
    '2008-11-17',
    'asdasd'
  );
INSERT INTO
  `pacientes` (
    `id_paciente`,
    `nombre`,
    `apellido`,
    `edad`,
    `identificacion`,
    `sexo`,
    `fecha_nacimiento`,
    `direccion`
  )
VALUES
  (
    45,
    'Fátima',
    'Freitas',
    17,
    454545454,
    'F',
    '2023-01-09',
    'asdasd'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: preguntas_seguridad
# ------------------------------------------------------------

INSERT INTO
  `preguntas_seguridad` (
    `id_pregunta`,
    `pregunta`,
    `respuesta`,
    `usuario_id`
  )
VALUES
  (4, '¿Cuál es su color favorito?', 'rojo', 74);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: representantes
# ------------------------------------------------------------

INSERT INTO
  `representantes` (
    `id_representante`,
    `nombre`,
    `apellido`,
    `identificacion`,
    `direccion`,
    `paciente_id`
  )
VALUES
  (4, 'Mildemis', 'Medrano', 4545454, 'asdasd', 44);
INSERT INTO
  `representantes` (
    `id_representante`,
    `nombre`,
    `apellido`,
    `identificacion`,
    `direccion`,
    `paciente_id`
  )
VALUES
  (5, 'mariana', 'barreto', 45454545, 'asdasd', 45);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: respaldos
# ------------------------------------------------------------

INSERT INTO
  `respaldos` (
    `id_respaldo`,
    `nombre`,
    `ruta`,
    `fecha_respaldo`,
    `usuario_id`
  )
VALUES
  (
    35,
    'Respaldo (Nuevo respaldo)',
    '/backups/Respaldo (Nuevo respaldo).sql',
    '2023-03-13',
    74
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: usuarios
# ------------------------------------------------------------

INSERT INTO
  `usuarios` (
    `id_usuario`,
    `usuario`,
    `contrasena`,
    `nombre`,
    `apellido`,
    `identificacion`,
    `privilegio`
  )
VALUES
  (
    73,
    'Redhair',
    '$2a$10$je6CifOgaRL9k9FvArk0/eNPyWdx2QUsADunGXuyo6u7fgH8ODQYq',
    'Mariana Alejandra',
    'Barreto Carpio',
    28342843,
    1
  );
INSERT INTO
  `usuarios` (
    `id_usuario`,
    `usuario`,
    `contrasena`,
    `nombre`,
    `apellido`,
    `identificacion`,
    `privilegio`
  )
VALUES
  (
    74,
    'Jess',
    '$2a$10$dfwUPj5HfOKnQdvUsNAoqObUYrK5P1NqKsjbjPQY9bkLjE.HvZok.',
    'Jesus',
    'Zapata',
    3009194,
    1
  );
INSERT INTO
  `usuarios` (
    `id_usuario`,
    `usuario`,
    `contrasena`,
    `nombre`,
    `apellido`,
    `identificacion`,
    `privilegio`
  )
VALUES
  (
    88,
    'Jessi',
    '$2a$10$XZ.asLPyGIm7/E/p93uwxeb0GQNrCds5SgMwwK1jL2nK995GR80FO',
    'Jesús',
    'Zapata',
    30091945,
    1
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: vacunacion
# ------------------------------------------------------------

INSERT INTO
  `vacunacion` (
    `id_vacunacion`,
    `vacuna_nombre`,
    `dosis`,
    `paciente_identificacion`,
    `fecha_vacunacion`
  )
VALUES
  (3, 'VCG', 5, 30091942, '2023-03-01');
INSERT INTO
  `vacunacion` (
    `id_vacunacion`,
    `vacuna_nombre`,
    `dosis`,
    `paciente_identificacion`,
    `fecha_vacunacion`
  )
VALUES
  (17, 'Hepatitis', 2, 30091942, '2023-03-07');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: vacunas
# ------------------------------------------------------------

INSERT INTO
  `vacunas` (
    `id_vacuna`,
    `nombre`,
    `dosis1`,
    `dosis2`,
    `dosis3`,
    `dosis4`,
    `dosis5`
  )
VALUES
  (4, 'VCG', 12, 32, 12, NULL, NULL);
INSERT INTO
  `vacunas` (
    `id_vacuna`,
    `nombre`,
    `dosis1`,
    `dosis2`,
    `dosis3`,
    `dosis4`,
    `dosis5`
  )
VALUES
  (18, 'Hepatitis', 45, 12, 12, NULL, NULL);
INSERT INTO
  `vacunas` (
    `id_vacuna`,
    `nombre`,
    `dosis1`,
    `dosis2`,
    `dosis3`,
    `dosis4`,
    `dosis5`
  )
VALUES
  (36, 'Toxoide', 5, 5, 5, NULL, NULL);
INSERT INTO
  `vacunas` (
    `id_vacuna`,
    `nombre`,
    `dosis1`,
    `dosis2`,
    `dosis3`,
    `dosis4`,
    `dosis5`
  )
VALUES
  (37, 'Triviante viral', 10, 10, NULL, NULL, NULL);

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
