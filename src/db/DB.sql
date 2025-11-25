CREATE DATABASE pedalazo;
USE pedalazo;

-- ===========================
-- USUARIOS
-- ===========================
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    cedula VARCHAR(20),
    telefono VARCHAR(20),
    correo VARCHAR(225) UNIQUE,
    rol ENUM('Cliente','Administrador') DEFAULT 'Cliente',
    password_hash VARCHAR(255)
);


INSERT INTO usuarios (nombre, apellido, cedula, telefono, correo, rol, password_hash)
VALUES (
    'Admin',
    'Principal',
    '00000000',
    '0000000000',
    'admin@pedalazo.com',
    'Administrador',
    '$2b$10$jq01JbaQHZv6MDbz1pWvpuDXvR/dbPTm.WZtQrBCDfZzuPxtoRiii'
);


-- ===========================
-- CATEGORIAS
-- ===========================
CREATE TABLE categorias (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    categoria VARCHAR(100) -- tu backend la llama "categoria"
);

-- Insertamos categorías iniciales
INSERT INTO categorias (categoria)
VALUES ('Bicicletas'), ('Accesorios');

-- ===========================
-- PRODUCTOS
-- ===========================
CREATE TABLE productos (
    id INT PRIMARY KEY AUTO_INCREMENT,      -- tu backend usa "id"
    nombre VARCHAR(225),                    -- backend usa nombre
    descripcion TEXT,                       -- backend usa descripcion
    precio DECIMAL(10,2),                   -- backend usa precio
    stock INT DEFAULT 0,                    -- backend usa stock
    categoria VARCHAR(100),                 -- backend usa categoria (texto)
    imagen VARCHAR(255)                     -- backend usa imagen
);

-- ===========================
-- VENTAS
-- ===========================
CREATE TABLE ventas (
    id_venta INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    direccion VARCHAR(255),
    metodo_pago ENUM('Efectivo','Tarjeta','Nequi'),
    total DECIMAL(10,2),
    estado ENUM('Pendiente','Pagado','Enviado','Cancelado') DEFAULT 'Pendiente',
    FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario)
);

-- ===========================
-- DETALLE DE VENTAS
-- ===========================
CREATE TABLE detalle_ventas (
    id_detalle_venta INT PRIMARY KEY AUTO_INCREMENT,
    id_venta INT,
    id_producto INT,
    cantidad INT,
    precio_unitario DECIMAL(10,2),
    FOREIGN KEY (id_venta) REFERENCES ventas(id_venta),
    FOREIGN KEY (id_producto) REFERENCES productos(id)
);
