const db = require('../config/conexion_DB');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class UsuariosController {

    // =============================
    // ======== REGISTRO ===========
    // =============================
    async registrar(req, res) {
        try {
            const { nombre, apellido, cedula, telefono, correo, password } = req.body;

            if (!nombre || !apellido || !cedula || !telefono || !correo || !password) {
                return res.status(400).json({ message: "Todos los campos son obligatorios." });
            }

            // Verificar si el correo ya existe
            const [existe] = await db.query(
                "SELECT * FROM usuarios WHERE correo = ?",
                [correo]
            );

            if (existe.length > 0) {
                return res.status(400).json({ message: "El correo ya está registrado." });
            }

            // Hash de contraseñaquiero otra
            const password_hash = await bcrypt.hash(password, 10);

            await db.query(
                `INSERT INTO usuarios (nombre, apellido, cedula, telefono, correo, password_hash) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [nombre, apellido, cedula, telefono, correo, password_hash]
            );

            return res.status(201).json({ message: "Usuario registrado exitosamente." });

        } catch (error) {
            console.error("Error en registrar:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    // =============================
    // ========== LOGIN ============
    // =============================
    async login(req, res) {
        try {
            const { correo, password } = req.body;

            if (!correo || !password) {
                return res.status(400).json({ message: "Correo y contraseña son obligatorios." });
            }

            // Buscar usuario
            const [usuario] = await db.query(
                "SELECT * FROM usuarios WHERE correo = ?",
                [correo]
            );

            if (usuario.length === 0) {
                return res.status(404).json({ message: "Usuario no encontrado." });
            }

            const dataUsuario = usuario[0];

            // Comparar contraseña
            const esValida = await bcrypt.compare(password, dataUsuario.password_hash);

            if (!esValida) {
                return res.status(400).json({ message: "Contraseña incorrecta." });
            }

            // Generar JWT
            const token = jwt.sign(
                {
                    id_usuario: dataUsuario.id_usuario,
                    rol: dataUsuario.rol
                },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.status(200).json({
                message: "Login exitoso",
                token,
                usuario: {
                    id_usuario: dataUsuario.id_usuario,
                    nombre: dataUsuario.nombre,
                    rol: dataUsuario.rol
                }
            });

        } catch (error) {
            console.error("Error en login:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    // ========================================
    // === OBTENER PERFIL PARA EL DASHBOARD ===
    // ========================================
    async perfil(req, res) {
        try {
            const id = req.user.id_usuario;

            // Consultar el perfil del usuario
            const [result] = await db.query(
                "SELECT id_usuario, nombre, apellido, correo, rol FROM usuarios WHERE id_usuario = ?",
                [id]
            );

            // Verificar si el resultado tiene datos
            if (result.length === 0) {
                return res.status(404).json({ message: "Usuario no encontrado." });
            }

            // Log para verificar los datos que devuelve la consulta
            console.log("Datos del usuario:", result);

            return res.status(200).json(result[0]);

        } catch (error) {
            console.error("Error en perfil:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    // ========================================
    // === OBTENER TODOS LOS USUARIOS (ADMIN) ==
    // ========================================
    async obtenerUsuarios(req, res) {
        try {
            const [usuarios] = await db.query(
                "SELECT id_usuario, nombre, apellido, cedula, telefono, correo, rol FROM usuarios"
            );

            return res.status(200).json(usuarios);

        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}

module.exports = new UsuariosController();
