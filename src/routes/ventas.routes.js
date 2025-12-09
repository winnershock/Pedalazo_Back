const express = require("express");
const router = express.Router();
const ventasController = require("../controllers/ventas.controller");

const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

// Cliente crea venta
router.post("/", auth, ventasController.crearVenta);

// Admin obtiene todas las ventas
router.get("/", auth, admin, ventasController.obtenerVentas);

// Admin obtiene detalle de venta
router.get("/:id", auth, admin, ventasController.obtenerVentaPorId);

module.exports = router;
