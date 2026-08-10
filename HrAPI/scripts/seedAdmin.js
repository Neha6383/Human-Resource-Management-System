require("dotenv").config();

const bcrypt = require("bcrypt");
const pool = require("../config/db");

const seedAdmin = async () => {
    try {
        const email = "admin@hrms.com";
        const password = "Admin@123";

        // Find Admin role
        const roleResult = await pool.query(
            "SELECT id FROM roles WHERE name = $1",
            ["Admin"]
        );

        if (roleResult.rows.length === 0) {
            console.log("Admin role not found.");
            return;
        }

        const roleId = roleResult.rows[0].id;

        // Check whether admin already exists
        const userResult = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (userResult.rows.length > 0) {
            console.log("Admin user already exists.");
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert admin user
        await pool.query(
            `
            INSERT INTO users (
                email,
                password,
                role_id
            )
            VALUES ($1, $2, $3)
            `,
            [email, hashedPassword, roleId]
        );

        console.log("Admin user created successfully.");
        console.log("Email:", email);
        console.log("Password:", password);

    } catch (error) {
        console.error("Error creating admin user:", error);
    } finally {
        await pool.end();
    }
};

seedAdmin();