const db = require("../config/conexion_DB");

module.exports = {

    // 1. Total de ventas
    totalVentas: async (req, res) => {
        try {
            const [rows] = await db.execute(`
                SELECT COUNT(*) AS total_ventas FROM ventas
            `);

            res.json(rows[0]);
        } catch (error) {
            res.status(500).json({ error: "Error obteniendo total de ventas" });
        }
    },

    // 2. Ingresos totales
    ingresosTotales: async (req, res) => {
        try {
            const [rows] = await db.execute(`
                SELECT SUM(total) AS ingresos FROM ventas
                WHERE estado = 'Pagado'
            `);

            res.json(rows[0]);
        } catch (error) {
            res.status(500).json({ error: "Error obteniendo ingresos" });
        }
    },

    // 3. Productos más vendidos
    masVendidos: async (req, res) => {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    p.nombre_producto,
                    SUM(dv.cantidad) AS total_vendido
                FROM detalle_ventas dv
                INNER JOIN productos p ON p.id_producto = dv.id_producto
                GROUP BY dv.id_producto
                ORDER BY total_vendido DESC
                LIMIT 5;
            `);

            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: "Error obteniendo productos más vendidos" });
        }
    },

    // 4. Stock bajo (por ejemplo < 5 unidades)
    stockBajo: async (req, res) => {
        try {
            const [rows] = await db.execute(`
                SELECT nombre_producto, stock 
                FROM productos
                WHERE stock <= 5
                ORDER BY stock ASC
            `);

            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: "Error obteniendo stock bajo" });
        }
    },

    // 5. Clientes registrados
    totalClientes: async (req, res) => {
        try {
            const [rows] = await db.execute(`
                SELECT COUNT(*) AS total_clientes 
                FROM usuarios
                WHERE rol = 'Cliente'
            `);

            res.json(rows[0]);
        } catch (error) {
            res.status(500).json({ error: "Error obteniendo total de clientes" });
        }
    },

    // 6. Ingresos por mes (últimos 12 meses)
    ingresosPorMes: async (req, res) => {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    DATE_FORMAT(fecha, '%Y-%m') AS mes,
                    SUM(total) AS ingresos
                FROM ventas
                WHERE estado = 'Pagado'
                GROUP BY mes
                ORDER BY mes ASC;
            `);

            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: "Error obteniendo ingresos por mes" });
        }
    }

};
