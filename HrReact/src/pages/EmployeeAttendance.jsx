import { useEffect, useState } from "react";

import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    Divider,
    Chip
} from "@mui/material";

import AppLayout from "../components/Layout/AppLayout";


function EmployeeAttendance() {

    // ======================================================
    // STATE
    // ======================================================

    const [employee, setEmployee] = useState(null);

    const [attendance, setAttendance] = useState([]);

    const [loading, setLoading] = useState(true);

    const [processing, setProcessing] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // ======================================================
    // TOKEN
    // ======================================================

    const token =
        localStorage.getItem("token");


    // ======================================================
    // FETCH MY ATTENDANCE
    // ======================================================

    const fetchMyAttendance = async () => {

        try {

            setLoading(true);

            setError("");


            if (!token) {

                throw new Error(
                    "Access token is required"
                );

            }


            const response = await fetch(
                "http://localhost:5000/api/attendance/my-history",
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to fetch attendance"
                );

            }


            setEmployee(
                data.employee
            );


            setAttendance(
                Array.isArray(data.attendance)
                    ? data.attendance
                    : []
            );


        } catch (error) {

            console.error(
                "Attendance fetch error:",
                error
            );


            setError(
                error.message ||
                "Unable to load attendance."
            );


        } finally {

            setLoading(false);

        }

    };


    // ======================================================
    // LOAD ATTENDANCE
    // ======================================================

    useEffect(() => {

        fetchMyAttendance();

    }, []);


    // ======================================================
    // GET TODAY'S ATTENDANCE
    // ======================================================

    const getTodayAttendance = () => {

        const today =
            new Date();


        return attendance.find(
            (record) => {

                const attendanceDate =
                    new Date(
                        record.attendance_date
                    );


                return (
                    attendanceDate.toDateString()
                    === today.toDateString()
                );

            }
        );

    };


    const todayAttendance =
        getTodayAttendance();


    // ======================================================
    // CHECK-IN
    // ======================================================

    const handleCheckIn = async () => {

        try {

            setProcessing(true);

            setError("");

            setSuccess("");


            const response = await fetch(
                "http://localhost:5000/api/attendance/check-in",
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Check-in failed"
                );

            }


            setSuccess(
                data.message ||
                "Check-in successful"
            );


            // Refresh attendance

            await fetchMyAttendance();


        } catch (error) {

            console.error(
                "Check-in error:",
                error
            );


            setError(
                error.message ||
                "Failed to check in"
            );


        } finally {

            setProcessing(false);

        }

    };


    // ======================================================
    // CHECK-OUT
    // ======================================================

    const handleCheckOut = async () => {

        try {

            setProcessing(true);

            setError("");

            setSuccess("");


            const response = await fetch(
                "http://localhost:5000/api/attendance/check-out",
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Check-out failed"
                );

            }


            setSuccess(
                data.message ||
                "Check-out successful"
            );


            // Refresh attendance

            await fetchMyAttendance();


        } catch (error) {

            console.error(
                "Check-out error:",
                error
            );


            setError(
                error.message ||
                "Failed to check out"
            );


        } finally {

            setProcessing(false);

        }

    };


    // ======================================================
    // FORMAT DATE
    // ======================================================

    const formatDate = (date) => {

        if (!date) {

            return "-";

        }


        return new Date(
            date
        ).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    // ======================================================
    // FORMAT TIME
    // ======================================================

    const formatTime = (time) => {

        if (!time) {

            return "-";

        }


        return new Date(
            time
        ).toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    // ======================================================
    // UI
    // ======================================================

    return (

        <AppLayout>

            <Box
                sx={{
                    width: "100%",
                    maxWidth: "1200px",
                    margin: "0 auto",
                    paddingBottom: 4
                }}
            >

                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <Box
                    sx={{
                        marginBottom: 3
                    }}
                >

                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700
                        }}
                    >
                        My Attendance
                    </Typography>


                    <Typography
                        color="text.secondary"
                        sx={{
                            marginTop: 0.5
                        }}
                    >
                        {employee
                            ? `${employee.employeeId} - ${employee.name}`
                            : "View and manage your attendance"}
                    </Typography>

                </Box>


                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (

                    <Alert
                        severity="error"
                        sx={{
                            marginBottom: 3
                        }}
                    >
                        {error}
                    </Alert>

                )}


                {/* ==================================================
                    SUCCESS
                ================================================== */}

                {success && (

                    <Alert
                        severity="success"
                        sx={{
                            marginBottom: 3
                        }}
                    >
                        {success}
                    </Alert>

                )}


                {/* ==================================================
                    LOADING
                ================================================== */}

                {loading ? (

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            padding: 6
                        }}
                    >

                        <CircularProgress />

                    </Box>

                ) : (

                    <>

                        {/* ==================================================
                            TODAY'S ATTENDANCE
                        ================================================== */}

                        <Card
                            sx={{
                                borderRadius: "12px",
                                marginBottom: 4
                            }}
                        >

                            <CardContent
                                sx={{
                                    padding: 3
                                }}
                            >

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        marginBottom: 2
                                    }}
                                >
                                    Today's Attendance
                                </Typography>


                                {!todayAttendance ? (

                                    <Box>

                                        <Typography
                                            color="text.secondary"
                                            sx={{
                                                marginBottom: 2
                                            }}
                                        >
                                            You have not marked
                                            attendance today.
                                        </Typography>


                                        <Button
                                            variant="contained"
                                            onClick={
                                                handleCheckIn
                                            }
                                            disabled={
                                                processing
                                            }
                                        >

                                            {processing
                                                ? "Processing..."
                                                : "Check In"}

                                        </Button>

                                    </Box>

                                ) : (

                                    <Box>

                                        {/* STATUS */}

                                        <Box
                                            sx={{
                                                marginBottom: 2
                                            }}
                                        >

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Status
                                            </Typography>


                                            <Chip
                                                label={
                                                    todayAttendance.status
                                                }
                                                color={
                                                    todayAttendance.status
                                                        === "Present"
                                                        ? "success"
                                                        : "default"
                                                }
                                                sx={{
                                                    marginTop: 0.5
                                                }}
                                            />

                                        </Box>


                                        {/* CHECK-IN */}

                                        <Typography
                                            sx={{
                                                marginBottom: 1
                                            }}
                                        >

                                            <strong>
                                                Check-in:
                                            </strong>{" "}

                                            {formatTime(
                                                todayAttendance.check_in
                                            )}

                                        </Typography>


                                        {/* CHECK-OUT */}

                                        <Typography
                                            sx={{
                                                marginBottom: 2
                                            }}
                                        >

                                            <strong>
                                                Check-out:
                                            </strong>{" "}

                                            {formatTime(
                                                todayAttendance.check_out
                                            )}

                                        </Typography>


                                        {/* ACTION */}

                                        {!todayAttendance.check_out ? (

                                            <Button
                                                variant="contained"
                                                color="warning"
                                                onClick={
                                                    handleCheckOut
                                                }
                                                disabled={
                                                    processing
                                                }
                                            >

                                                {processing
                                                    ? "Processing..."
                                                    : "Check Out"}

                                            </Button>

                                        ) : (

                                            <Typography
                                                color="text.secondary"
                                            >

                                                Working Hours:{" "}

                                                <strong>
                                                    {
                                                        todayAttendance
                                                            .working_hours
                                                            || "0.00"
                                                    }
                                                </strong>

                                                {" "}hours

                                            </Typography>

                                        )}

                                    </Box>

                                )}

                            </CardContent>

                        </Card>


                        {/* ==================================================
                            ATTENDANCE HISTORY
                        ================================================== */}

                        <Card
                            sx={{
                                borderRadius: "12px"
                            }}
                        >

                            <CardContent
                                sx={{
                                    padding: 3
                                }}
                            >

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        marginBottom: 0.5
                                    }}
                                >
                                    Attendance History
                                </Typography>


                                <Typography
                                    color="text.secondary"
                                    sx={{
                                        marginBottom: 3
                                    }}
                                >
                                    View your previous attendance records.
                                </Typography>


                                <Divider
                                    sx={{
                                        marginBottom: 2
                                    }}
                                />


                                {attendance.length === 0 ? (

                                    <Typography
                                        color="text.secondary"
                                        sx={{
                                            textAlign: "center",
                                            padding: 4
                                        }}
                                    >
                                        No attendance records found.
                                    </Typography>

                                ) : (

                                    attendance.map(
                                        (record) => (

                                            <Box
                                                key={record.id}
                                                sx={{
                                                    padding: 2,
                                                    marginBottom: 1.5,
                                                    border:
                                                        "1px solid #e0e0e0",
                                                    borderRadius: "8px"
                                                }}
                                            >

                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems:
                                                            "center",
                                                        flexWrap: "wrap",
                                                        gap: 2
                                                    }}
                                                >

                                                    <Box>

                                                        <Typography
                                                            sx={{
                                                                fontWeight: 600
                                                            }}
                                                        >
                                                            {
                                                                formatDate(
                                                                    record.attendance_date
                                                                )
                                                            }
                                                        </Typography>


                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >

                                                            Check-in:{" "}

                                                            {
                                                                formatTime(
                                                                    record.check_in
                                                                )
                                                            }

                                                            {" | "}

                                                            Check-out:{" "}

                                                            {
                                                                formatTime(
                                                                    record.check_out
                                                                )
                                                            }

                                                        </Typography>

                                                    </Box>


                                                    <Box
                                                        sx={{
                                                            textAlign: {
                                                                xs: "left",
                                                                sm: "right"
                                                            }
                                                        }}
                                                    >

                                                        <Chip
                                                            label={
                                                                record.status
                                                            }
                                                            size="small"
                                                        />


                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                marginTop: 0.5
                                                            }}
                                                        >

                                                            Hours:{" "}

                                                            {
                                                                record.working_hours
                                                                    || "-"
                                                            }

                                                        </Typography>

                                                    </Box>

                                                </Box>

                                            </Box>

                                        )
                                    )

                                )}

                            </CardContent>

                        </Card>

                    </>

                )}

            </Box>

        </AppLayout>

    );

}


export default EmployeeAttendance;