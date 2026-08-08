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

//Leave_Requests

CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,
	employee_id INTEGER NOT NULL,
	leave_type VARCHAR(30) NOT NULL,
	start_date DATE NOT NULL,
	end_date DATE NOT NULL,
	reason TEXT,
	status VARCHAR(20) NOT NULL DEFAULT 'Pending',
	reviewed_by INTEGER,
	reviewed_at TIMESTAMP,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_leave_employee
	    FOREIGN KEY (employee_id)
		REFERENCES employees(id),

    CONSTRAINT fk_leave_reviewer
	    FOREIGN KEY (reviewed_by)
		REFERENCES users(id),

	CONSTRAINT chk_leave_type
	    CHECK (
            leave_type IN (
                'Casual Leave',
				'Sick Leave',
				'Earned Leave'
			)
		),

	CONSTRAINT chk_leave_status
	    CHECK (
            status IN (
                'Pending',
				'Approved',
				'Rejected'
			)
		),

	CONSTRAINT chk_leave_dates
	    CHECK (end_date >= start_date)
);

// Notifications

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL,
	title VARCHAR(200) NOT NULL,
	message TEXT NOT NULL,
	type VARCHAR(50),
	is_read BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_notification_user
	    FOREIGN KEY (user_id)
		REFERENCES users(id)
);

// Holidays

CREATE TABLE holidays (
    id SERIAL PRIMARY KEY,
	name VARCHAR(150) NOT NULL,
	holiday_date DATE NOT NULL UNIQUE,
	description TEXT,
	is_optional BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO holidays (name, holiday_date, description, is_optional)
VALUES
    ('Independence Day', '2026-08-15', 'Indian Independence Day', FALSE),
	('Republic Day', '2027-01-26', 'Indian Republic Day', FALSE),
	('Optional Holiday', '2026-10-20', 'Optional company holiday', TRUE);

SELECT * FROM holidays;

// Company_Settings

CREATE TABLE company_settings (
    id SERIAL PRIMARY KEY,
	company_name VARCHAR(200) NOT NULL,
	company_email VARCHAR(200),
	company_phone VARCHAR(30),
	company_address TEXT,
	working_start_time TIME NOT NULL DEFAULT '09:00:00',
	working_end_time TIME NOT NULL DEFAULT '18:00:00',
	late_threshold_minutes INTEGER NOT NULL DEFAULT 15,
	default_casual_leave INTEGER NOT NULL DEFAULT 1210,
	default_sick_leave INTEGER NOT NULL DEFAULT 15,
	default_earned_leave INTEGER NOT NULL DEFAULT 15,
	password_min_length INTEGER NOT NULL DEFAULT 6,
	company_logo TEXT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO company_settings (
    company_name,
    company_email,
    company_phone,
    company_address,
    working_start_time,
    working_end_time,
    late_threshold_minutes,
    default_casual_leave,
    default_sick_leave,
    default_earned_leave,
    password_min_length
)
VALUES (
    'HRMS Demo Company',
    'admin@hrms.com',
    '9876543210',
    'Hyderabad, India',
    '09:00:00',
    '18:00:00',
    15,
    12,
    10,
    15,
    6
);

SELECT * FROM company_settings;