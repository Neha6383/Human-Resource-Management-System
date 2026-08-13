const express = require("express");

const {
    getEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployee
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

router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("Admin", "HR"),
    getEmployeeById
);

router.post(
    "/",
    authenticateToken,
    authorizeRoles("Admin", "HR"),
    createEmployee
);

router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("Admin", "HR"),
    updateEmployee
);

module.exports = router;