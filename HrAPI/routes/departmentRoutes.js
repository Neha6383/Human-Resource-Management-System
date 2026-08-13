const express = require("express");

const {
    getDepartments
} = require("../controllers/departmentController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    authenticateToken,
    authorizeRoles("Admin", "HR"),
    getDepartments
);

module.exports = router;