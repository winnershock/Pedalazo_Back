const db = require("../config/conexion_DB"); // tu conexión a SQL
const path = require("path");

// ============================
//   CREAR PRODUCTO (ADMIN)
// ============================
exports.crear = async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, categoria } = req.body;
        const imagen = req.file ? req.file.filename : null;

        const sql = `
            INSERT INTO productos (nombre, descripcion, precio, stock, categoria, imagen)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [nombre, descripcion, precio, stock, categoria, imagen];

        db.query(sql, values, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                message: "Producto creado exitosamente",
                producto_id: result.insertId
            });
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ============================
//   LISTAR PRODUCTOS
// ============================
exports.listar = (req, res) => {
    db.query("SELECT * FROM productos", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
};

// ============================
//   OBTENER UN SOLO PRODUCTO
// ============================
exports.obtener = (req, res) => {
    const { id } = req.params;

    db.query("SELECT * FROM productos WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length === 0)
            return res.status(404).json({ error: "Producto no encontrado" });

        res.json(result[0]);
    });
};

// ============================
//   ACTUALIZAR PRODUCTO (ADMIN)
// ============================
exports.actualizar = (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, categoria } = req.body;
    const nuevaImagen = req.file ? req.file.filename : null;

    let sql;
    let values;

    if (nuevaImagen) {
        sql = `
            UPDATE productos 
            SET nombre=?, descripcion=?, precio=?, stock=?, categoria=?, imagen=?
            WHERE id=?
        `;
        values = [nombre, descripcion, precio, stock, categoria, nuevaImagen, id];
    } else {
        sql = `
            UPDATE productos 
            SET nombre=?, descripcion=?, precio=?, stock=?, categoria=?
            WHERE id=?
        `;
        values = [nombre, descripcion, precio, stock, categoria, id];
    }

    db.query(sql, values, (err) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "Producto actualizado correctamente" });
    });
};

// ============================
//   ELIMINAR PRODUCTO (ADMIN)
// ============================
exports.eliminar = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM productos WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "Producto eliminado correctamente" });
    });
};