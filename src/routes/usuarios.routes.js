const express = require("express");
const router = express.Router();

const UsuariosController = require("../controllers/usuarios.controller");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

// ==========================
// ====== RUTAS PUBLICAS =====
// ==========================

// Registrar usuario
router.post("/registrar", UsuariosController.registrar);

// Login
router.post("/login", UsuariosController.login);

// ==========================
// ===== RUTAS PROTEGIDAS =====
// ==========================

// Perfil (solo usuario logueado)
router.get("/perfil", auth, UsuariosController.perfil);

// Ejemplo de ruta SOLO para admin
router.get("/admin-test", auth, admin, (req, res) => {
    res.json({ message: "Bienvenido admin, ruta OK" });
});

module.exports = router;
