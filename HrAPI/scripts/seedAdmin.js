const path = require("path");

require("dotenv").config({
    path: path.resolve(__dirname, "..", ".env")
});

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

            const roleResult = await pool.query(
                "SELECT id FROM roles WHERE name = $1",
                [user.role]
            );

            if (roleResult.rows.length === 0) {
                console.log(`Role ${user.role} not found.`);
                continue;
            }

            const roleId = roleResult.rows[0].id;

            const existingUser = await pool.query(
                "SELECT id FROM users WHERE email = $1",
                [user.email]
            );

            const hashedPassword = await bcrypt.hash(user.password, 10);

            if (existingUser.rows.length > 0) {
                await pool.query(
                    `
                    UPDATE users
                    SET password = $1,
                        role_id = $2,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE email = $3
                    `,
                    [hashedPassword, roleId, user.email]
                );

                console.log(`${user.email} was reset to ${user.password}`);
                continue;
            }

            await pool.query(
                `
                INSERT INTO users (
                    email,
                    password,
                    role_id
                )
                VALUES ($1, $2, $3)
                `,
                [user.email, hashedPassword, roleId]
            );

            console.log(`${user.role} user created: ${user.email}`);
        }

    } catch (error) {
        console.error("Error sending users:", error);
    } finally {
        await pool.end();
    }
};

seedAdmin();