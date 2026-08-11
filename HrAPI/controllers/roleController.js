const pool = require("../config/db");


// Get all roles
const getRoles = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                id,
                name,
                created_at
            FROM roles
            ORDER BY id;
        `);

        res.status(200).json(result.rows);

    } catch (error) {

        console.error("Error fetching roles:", error);

        res.status(500).json({
            message: "Failed to fetch roles"
        });
    }
};

// Get role by ID
const getRoleById = async (req, res) => {

    try {

        const { id } = req.params;


        const result = await pool.query(
            `
            SELECT
                id,
                name,
                created_at
            FROM roles
            WHERE id = $1;
            `,
            [id]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Role not found"
            });
        }


        res.status(200).json(
            result.rows[0]
        );

    } catch (error) {

        console.error(
            "Error fetching role:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch role"
        });
    }
};

// Update role
const updateRole = async (req, res) => {

    try {

        const { id } = req.params;
        const { name } = req.body;


        // Validate role name
        if (!name || !name.trim()) {

            return res.status(400).json({
                message: "Role name is required"
            });
        }


        // Check whether role exists
        const existingRole = await pool.query(
            `
            SELECT id
            FROM roles
            WHERE id = $1;
            `,
            [id]
        );


        if (existingRole.rows.length === 0) {

            return res.status(404).json({
                message: "Role not found"
            });
        }


        // Check duplicate role name
        const duplicateRole = await pool.query(
            `
            SELECT id
            FROM roles
            WHERE LOWER(name) = LOWER($1)
            AND id <> $2;
            `,
            [name.trim(), id]
        );


        if (duplicateRole.rows.length > 0) {

            return res.status(409).json({
                message: "Role name already exists"
            });
        }


        // Update role
        const result = await pool.query(
            `
            UPDATE roles
            SET name = $1
            WHERE id = $2
            RETURNING id, name, created_at;
            `,
            [name.trim(), id]
        );


        res.status(200).json({
            message: "Role updated successfully",
            role: result.rows[0]
        });

    } catch (error) {

        console.error(
            "Error updating role:",
            error
        );

        res.status(500).json({
            message: "Failed to update role"
        });
    }
};

// Create a new role
const createRole = async (req, res) => {

    try {

        const { name } = req.body;


        // Validate role name
        if (!name || !name.trim()) {

            return res.status(400).json({
                message: "Role name is required"
            });
        }


        // Check duplicate role
        const existingRole = await pool.query(
            `
            SELECT id
            FROM roles
            WHERE LOWER(name) = LOWER($1)
            `,
            [name.trim()]
        );


        if (existingRole.rows.length > 0) {

            return res.status(409).json({
                message: "Role already exists"
            });
        }


        // Create role
        const result = await pool.query(
            `
            INSERT INTO roles (name)
            VALUES ($1)
            RETURNING id, name, created_at;
            `,
            [name.trim()]
        );


        res.status(201).json({
            message: "Role created successfully",
            role: result.rows[0]
        });

    } catch (error) {

        console.error("Error creating role:", error);

        res.status(500).json({
            message: "Failed to create role"
        });
    }
};

// Get permissions for a role
const getRolePermissions = async (req, res) => {

    try {

        const { id } = req.params;


        // Check whether role exists
        const roleResult = await pool.query(
            `
            SELECT id, name
            FROM roles
            WHERE id = $1;
            `,
            [id]
        );


        if (roleResult.rows.length === 0) {

            return res.status(404).json({
                message: "Role not found"
            });
        }


        // Get all permissions and mark assigned ones
        const result = await pool.query(
            `
            SELECT
                p.id,
                p.module,
                p.feature,
                p.action,

                CASE
                    WHEN rp.permission_id IS NOT NULL
                    THEN true
                    ELSE false
                END AS enabled

            FROM permissions p

            LEFT JOIN role_permissions rp
                ON p.id = rp.permission_id
                AND rp.role_id = $1

            ORDER BY
                p.module,
                p.id;
            `,
            [id]
        );


        res.status(200).json({
            role: roleResult.rows[0],
            permissions: result.rows
        });

    } catch (error) {

        console.error(
            "Error fetching role permissions:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch role permissions"
        });
    }
};

module.exports = {
    getRoles,
    getRoleById,
    createRole,
    updateRole,
    getRolePermissions
};