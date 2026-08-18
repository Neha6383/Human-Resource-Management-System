const express = require("express");

const {
    getAllAttendance,
    getAttendanceByEmployee,
    getMyAttendance,
    createAttendance,
    checkIn,
    checkOut,
    updateAttendance,
    deleteAttendance
} = require("../controllers/attendanceController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


// GET ALL
router.get(
    "/",
    authenticateToken,
    authorizeRoles("Admin", "HR"),
    getAllAttendance
);

// GET MY ATTENDANCE
router.get(
    "/my-history",
    authenticateToken,
    authorizeRoles("Employee"),
    getMyAttendance
);

// GET BY EMPLOYEE
router.get(
    "/employee/:employeeId",
    authenticateToken,
    authorizeRoles("Admin", "HR"),
    getAttendanceByEmployee
);

// CREATE
router.post(
    "/",
    authenticateToken,
    authorizeRoles("Admin", "HR"),
    createAttendance
);

// EMPLOYEE CHECK-IN
router.post(
    "/check-in",
    authenticateToken,
    authorizeRoles("Employee"),
    checkIn
);

// EMPLOYEE CHECK-OUT
router.post(
    "/check-out",
    authenticateToken,
    authorizeRoles("Employee"),
    checkOut
);

// UPDATE
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("Admin", "HR"),
    updateAttendance
);


// DELETE
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("Admin", "HR"),
    deleteAttendance
);


module.exports = router;