CREATE DATABASE IF NOT EXISTS futbol_equipos;
USE futbol_equipos;

CREATE TABLE equipos(
    id_equipo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL;
);