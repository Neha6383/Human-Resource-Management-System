const pool = require("../config/db");

const getDepartments = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                name,
                description
            FROM departments
            ORDER BY name;
        `);

        res.status(200).json(result.rows);

    } catch (error) {
        console.error("Error fetching departments:", error);

        res.status(500).json({
            message: "Failed to fetch departments"
        });
    }
};

module.exports = {
    getDepartments
};