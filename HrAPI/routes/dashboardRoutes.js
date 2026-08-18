const express = require("express");

const {
    getAdminDashboardStats
} = require("../controllers/dashboardController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================================
// ADMIN DASHBOARD STATISTICS
// ======================================================

router.get(
    "/stats",
    authenticateToken,
    authorizeRoles("Admin"),
    getAdminDashboardStats
);


module.exports = router;