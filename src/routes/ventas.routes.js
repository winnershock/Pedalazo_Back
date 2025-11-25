const express = require("express");
const router = express.Router();
const ventasController = require("../controllers/ventas.controller");

// Crear venta (cliente)
router.post("/", ventasController.crearVenta);

// Obtener ventas (solo admin)
router.get("/", ventasController.obtenerVentas);

// Obtener detalle de una venta
router.get("/:id", ventasController.obtenerVentaPorId);

module.exports = router;
