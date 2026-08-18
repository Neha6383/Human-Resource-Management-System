const pool = require("../config/db");


// ======================================================
// GET ADMIN DASHBOARD STATISTICS
// ======================================================

const getAdminDashboardStats = async (req, res) => {

    try {

        // ==============================================
        // TOTAL EMPLOYEES
        // ==============================================

        const employeeResult = await pool.query(`
            SELECT COUNT(*) AS total
            FROM employees
        `);


        // ==============================================
        // TOTAL DEPARTMENTS
        // ==============================================

        const departmentResult = await pool.query(`
            SELECT COUNT(*) AS total
            FROM departments
        `);


        // ==============================================
        // TODAY'S ATTENDANCE
        // ==============================================

        const attendanceResult = await pool.query(`
            SELECT COUNT(*) AS total
            FROM attendance
            WHERE attendance_date = CURRENT_DATE
        `);


        // ==============================================
        // PENDING LEAVES
        // ==============================================

        const leaveResult = await pool.query(`
            SELECT COUNT(*) AS total
            FROM leave_requests
            WHERE status = 'Pending'
        `);


        // ==============================================
        // SEND RESPONSE
        // ==============================================

        res.status(200).json({

            totalEmployees:
                Number(employeeResult.rows[0].total),

            totalDepartments:
                Number(departmentResult.rows[0].total),

            todayAttendance:
                Number(attendanceResult.rows[0].total),

            pendingLeaves:
                Number(leaveResult.rows[0].total)

        });


    } catch (error) {

        console.error(
            "Dashboard statistics error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to fetch dashboard statistics"

        });

    }

};


module.exports = {
    getAdminDashboardStats
};