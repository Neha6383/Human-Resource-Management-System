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

// Employees

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
	employee_id VARCHAR(20) NOT NULL UNIQUE,
	user_id INTEGER UNIQUE,
	full_name VARCHAR(100) NOT NULL,
	phone VARCHAR(20),
	gender VARCHAR(20),
	date_of_birth DATE,
	department_id INTEGER NOT NULL,
	designation VARCHAR(100),
	joining_date DATE NOT NULL,
	manager_id INTEGER,
	employment_status VARCHAR(20) NOT NULL DEFAULT 'Active',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_employee_user
	    FOREIGN KEY (user_id)
	    REFERENCES users(id),

	CONSTRAINT fk_employee_department
	    FOREIGN KEY (department_id)
	    REFERENCES departments(id),

	CONSTRAINT fk_employee_manager
	    FOREIGN KEY (manager_id)
	    REFERENCES employees(id),

	CONSTRAINT chk_employee_status
	    CHECK (employment_status IN ('Active', 'Inactive', 'Resigned')),

	CONSTRAINT chk_employee_gender
	    CHECK (gender IN ('Male', 'Female', 'Other'))
);


// Attendance 

CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
	employee_id INTEGER NOT NULL,
	attendance_date DATE,
	check_in TIMESTAMP,
	check_out TIMESTAMP,
	working_hours DECIMAL(5,2),
	status VARCHAR(20) NOT NULL DEFAULT 'Present',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_attendance_employee
	    FOREIGN KEY (employee_id)
		REFERENCES employees(id),

	CONSTRAINT chk_attendance_status
	    CHECK (
            status IN (
                'Present',
				'Absent',
				'Late',
				'Half Day',
				'Holiday'
			)
		),

	CONSTRAINT unique_employee_attendance
	    UNIQUE (employee_id, attendance_date)
);