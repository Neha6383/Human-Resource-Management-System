const express = require("express");

const {
    getEmployees
} = require("../controllers/employeeController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    authenticateToken,
    authorizeRoles("Admin", "HR"),
    getEmployees
);

module.exports = router;