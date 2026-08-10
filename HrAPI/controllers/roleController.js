const pool = require("../config/db");

const getRoles = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM roles ORDER BY id"
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching roles:", error);

        res.status(500).json({
            message: "Failed to fetch roles"
        });
    }
};

module.exports = {
    getRoles
};