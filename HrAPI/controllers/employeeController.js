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

module.exports = {
    getEmployees
};