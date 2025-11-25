const router = require("express").Router();
const multer = require("multer");
const path = require("path");

const ProductosController = require("../controllers/productos.controller");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

// ==========================
// CONFIGURACIÓN MULTER
// ==========================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    }
});

const upload = multer({ storage });

// ==========================
// RUTAS PÚBLICAS
// ==========================
router.get("/", ProductosController.listar);
router.get("/:id", ProductosController.obtener);

// ==========================
// RUTAS ADMIN
// ==========================
router.post("/", auth, admin, upload.single("imagen"), ProductosController.crear);
router.put("/:id", auth, admin, upload.single("imagen"), ProductosController.actualizar);
router.delete("/:id", auth, admin, ProductosController.eliminar);

module.exports = router;
