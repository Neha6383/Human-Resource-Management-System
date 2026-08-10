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
    try {
        const {
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
        } = req.body;

        // Required field validation
        if (
            !employee_id ||
            !full_name ||
            !department_id ||
            !joining_date ||
            !employment_status
        ) {
            return res.status(400).json({
                message: "Required employee fields are missing"
            });
        }

        // Check whether employee ID already exists
        const existingEmployee = await pool.query(
            "SELECT id FROM employees WHERE employee_id = $1",
            [employee_id]
        );

        if (existingEmployee.rows.length > 0) {
            return res.status(409).json({
                message: "Employee ID already exists"
            });
        }

        const result = await pool.query(
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
                $1, $2, $3, $4, $5, 
                $6, $7, $8, $9, $10, $11
                )
                RETURNING *;
            `,
            [
                employee_id,
                user_id || null,
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

        res.status(201).json({
            message: "Employee created successfully",
            employee: result.rows[0]
        });
    } catch (error) {
        console.error("Error creating employee:", error);

        res.status(500).json({
            message: "Failed to create employee"
        });
        
    }
};

module.exports = {
    getEmployees,
    getEmployeeById,
    createEmployee
};