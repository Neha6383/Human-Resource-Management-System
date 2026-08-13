const pool = require("../config/db");

const getEmployees = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                e.id,
                e.employee_id,
                e.full_name,
                u.email,
                e.phone,
                e.gender,
                e.date_of_birth,
                d.name AS department,
                e.designation,
                e.joining_date,
                e.employment_status
            FROM employees e
            LEFT JOIN users u
                ON e.user_id = u.id
            LEFT JOIN departments d
                ON e.department_id = d.id
            ORDER BY e.id;
        `);

        res.status(200).json(result.rows);

    } catch (error) {
        console.error("Error fetching employees:", error);

        res.status(500).json({
            message: "Failed to fetch employees"
        });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT
                e.id,
                e.employee_id,
                e.full_name,
                u.email,
                e.phone,
                e.gender,
                e.date_of_birth,
                d.name AS department,
                e.designation,
                e.joining_date,
                e.manager_id,
                e.employment_status,
                e.created_at,
                e.updated_at
            FROM employees e
            LEFT JOIN users u
                ON e.user_id = u.id
            LEFT JOIN departments d
                ON e.department_id = d.id
            WHERE e.id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error("Error fetching employee:", error);

        res.status(500).json({
            message: "Failed to fetch employee"
        });
    }
};

const createEmployee = async (req, res) => {
    const client = await pool.connect();

    try {

        const {
            employee_id,
            email,
            full_name,
            phone,
            gender,
            date_of_birth,
            department_id,
            designation,
            joining_date,
            manager_id,
            employment_status
        } = req.body;


        // ==============================
        // REQUIRED FIELD VALIDATION
        // ==============================

        if (
            !employee_id ||
            !email ||
            !full_name ||
            !department_id ||
            !joining_date ||
            !employment_status
        ) {

            return res.status(400).json({
                message:
                    "Employee ID, email, full name, department, joining date and employment status are required"
            });

        }


        // ==============================
        // START TRANSACTION
        // ==============================

        await client.query("BEGIN");


        // ==============================
        // CHECK EMPLOYEE ID
        // ==============================

        const existingEmployee =
            await client.query(
                "SELECT id FROM employees WHERE employee_id = $1",
                [employee_id]
            );


        if (existingEmployee.rows.length > 0) {

            await client.query("ROLLBACK");

            return res.status(409).json({
                message: "Employee ID already exists"
            });

        }


        // ==============================
        // CHECK EMAIL
        // ==============================

        const existingUser =
            await client.query(
                "SELECT id FROM users WHERE email = $1",
                [email]
            );


        if (existingUser.rows.length > 0) {

            await client.query("ROLLBACK");

            return res.status(409).json({
                message: "Email already exists"
            });

        }


        // ==============================
        // CREATE USER
        // ==============================

        /*
         * Temporary default password.
         *
         * Later we can implement:
         * - password setup email
         * - password reset
         * - employee self-registration
         */

        const defaultPassword = "Welcome@123";


        const bcrypt = require("bcrypt");

        const hashedPassword =
            await bcrypt.hash(
                defaultPassword,
                10
            );


        /*
         * Employee role = 3
         */

        const userResult =
            await client.query(
                `
                INSERT INTO users (
                    email,
                    password,
                    role_id
                )
                VALUES ($1, $2, $3)
                RETURNING id, email, role_id;
                `,
                [
                    email,
                    hashedPassword,
                    3
                ]
            );


        const userId =
            userResult.rows[0].id;


        // ==============================
        // CREATE EMPLOYEE
        // ==============================

        const employeeResult =
            await client.query(
                `
                INSERT INTO employees (
                    employee_id,
                    user_id,
                    full_name,
                    phone,
                    gender,
                    date_of_birth,
                    department_id,
                    designation,
                    joining_date,
                    manager_id,
                    employment_status
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9,
                    $10,
                    $11
                )
                RETURNING *;
                `,
                [
                    employee_id,
                    userId,
                    full_name,
                    phone || null,
                    gender || null,
                    date_of_birth || null,
                    department_id,
                    designation || null,
                    joining_date,
                    manager_id || null,
                    employment_status
                ]
            );


        // ==============================
        // COMMIT
        // ==============================

        await client.query("COMMIT");


        // ==============================
        // RESPONSE
        // ==============================

        res.status(201).json({

            message:
                "Employee created successfully",

            employee:
                employeeResult.rows[0],

            user: {
                id: userResult.rows[0].id,
                email: userResult.rows[0].email,
                role_id: userResult.rows[0].role_id
            }

        });


    } catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "Error creating employee:",
            error
        );


        res.status(500).json({
            message:
                "Failed to create employee"
        });


    } finally {

        client.release();

    }
};

const updateEmployee = async (req, res) => {
    const client = await pool.connect();

    try {

        const { id } = req.params;

        const {
            employee_id,
            email,
            full_name,
            phone,
            gender,
            date_of_birth,
            department_id,
            designation,
            joining_date,
            manager_id,
            employment_status
        } = req.body;


        // ==============================
        // REQUIRED FIELD VALIDATION
        // ==============================

        if (
            !employee_id ||
            !email ||
            !full_name ||
            !department_id ||
            !joining_date ||
            !employment_status
        ) {

            return res.status(400).json({
                message:
                    "Employee ID, email, full name, department, joining date and employment status are required"
            });

        }


        // ==============================
        // START TRANSACTION
        // ==============================

        await client.query("BEGIN");


        // ==============================
        // CHECK EMPLOYEE
        // ==============================

        const employeeResult = await client.query(
            `
            SELECT
                id,
                user_id
            FROM employees
            WHERE id = $1
            `,
            [id]
        );


        if (employeeResult.rows.length === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "Employee not found"
            });

        }


        const employee = employeeResult.rows[0];


        // ==============================
        // CHECK EMPLOYEE ID
        // ==============================

        const existingEmployee = await client.query(
            `
            SELECT id
            FROM employees
            WHERE employee_id = $1
            AND id <> $2
            `,
            [
                employee_id,
                id
            ]
        );


        if (existingEmployee.rows.length > 0) {

            await client.query("ROLLBACK");

            return res.status(409).json({
                message: "Employee ID already exists"
            });

        }


        // ==============================
        // CHECK EMAIL
        // ==============================

        const existingUser = await client.query(
            `
            SELECT id
            FROM users
            WHERE email = $1
            AND id <> $2
            `,
            [
                email,
                employee.user_id
            ]
        );


        if (existingUser.rows.length > 0) {

            await client.query("ROLLBACK");

            return res.status(409).json({
                message: "Email already exists"
            });

        }


        // ==============================
        // UPDATE USER EMAIL
        // ==============================

        await client.query(
            `
            UPDATE users
            SET
                email = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            `,
            [
                email,
                employee.user_id
            ]
        );


        // ==============================
        // UPDATE EMPLOYEE
        // ==============================

        const updatedEmployee = await client.query(
            `
            UPDATE employees
            SET
                employee_id = $1,
                full_name = $2,
                phone = $3,
                gender = $4,
                date_of_birth = $5,
                department_id = $6,
                designation = $7,
                joining_date = $8,
                manager_id = $9,
                employment_status = $10,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $11
            RETURNING *;
            `,
            [
                employee_id,
                full_name,
                phone || null,
                gender || null,
                date_of_birth || null,
                department_id,
                designation || null,
                joining_date,
                manager_id || null,
                employment_status,
                id
            ]
        );


        // ==============================
        // COMMIT
        // ==============================

        await client.query("COMMIT");


        // ==============================
        // RESPONSE
        // ==============================

        res.status(200).json({

            message:
                "Employee updated successfully",

            employee:
                updatedEmployee.rows[0]

        });


    } catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "Error updating employee:",
            error
        );

        res.status(500).json({
            message:
                "Failed to update employee"
        });


    } finally {

        client.release();

    }
};

module.exports = {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee
};