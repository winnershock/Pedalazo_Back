const db = require("../config/conexion_DB");

// Crear una venta
exports.crearVenta = async (req, res) => {
    try {
        const { id_cliente, direccion, metodo_pago, items } = req.body;

        if (!id_cliente || !direccion || !metodo_pago || !items || items.length === 0) {
            return res.status(400).json({ ok: false, mensaje: "Datos incompletos" });
        }

        // 1. Crear la venta
        const [ventaResult] = await db.query(
            "INSERT INTO ventas (id_cliente, direccion, metodo_pago, total) VALUES (?, ?, ?, 0)",
            [id_cliente, direccion, metodo_pago]
        );

        const id_venta = ventaResult.insertId;

        let totalVenta = 0;

        // 2. Insertar cada item en detalle_ventas
        for (const item of items) {
            const { id_producto, cantidad, precio_unitario } = item;

            totalVenta += precio_unitario * cantidad;

            // Guardar el detalle
            await db.query(
                "INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)",
                [id_venta, id_producto, cantidad, precio_unitario]
            );

            // Restar stock
            await db.query(
                "UPDATE productos SET stock = stock - ? WHERE id_producto = ?",
                [cantidad, id_producto]
            );
        }

        // 3. Actualizamos el total de la venta
        await db.query(
            "UPDATE ventas SET total = ? WHERE id_venta = ?",
            [totalVenta, id_venta]
        );

        return res.json({
            ok: true,
            mensaje: "Venta registrada correctamente",
            id_venta
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, mensaje: "Error en el servidor" });
    }
};

// Obtener todas las ventas (ADMIN)
exports.obtenerVentas = async (req, res) => {
    try {
        const [ventas] = await db.query(
            "SELECT * FROM ventas ORDER BY fecha DESC"
        );
        res.json(ventas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, mensaje: "Error en el servidor" });
    }
};

// Obtener detalles de una venta por ID (ADMIN)
exports.obtenerVentaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const [[venta]] = await db.query(
            "SELECT * FROM ventas WHERE id_venta = ?",
            [id]
        );

        if (!venta) {
            return res.status(404).json({ ok: false, mensaje: "Venta no encontrada" });
        }

        const [items] = await db.query(
            `SELECT dv.*, p.nombre_producto 
            FROM detalle_ventas dv
            INNER JOIN productos p ON dv.id_producto = p.id_producto
            WHERE dv.id_venta = ?`,
            [id]
        );

        res.json({
            ...venta,
            items
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, mensaje: "Error en el servidor" });
    }
};
