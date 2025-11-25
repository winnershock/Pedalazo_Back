const router = require("express").Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/admin");

// Ejemplo: panel info admin
router.get("/dashboard", auth, isAdmin, (req, res) => {
    res.json({ message: "Bienvenido admin", usuario: req.user });
});

module.exports = router;
