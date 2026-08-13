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


// ==========================================
// GET ALL EMPLOYEES
// ==========================================

router.get(
    "/",
    authenticateToken,
    authorizeRoles("Admin", "HR"),
    getEmployees
);


// ==========================================
// GET EMPLOYEE BY ID
// ==========================================

router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("Admin", "HR"),
    getEmployeeById
);


// ==========================================
// CREATE EMPLOYEE
// ==========================================

router.post(
    "/",
    authenticateToken,
    authorizeRoles("Admin", "HR"),
    createEmployee
);


// ==========================================
// UPDATE EMPLOYEE
// ==========================================

router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("Admin", "HR"),
    updateEmployee
);


module.exports = router;