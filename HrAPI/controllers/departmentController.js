
const pool = require("../config/db");


// ==========================================
// GET ALL DEPARTMENTS
// ==========================================

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

        console.error(
            "Error fetching departments:",
            error
        );


        res.status(500).json({
            message:
                "Failed to fetch departments"
        });

    }

};


// ==========================================
// CREATE DEPARTMENT
// ==========================================

const createDepartment = async (req, res) => {

    try {

        const {
            name,
            description
        } = req.body;


        // ==========================================
        // VALIDATION
        // ==========================================

        if (!name || !name.trim()) {

            return res.status(400).json({
                message:
                    "Department name is required"
            });

        }


        // ==========================================
        // CHECK DUPLICATE DEPARTMENT
        // ==========================================

        const existingDepartment =
            await pool.query(
                `
                SELECT id
                FROM departments
                WHERE LOWER(name) = LOWER($1)
                `,
                [name.trim()]
            );


        if (
            existingDepartment.rows.length > 0
        ) {

            return res.status(409).json({
                message:
                    "Department name already exists"
            });

        }


        // ==========================================
        // INSERT DEPARTMENT
        // ==========================================

        const result =
            await pool.query(
                `
                INSERT INTO departments
                (
                    name,
                    description
                )
                VALUES
                (
                    $1,
                    $2
                )
                RETURNING
                    id,
                    name,
                    description;
                `,
                [
                    name.trim(),
                    description
                        ? description.trim()
                        : null
                ]
            );


        // ==========================================
        // RESPONSE
        // ==========================================

        res.status(201).json({

            message:
                "Department created successfully",

            department:
                result.rows[0]

        });


    } catch (error) {

        console.error(
            "Error creating department:",
            error
        );


        res.status(500).json({
            message:
                "Failed to create department"
        });

    }

};


// ==========================================
// UPDATE DEPARTMENT
// ==========================================

const updateDepartment = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            name,
            description
        } = req.body;


        // ==========================================
        // VALIDATION
        // ==========================================

        if (!name || !name.trim()) {

            return res.status(400).json({
                message:
                    "Department name is required"
            });

        }


        // ==========================================
        // CHECK IF DEPARTMENT EXISTS
        // ==========================================

        const existingDepartment =
            await pool.query(
                `
                SELECT
                    id,
                    name,
                    description
                FROM departments
                WHERE id = $1
                `,
                [id]
            );


        if (
            existingDepartment.rows.length === 0
        ) {

            return res.status(404).json({
                message:
                    "Department not found"
            });

        }


        // ==========================================
        // CHECK DUPLICATE NAME
        // ==========================================

        const duplicateDepartment =
            await pool.query(
                `
                SELECT id
                FROM departments
                WHERE LOWER(name) = LOWER($1)
                AND id <> $2
                `,
                [
                    name.trim(),
                    id
                ]
            );


        if (
            duplicateDepartment.rows.length > 0
        ) {

            return res.status(409).json({
                message:
                    "Department name already exists"
            });

        }


        // ==========================================
        // UPDATE DEPARTMENT
        // ==========================================

        const result =
            await pool.query(
                `
                UPDATE departments
                SET
                    name = $1,
                    description = $2
                WHERE id = $3
                RETURNING
                    id,
                    name,
                    description;
                `,
                [
                    name.trim(),

                    description
                        ? description.trim()
                        : null,

                    id
                ]
            );


        // ==========================================
        // RESPONSE
        // ==========================================

        res.status(200).json({

            message:
                "Department updated successfully",

            department:
                result.rows[0]

        });


    } catch (error) {

        console.error(
            "Error updating department:",
            error
        );


        res.status(500).json({
            message:
                "Failed to update department"
        });

    }

};

// ==========================================
// DELETE DEPARTMENT
// ==========================================

const deleteDepartment = async (req, res) => {

    try {

        const { id } = req.params;


        // ==========================================
        // CHECK IF DEPARTMENT EXISTS
        // ==========================================

        const existingDepartment = await pool.query(
            `
            SELECT
                id,
                name
            FROM departments
            WHERE id = $1
            `,
            [id]
        );


        if (existingDepartment.rows.length === 0) {

            return res.status(404).json({
                message: "Department not found"
            });

        }


        // ==========================================
        // CHECK IF EMPLOYEES USE THIS DEPARTMENT
        // ==========================================

        const employeeCheck = await pool.query(
            `
            SELECT COUNT(*) AS count
            FROM employees
            WHERE department_id = $1
            `,
            [id]
        );


        const employeeCount =
            Number(employeeCheck.rows[0].count);


        if (employeeCount > 0) {

            return res.status(409).json({

                message:
                    "Department cannot be deleted because employees are assigned to it",

                employeeCount

            });

        }


        // ==========================================
        // DELETE DEPARTMENT
        // ==========================================

        await pool.query(
            `
            DELETE FROM departments
            WHERE id = $1
            `,
            [id]
        );


        // ==========================================
        // SUCCESS RESPONSE
        // ==========================================

        res.status(200).json({

            message:
                "Department deleted successfully",

            departmentId: Number(id)

        });


    } catch (error) {

        console.error(
            "Error deleting department:",
            error
        );


        res.status(500).json({

            message:
                "Failed to delete department"

        });

    }

};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {

    getDepartments,

    createDepartment,

    updateDepartment,
    deleteDepartment

};

