const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("AUTH HEADER LLEGA:", authHeader);

        if (!authHeader) {
            return res.status(401).json({ message: "Token no proporcionado" });
        }

        // El token viene así: "Bearer token123"
        const token = authHeader.split(" ")[1];
        console.log("TOKEN OBTENIDO:", token);  // Log para ver el token

        if (!token) {
            return res.status(401).json({ message: "Formato de token inválido" });
        }

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("PAYLOAD DECODIFICADO:", decoded);  // Log para ver el payload

        // Guardar datos en la request
        req.user = decoded;

        next();
    } catch (error) {
        console.error("ERROR EN MIDDLEWARE AUTH:", error);  // Log el error real

        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};