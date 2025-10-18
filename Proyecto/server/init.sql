CREATE TABLE cliente (
	rut VARCHAR(12) PRIMARY KEY,
	nombre VARCHAR(255) NOT NULL,
	apellido VARCHAR(255) NOT NULL,
	correo VARCHAR(255) NOT NULL,
	contraseña VARCHAR(60) NOT NULL,
	numeroTelefono VARCHAR(12) NOT NULL
);

CREATE TABLE noCliente (
	rut VARCHAR(12) PRIMARY KEY,
	correo VARCHAR(100) NOT NULL,
	numeroTelefono VARCHAR(12) NOT NULL
);

CREATE TABLE usuario (
	rutCliente VARCHAR(12) UNIQUE,
	rutNoCliente VARCHAR(12) UNIQUE,

	PRIMARY KEY (rutCliente, rutNoCliente),

	FOREIGN KEY (rutCliente)
		REFERENCES cliente(rut)
		ON DELETE CASCADE,
	FOREIGN KEY (rutNoCliente)
		REFERENCES noCliente(rut)
		ON DELETE CASCADE
);

CREATE TABLE historialSimulacion (
	IDsimulacion SERIAL PRIMARY KEY,
	montoSimulado INT NOT NULL,
	plazoCredito INT NOT NULL,
	mesesDeGracia INT NOT NULL,
	rutUsuario VARCHAR(12) NOT NULL,
	seguroDeDegravamen BOOLEAN NOT NULL,
	seguroDeCesantia BOOLEAN NOT NULL,

	FOREIGN KEY (rutUsuario) 
		REFERENCES cliente(rut)
		ON DELETE CASCADE
);

CREATE TABLE campania (
	IDsimulacion SERIAL PRIMARY KEY,
	montoPreAprobado INT NOT NULL,
	plazoCredito INT NOT NULL,
	mesesDeGracia INT DEFAULT 0,
	rutUsuario VARCHAR(12) NOT NULL,
	seguroDeDegravamen BOOLEAN NOT NULL,
	seguroDeCesantia BOOLEAN NOT NULL,

	FOREIGN KEY (rutUsuario)
		REFERENCES cliente(rut)
		ON DELETE CASCADE
);