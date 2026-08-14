const express = require("express");

const {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
} = require("../controllers/departmentController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


// GET ALL DEPARTMENTS
router.get(
    "/",
    authenticateToken,
    authorizeRoles("Admin", "HR"),
    getDepartments
);


// CREATE DEPARTMENT
router.post(
    "/",
    authenticateToken,
    authorizeRoles("Admin", "HR"),
    createDepartment
);


// UPDATE DEPARTMENT
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("Admin", "HR"),
    updateDepartment
);


// DELETE DEPARTMENT
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("Admin", "HR"),
    deleteDepartment
);


module.exports = router;