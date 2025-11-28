const db = require("../config/conexion_DB");
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

        const [result] = await db.query(sql, values);

        res.json({
            message: "Producto creado exitosamente",
            producto_id: result.insertId
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// ============================
//   LISTAR PRODUCTOS
// ============================
exports.listar = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM productos");
        res.json(rows);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// ============================
//   OBTENER UN SOLO PRODUCTO
// ============================
exports.obtener = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query("SELECT * FROM productos WHERE id = ?", [id]);

        if (rows.length === 0)
            return res.status(404).json({ error: "Producto no encontrado" });

        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// ============================
//   ACTUALIZAR PRODUCTO (ADMIN)
// ============================
exports.actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, stock, categoria } = req.body;
        const nuevaImagen = req.file ? req.file.filename : null;

        let sql, values;

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

        await db.query(sql, values);

        res.json({ message: "Producto actualizado correctamente" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// ============================
//   ELIMINAR PRODUCTO (ADMIN)
// ============================
exports.eliminar = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query("DELETE FROM productos WHERE id = ?", [id]);

        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
