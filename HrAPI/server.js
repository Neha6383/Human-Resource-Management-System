require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const roleRoutes = require("./routes/roleRoutes");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("HRMS backend is running...");
});

app.use("/api/roles", roleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);

pool.query("SELECT NOW()", (error, result) => {
    if(error) {
        console.log("Database connection failed:", error);
    } else {
        console.log("Database connected successdully.");
        console.log("Database time:", result.rows[0]);
    }
});

app.listen(PORT, () => {
    console.log(`Server is runnning on http://localhost:${PORT}`);
});