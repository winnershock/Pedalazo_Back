module.exports = (req, res, next) => {
    if (!req.user || !req.user.rol) {
        return res.status(403).json({ message: "Acceso denegado. No se encontró rol." });
    }

    // Normalizamos texto
    const rol = req.user.rol.toLowerCase().trim();

    // Aceptamos "admin" o "administrador"
    if (rol !== "admin" && rol !== "administrador") {
        return res.status(403).json({ message: "Acceso denegado. Solo administradores." });
    }

    next();
};
