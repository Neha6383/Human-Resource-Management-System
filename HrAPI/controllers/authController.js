const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        console.log("LOGIN ATTEMPT", { email, dbPasswordType: typeof process.env.DB_PASSWORD, secretDefined: !!process.env.JWT_SECRET });

        const result = await pool.query(
            `
            SELECT
                u.id,
                u.email,
                u.password,
                r.name AS role
            FROM users u
            JOIN roles r
                ON u.role_id = r.id
            WHERE u.email = $1
            `,
            [email]
        );

        console.log("LOGIN QUERY RESULT", result.rows);

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {
    login
};