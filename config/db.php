<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "SaaS_CD";
$conexion = mysqli_connect($servername,$username,$password,$database);





/*


CREATE TABLE SaaS_CD.sede (
	id INT auto_increment NOT NULL,
	direccion varchar(255) NOT NULL,
	nombre varchar(100) NOT NULL,
	CONSTRAINT sede_pk PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

CREATE TABLE SaaS_CD.rol (
	id INT auto_increment NOT NULL,
	descripcion varchar(100) NOT NULL,
	CONSTRAINT rol_pk PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

CREATE TABLE SaaS_CD.usuario (
	id INT auto_increment NOT NULL,
	correo varchar(155) NOT NULL,
	contraseña varchar(255) NOT NULL,
	nombres varchar(155) NOT NULL,
	dni varchar(100) NOT NULL,
	idrol int NOT NULL,
	CONSTRAINT usuario_pk PRIMARY KEY (id),
	CONSTRAINT usuario_rol_FK FOREIGN KEY (idrol) REFERENCES SaaS_CD.rol(id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

CREATE TABLE SaaS_CD.tr_user_sede_access (
	id INT auto_increment NOT NULL,
	idusuario INT NOT NULL,
	idsede INT NOT NULL,
	CONSTRAINT tr_user_sede_access_pk PRIMARY KEY (id),
	CONSTRAINT tr_user_sede_access_sede_FK FOREIGN KEY (idsede) REFERENCES SaaS_CD.sede(id),
	CONSTRAINT tr_user_sede_access_usuario_FK FOREIGN KEY (idusuario) REFERENCES SaaS_CD.usuario(id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

CREATE TABLE SaaS_CD.paciente (
	id INT auto_increment NOT NULL,
	cod_paciente varchar(100) NOT NULL,
	procedencia TEXT NULL,
	edad INT NOT NULL,
	f_nacimiento DATE NOT NULL,
	dni varchar(100) NOT NULL,
	estado INT NOT NULL,
	userid INT NOT NULL,
	sedeid INT NOT NULL,
	roleid INT NOT NULL,
	CONSTRAINT paciente_pk PRIMARY KEY (id),
	CONSTRAINT paciente_rol_FK FOREIGN KEY (roleid) REFERENCES SaaS_CD.rol(id),
	CONSTRAINT paciente_usuario_FK FOREIGN KEY (userid) REFERENCES SaaS_CD.usuario(id),
	CONSTRAINT paciente_sede_FK FOREIGN KEY (sedeid) REFERENCES SaaS_CD.sede(id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;


CREATE TABLE SaaS_CD.tipo_tratamiento (
	id INT auto_increment NOT NULL,
	descripcion varchar(155) NOT NULL,
	CONSTRAINT tipo_tratamiento_pk PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

CREATE TABLE SaaS_CD.tipo_pago (
	id INT auto_increment NOT NULL,
	descripcion varchar(100) NOT NULL,
	CONSTRAINT tipo_pago_pk PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;


CREATE TABLE SaaS_CD.tratamiento (
	id INT auto_increment NOT NULL,
	pacienteid INT NOT NULL,
	userid INT NOT NULL,
	tipo_tratamientoid INT NOT NULL,
	rx_panoramico INT NOT NULL,
	rx_lateral INT NOT NULL,
	rx_analisis INT NOT NULL,
	fecha DATE NOT NULL,
	CONSTRAINT tratamiento_pk PRIMARY KEY (id),
	CONSTRAINT tratamiento_tipo_tratamiento_FK FOREIGN KEY (tipo_tratamientoid) REFERENCES SaaS_CD.tipo_tratamiento(id),
	CONSTRAINT tratamiento_usuario_FK FOREIGN KEY (userid) REFERENCES SaaS_CD.usuario(id),
	CONSTRAINT tratamiento_paciente_FK FOREIGN KEY (pacienteid) REFERENCES SaaS_CD.paciente(id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;


CREATE TABLE SaaS_CD.pagos (
	id INT auto_increment NOT NULL,
	pacienteid INT NOT NULL,
	detalle varchar(155) NOT NULL,
	precio DOUBLE NOT NULL,
	fecha DATE NOT NULL,
	observacion varchar(155) NULL,
	tipo_de_pagoid INT NOT NULL,
	CONSTRAINT pagos_pk PRIMARY KEY (id),
	CONSTRAINT pagos_paciente_FK FOREIGN KEY (pacienteid) REFERENCES SaaS_CD.paciente(id),
	CONSTRAINT pagos_tipo_pago_FK FOREIGN KEY (tipo_de_pagoid) REFERENCES SaaS_CD.tipo_pago(id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

CREATE TABLE SaaS_CD.tipo_objeto (
	id INT auto_increment NOT NULL,
	descripcion varchar(155) NOT NULL,
	CONSTRAINT tipo_pago_pk PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;


CREATE TABLE SaaS_CD.objeto (
	id INT auto_increment NOT NULL,
	pacienteid INT NOT NULL,
	detalle varchar(155) NULL,
	precio DOUBLE NOT NULL,
	estado_pago INT NOT NULL,
	tratamientoid INT NOT NULL,
	tipo_objetoid INT NOT NULL,
	CONSTRAINT objeto_pk PRIMARY KEY (id),
	CONSTRAINT objeto_paciente_FK FOREIGN KEY (pacienteid) REFERENCES SaaS_CD.paciente(id),
	CONSTRAINT objeto_tratamiento_FK FOREIGN KEY (tratamientoid) REFERENCES SaaS_CD.tratamiento(id),
	CONSTRAINT objeto_tipo_objeto_FK FOREIGN KEY (tipo_objetoid) REFERENCES SaaS_CD.tipo_objeto(id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;


CREATE TABLE SaaS_CD.contenciones (
	id INT auto_increment NOT NULL,
	pacienteid INT NOT NULL,
	detalle_tipo INT NOT NULL,
	precio DOUBLE NOT NULL,
	estado_pago INT NOT NULL,
	tratamientoid INT NOT NULL,
	CONSTRAINT contenciones_pk PRIMARY KEY (id),
	CONSTRAINT contenciones_paciente_FK FOREIGN KEY (pacienteid) REFERENCES SaaS_CD.paciente(id),
	CONSTRAINT contenciones_tratamiento_FK FOREIGN KEY (tratamientoid) REFERENCES SaaS_CD.tratamiento(id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;


CREATE TABLE SaaS_CD.siguiente_cita (
	id INT auto_increment NOT NULL,
	pacienteid INT NOT NULL,
	detalle varchar(155) NOT NULL,
	fecha DATE NOT NULL,
	CONSTRAINT siguiente_cita_pk PRIMARY KEY (id),
	CONSTRAINT siguiente_cita_paciente_FK FOREIGN KEY (pacienteid) REFERENCES SaaS_CD.paciente(id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;



*/
?>