import { useEffect, useState } from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress,
    Alert
} from "@mui/material";

import {
    People,
    Business,
    EventAvailable,
    EventNote
} from "@mui/icons-material";

import AppLayout from "../components/Layout/AppLayout";


function AdminDashboard() {

    // ==================================================
    // USER
    // ==================================================

    const user = JSON.parse(
        localStorage.getItem("user")
    );


    // ==================================================
    // STATE
    // ==================================================

    const [stats, setStats] = useState({

        totalEmployees: 0,

        totalDepartments: 0,

        todayAttendance: 0,

        pendingLeaves: 0

    });


    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ==================================================
    // FETCH DASHBOARD STATISTICS
    // ==================================================

    const fetchDashboardStats = async () => {

        try {

            setLoading(true);

            setError("");


            const token =
                localStorage.getItem("token");


            if (!token) {

                throw new Error(
                    "Access token is required"
                );

            }


            const response = await fetch(
                "http://localhost:5000/api/dashboard/stats",
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
                    "Failed to fetch dashboard statistics"
                );

            }


            // ==========================================
            // STORE API RESPONSE
            // ==========================================

            setStats(data);


        } catch (error) {

            console.error(
                "Dashboard stats error:",
                error
            );


            setError(
                error.message ||
                "Unable to load dashboard statistics"
            );


        } finally {

            setLoading(false);

        }

    };


    // ==================================================
    // FETCH DATA WHEN DASHBOARD LOADS
    // ==================================================

    useEffect(() => {

        fetchDashboardStats();

    }, []);


    // ==================================================
    // DASHBOARD CARDS
    // ==================================================

    const statCards = [

        {
            title: "Total Employees",

            value:
                stats.totalEmployees,

            icon:
                <People fontSize="large" />
        },


        {
            title: "Departments",

            value:
                stats.totalDepartments,

            icon:
                <Business fontSize="large" />
        },


        {
            title: "Today's Attendance",

            value:
                stats.todayAttendance,

            icon:
                <EventAvailable fontSize="large" />
        },


        {
            title: "Pending Leaves",

            value:
                stats.pendingLeaves,

            icon:
                <EventNote fontSize="large" />
        }

    ];


    // ==================================================
    // UI
    // ==================================================

    return (

        <AppLayout>

            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <Box
                sx={{
                    marginBottom: 4
                }}
            >

                <Typography
                    variant="h4"
                    gutterBottom
                >
                    Dashboard
                </Typography>


                <Typography
                    color="text.secondary"
                >
                    Welcome back, {user?.email}
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
                LOADING
            ================================================== */}

            {loading ? (

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        padding: 5
                    }}
                >

                    <CircularProgress />

                </Box>

            ) : (

                /* ==================================================
                   STATISTICS
                ================================================== */

                <Grid
                    container
                    spacing={3}
                >

                    {statCards.map(
                        (stat) => (

                            <Grid
                                key={stat.title}
                                size={{
                                    xs: 12,
                                    sm: 6,
                                    md: 3
                                }}
                            >

                                <Card>

                                    <CardContent>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems:
                                                    "center"
                                            }}
                                        >

                                            {/* CARD INFORMATION */}

                                            <Box>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {
                                                        stat.title
                                                    }
                                                </Typography>


                                                <Typography
                                                    variant="h4"
                                                    sx={{
                                                        marginTop: 1,
                                                        fontWeight: 700
                                                    }}
                                                >
                                                    {
                                                        stat.value
                                                    }
                                                </Typography>

                                            </Box>


                                            {/* CARD ICON */}

                                            {stat.icon}

                                        </Box>

                                    </CardContent>

                                </Card>

                            </Grid>

                        )
                    )}

                </Grid>

            )}


            {/* ==================================================
                RECENT ACTIVITY
            ================================================== */}

            <Card
                sx={{
                    marginTop: 4
                }}
            >

                <CardContent>

                    <Typography
                        variant="h6"
                        gutterBottom
                    >
                        Recent Activity
                    </Typography>


                    <Typography
                        color="text.secondary"
                    >
                        No recent activities available.
                    </Typography>

                </CardContent>

            </Card>

        </AppLayout>

    );

}


export default AdminDashboard;