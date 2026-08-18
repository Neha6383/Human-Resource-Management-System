const pool = require("../config/db");


// ======================================================
// GET ALL ATTENDANCE
// ======================================================

const getAllAttendance = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                a.id,
                a.employee_id,
                e.employee_id AS employee_code,
                e.full_name,
                a.attendance_date,
                a.check_in,
                a.check_out,
                a.working_hours,
                a.status,
                a.created_at,
                a.updated_at
            FROM attendance a
            JOIN employees e
                ON a.employee_id = e.id
            ORDER BY
                a.attendance_date DESC,
                e.full_name ASC;
        `);


        res.status(200).json(result.rows);


    } catch (error) {

        console.error(
            "Error fetching attendance:",
            error
        );


        res.status(500).json({

            message:
                "Failed to fetch attendance records"

        });

    }

};


// ======================================================
// GET ATTENDANCE BY EMPLOYEE
// ======================================================

const getAttendanceByEmployee = async (req, res) => {

    try {

        const { employeeId } = req.params;

        console.log(
            "Requested employee ID:",
            employeeId
        );

        const result = await pool.query(
            `
            SELECT
                a.id,
                a.employee_id,
                e.employee_id AS employee_code,
                e.full_name,
                a.attendance_date,
                a.check_in,
                a.check_out,
                a.working_hours,
                a.status,
                a.created_at,
                a.updated_at
            FROM attendance a
            JOIN employees e
                ON a.employee_id = e.id
            WHERE e.employee_id = $1
            ORDER BY a.attendance_date DESC;
            `,
            [employeeId]
        );

        console.log(
            "Attendance result:",
            result.rows
        );

        return res.status(200).json(result.rows);

    } catch (error) {

        console.error(
            "Error fetching employee attendance:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch employee attendance"
        });

    }
};

// ======================================================
// GET MY ATTENDANCE HISTORY
// ======================================================

const getMyAttendance = async (req, res) => {

    try {

        // ==================================================
        // GET USER ID FROM JWT
        // ==================================================

        const userId = req.user.userId;


        if (!userId) {

            return res.status(401).json({

                message:
                    "User information not found in token"

            });

        }


        // ==================================================
        // FIND EMPLOYEE
        // ==================================================

        const employeeResult = await pool.query(
            `
            SELECT
                id,
                employee_id,
                full_name
            FROM employees
            WHERE user_id = $1
            `,
            [userId]
        );


        // ==================================================
        // EMPLOYEE NOT FOUND
        // ==================================================

        if (employeeResult.rows.length === 0) {

            return res.status(404).json({

                message:
                    "Employee profile not found"

            });

        }


        const employee =
            employeeResult.rows[0];


        // ==================================================
        // GET ATTENDANCE HISTORY
        // ==================================================

        const attendanceResult =
            await pool.query(
                `
                SELECT
                    a.id,
                    a.employee_id,
                    e.employee_id AS employee_code,
                    e.full_name,
                    a.attendance_date,
                    a.check_in,
                    a.check_out,
                    a.working_hours,
                    a.status,
                    a.created_at,
                    a.updated_at
                FROM attendance a
                JOIN employees e
                    ON a.employee_id = e.id
                WHERE a.employee_id = $1
                ORDER BY
                    a.attendance_date DESC;
                `,
                [employee.id]
            );


        // ==================================================
        // RESPONSE
        // ==================================================

        return res.status(200).json({

            employee: {

                id:
                    employee.id,

                employeeId:
                    employee.employee_id,

                name:
                    employee.full_name

            },

            attendance:
                attendanceResult.rows

        });


    } catch (error) {

        console.error(
            "Error fetching my attendance:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to fetch attendance history"

        });

    }

};


// ======================================================
// CREATE ATTENDANCE
// ======================================================

const createAttendance = async (req, res) => {

    try {

        const {
            employee_id,
            attendance_date,
            check_in,
            check_out,
            status
        } = req.body;


        // ==================================================
        // VALIDATION
        // ==================================================

        if (!employee_id) {

            return res.status(400).json({

                message:
                    "Employee ID is required"

            });

        }


        if (!attendance_date) {

            return res.status(400).json({

                message:
                    "Attendance date is required"

            });

        }


        if (!status) {

            return res.status(400).json({

                message:
                    "Attendance status is required"

            });

        }


        // ==================================================
        // CHECK EMPLOYEE
        // ==================================================

        const employeeCheck = await pool.query(
            `
            SELECT
                id,
                employee_id,
                full_name
            FROM employees
            WHERE id = $1
            `,
            [employee_id]
        );


        if (employeeCheck.rows.length === 0) {

            return res.status(404).json({

                message:
                    "Employee not found"

            });

        }


        // ==================================================
        // INSERT ATTENDANCE
        // ==================================================

        const result = await pool.query(
            `
            INSERT INTO attendance
            (
                employee_id,
                attendance_date,
                check_in,
                check_out,
                status,
                created_at,
                updated_at
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            )
            RETURNING
                id,
                employee_id,
                attendance_date,
                check_in,
                check_out,
                working_hours,
                status,
                created_at,
                updated_at;
            `,
            [
                employee_id,
                attendance_date,
                check_in || null,
                check_out || null,
                status
            ]
        );


        res.status(201).json({

            message:
                "Attendance created successfully",

            attendance:
                result.rows[0]

        });


    } catch (error) {

        console.error(
            "Error creating attendance:",
            error
        );


        // ==================================================
        // DUPLICATE ATTENDANCE
        // ==================================================

        if (error.code === "23505") {

            return res.status(409).json({

                message:
                    "Attendance already exists for this employee on this date"

            });

        }


        res.status(500).json({

            message:
                "Failed to create attendance"

        });

    }

};


// ======================================================
// EMPLOYEE CHECK-IN
// ======================================================

const checkIn = async (req, res) => {

    try {

        // ==================================================
        // GET LOGGED-IN USER ID FROM JWT
        // ==================================================

        const userId = req.user.userId;


        if (!userId) {

            return res.status(401).json({

                message:
                    "User information not found in token"

            });

        }


        // ==================================================
        // FIND EMPLOYEE USING USER ID
        // ==================================================

        const employeeResult = await pool.query(
            `
            SELECT
                id,
                employee_id,
                full_name
            FROM employees
            WHERE user_id = $1
            `,
            [userId]
        );


        // ==================================================
        // EMPLOYEE NOT FOUND
        // ==================================================

        if (employeeResult.rows.length === 0) {

            return res.status(404).json({

                message:
                    "Employee profile not found"

            });

        }


        const employee =
            employeeResult.rows[0];


        // ==================================================
        // CHECK TODAY'S ATTENDANCE
        // ==================================================

        const existingAttendance =
            await pool.query(
                `
                SELECT
                    id,
                    attendance_date,
                    check_in,
                    check_out,
                    working_hours,
                    status
                FROM attendance
                WHERE employee_id = $1
                  AND attendance_date = CURRENT_DATE
                `,
                [employee.id]
            );


        // ==================================================
        // ALREADY CHECKED IN
        // ==================================================

        if (existingAttendance.rows.length > 0) {

            return res.status(409).json({

                message:
                    "Attendance already marked for today",

                attendance:
                    existingAttendance.rows[0]

            });

        }


        // ==================================================
        // CREATE CHECK-IN RECORD
        // ==================================================

        const result = await pool.query(
            `
            INSERT INTO attendance
            (
                employee_id,
                attendance_date,
                check_in,
                status,
                created_at,
                updated_at
            )
            VALUES
            (
                $1,
                CURRENT_DATE,
                CURRENT_TIMESTAMP,
                'Present',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            )
            RETURNING
                id,
                employee_id,
                attendance_date,
                check_in,
                check_out,
                working_hours,
                status,
                created_at,
                updated_at;
            `,
            [employee.id]
        );


        // ==================================================
        // SUCCESS RESPONSE
        // ==================================================

        return res.status(201).json({

            message:
                "Check-in successful",

            employee: {

                id:
                    employee.id,

                employeeId:
                    employee.employee_id,

                name:
                    employee.full_name

            },

            attendance:
                result.rows[0]

        });


    } catch (error) {

        console.error(
            "Check-in error:",
            error
        );


        // ==================================================
        // DUPLICATE ATTENDANCE
        // ==================================================

        if (error.code === "23505") {

            return res.status(409).json({

                message:
                    "Attendance already marked for today"

            });

        }


        return res.status(500).json({

            message:
                "Failed to check in"

        });

    }

};

// ======================================================
// EMPLOYEE CHECK-OUT
// ======================================================

const checkOut = async (req, res) => {

    try {

        // ==================================================
        // GET LOGGED-IN USER ID FROM JWT
        // ==================================================

        const userId = req.user.userId;


        if (!userId) {

            return res.status(401).json({

                message:
                    "User information not found in token"

            });

        }


        // ==================================================
        // FIND EMPLOYEE
        // ==================================================

        const employeeResult = await pool.query(
            `
            SELECT
                id,
                employee_id,
                full_name
            FROM employees
            WHERE user_id = $1
            `,
            [userId]
        );


        if (employeeResult.rows.length === 0) {

            return res.status(404).json({

                message:
                    "Employee profile not found"

            });

        }


        const employee =
            employeeResult.rows[0];


        // ==================================================
        // FIND TODAY'S ATTENDANCE
        // ==================================================

        const attendanceResult =
            await pool.query(
                `
                SELECT
                    id,
                    employee_id,
                    attendance_date,
                    check_in,
                    check_out,
                    working_hours,
                    status
                FROM attendance
                WHERE employee_id = $1
                  AND attendance_date = CURRENT_DATE
                `,
                [employee.id]
            );


        // ==================================================
        // CHECK-IN NOT FOUND
        // ==================================================

        if (attendanceResult.rows.length === 0) {

            return res.status(404).json({

                message:
                    "Check-in not found for today"

            });

        }


        const attendance =
            attendanceResult.rows[0];


        // ==================================================
        // CHECK-IN TIME VALIDATION
        // ==================================================

        if (!attendance.check_in) {

            return res.status(400).json({

                message:
                    "Employee has not checked in"

            });

        }


        // ==================================================
        // ALREADY CHECKED OUT
        // ==================================================

        if (attendance.check_out) {

            return res.status(409).json({

                message:
                    "Employee has already checked out",

                attendance

            });

        }


        // ==================================================
        // UPDATE CHECK-OUT
        //
        // EXTRACT(EPOCH FROM (...)) gives the
        // difference in seconds.
        //
        // Divide by 3600 to convert seconds
        // into hours.
        // ==================================================

        const result = await pool.query(
            `
            UPDATE attendance
            SET
                check_out = CURRENT_TIMESTAMP,

                working_hours =
                    ROUND(
                        (
                            EXTRACT(
                                EPOCH FROM
                                (CURRENT_TIMESTAMP - check_in)
                            ) / 3600
                        )::numeric,
                        2
                    ),

                updated_at = CURRENT_TIMESTAMP

            WHERE id = $1

            RETURNING
                id,
                employee_id,
                attendance_date,
                check_in,
                check_out,
                working_hours,
                status,
                created_at,
                updated_at;
            `,
            [attendance.id]
        );


        // ==================================================
        // SUCCESS RESPONSE
        // ==================================================

        return res.status(200).json({

            message:
                "Check-out successful",

            employee: {

                id:
                    employee.id,

                employeeId:
                    employee.employee_id,

                name:
                    employee.full_name

            },

            attendance:
                result.rows[0]

        });


    } catch (error) {

        console.error(
            "Check-out error:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to check out"

        });

    }

};

// ======================================================
// UPDATE ATTENDANCE
// ======================================================

const updateAttendance = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            check_in,
            check_out,
            status
        } = req.body;


        // ==================================================
        // CHECK EXISTING RECORD
        // ==================================================

        const existingAttendance = await pool.query(
            `
            SELECT
                id
            FROM attendance
            WHERE id = $1
            `,
            [id]
        );


        if (existingAttendance.rows.length === 0) {

            return res.status(404).json({

                message:
                    "Attendance record not found"

            });

        }


        // ==================================================
        // UPDATE RECORD
        // ==================================================

        const result = await pool.query(
            `
            UPDATE attendance
            SET
                check_in = $1,
                check_out = $2,
                status = $3,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING
                id,
                employee_id,
                attendance_date,
                check_in,
                check_out,
                working_hours,
                status,
                created_at,
                updated_at;
            `,
            [
                check_in || null,
                check_out || null,
                status,
                id
            ]
        );


        res.status(200).json({

            message:
                "Attendance updated successfully",

            attendance:
                result.rows[0]

        });


    } catch (error) {

        console.error(
            "Error updating attendance:",
            error
        );


        res.status(500).json({

            message:
                "Failed to update attendance"

        });

    }

};


// ======================================================
// DELETE ATTENDANCE
// ======================================================

const deleteAttendance = async (req, res) => {

    try {

        const { id } = req.params;


        // ==================================================
        // CHECK EXISTING RECORD
        // ==================================================

        const existingAttendance = await pool.query(
            `
            SELECT
                id
            FROM attendance
            WHERE id = $1
            `,
            [id]
        );


        if (existingAttendance.rows.length === 0) {

            return res.status(404).json({

                message:
                    "Attendance record not found"

            });

        }


        // ==================================================
        // DELETE RECORD
        // ==================================================

        await pool.query(
            `
            DELETE FROM attendance
            WHERE id = $1
            `,
            [id]
        );


        res.status(200).json({

            message:
                "Attendance deleted successfully",

            attendanceId:
                Number(id)

        });


    } catch (error) {

        console.error(
            "Error deleting attendance:",
            error
        );


        res.status(500).json({

            message:
                "Failed to delete attendance"

        });

    }

};


// ======================================================
// EXPORT FUNCTIONS
// ======================================================

module.exports = {

    getAllAttendance,

    getAttendanceByEmployee,
    getMyAttendance,

    createAttendance,
    checkIn,
    checkOut,

    updateAttendance,

    deleteAttendance

};