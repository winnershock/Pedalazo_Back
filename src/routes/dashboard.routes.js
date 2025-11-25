const router = require("express").Router();
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

const Dashboard = require("../controllers/dashboard.controller");

// Todas las rutas solo para ADMIN
router.get("/total-ventas",  auth, admin, Dashboard.totalVentas);
router.get("/ingresos-totales", auth, admin, Dashboard.ingresosTotales);
router.get("/mas-vendidos", auth, admin, Dashboard.masVendidos);
router.get("/stock-bajo", auth, admin, Dashboard.stockBajo);
router.get("/total-clientes", auth, admin, Dashboard.totalClientes);
router.get("/ingresos-mes", auth, admin, Dashboard.ingresosPorMes);

module.exports = router;
