require("dotenv").config();

const bcrypt = require("bcrypt");
const pool = require("../config/db");

const seedAdmin = async () => {
    try {
        const users = [
            {
                email: "admin@hrms.com",
                password: "Admin@123",
                role: "Admin"
            },
            {
                email: "hr@hrms.com",
                password: "Hr@123",
                role: "HR"
            },
            {
                email: "employee@hrms.com",
                password: "Employee@123",
                role: "Employee"
            }
        ];

        for (const user of users) {

            // Find role
            const roleResult = await pool.query(
            "SELECT id FROM roles WHERE name = $1",
            [user.role]
        );

        if (roleResult.rows.length === 0) {
            console.log(`Role ${user.role} not found.`);
            continue;
        }

        const roleId = roleResult.rows[0].id;

        // Check whether user already exists
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [user.email]
        );

        if (existingUser.rows.length > 0) {
            console.log(`${user.email} already exists.`);
            continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(
            user.password, 
            10
        );

        // Create user
        await pool.query(
            `
            INSERT INTO users (
                email,
                password,
                role_id
            )
            VALUES ($1, $2, $3)
            `,
            [
                user.email, 
                hashedPassword, 
                roleId
            ]
        );

        console.log(
            `${user.role} user created: ${user.email}`
        );

        }

    } catch (error) {
        console.error("Error sending users:", error);
    } finally {
        await pool.end();
    }
};

seedAdmin();