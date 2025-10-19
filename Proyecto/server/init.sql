CREATE TABLE cliente (
	rut VARCHAR(12) PRIMARY KEY,
	nombre VARCHAR(255) NOT NULL,
	apellido VARCHAR(255) NOT NULL,
	correo VARCHAR(255) NOT NULL,
	contraseña VARCHAR(60) NOT NULL,
	numeroTelefono VARCHAR(12) NOT NULL
);

CREATE TABLE historialSimulacion (
	IDsimulacion SERIAL PRIMARY KEY,
	montoSimulado INT NOT NULL,
	plazoCredito INT NOT NULL,
	seguroDeDegravamen BOOLEAN NOT NULL,
	seguroDeCesantia BOOLEAN NOT NULL,
	CTC INT NOT NULL,
	cuotaMensual INT NOT NULL,
	tasaInteres REAL NOT NULL,
	CAE REAL NOT NULL,
	costosSeguros INT NOT NULL,
	rutUsuario VARCHAR(12),
	guestID VARCHAR(255),

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