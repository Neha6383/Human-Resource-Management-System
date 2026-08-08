// Roles

CREATE TABLE roles(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (name)
VALUES
    ('Admin'),
    ('HR'),
    ('Employee');

// Users

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
	email VARCHAR(100) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	role_id INTEGER NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_user_role
	    FOREIGN KEY (role_id)
		REFERENCES roles(id)
);

// Departments

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	description TEXT,
	created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO departments (name, description)
VALUES
    ('IT', 'Information Technology Department'),
    ('HR', 'Human Resource Department'),
	('Finance', 'Finance and Accounting Department'),
	('Sales', 'Sales  Department'),
	('Marketing', 'Marketing Department'),
	('Support', 'Customer and Technical Support Department');

SELECT * FROM departments;    