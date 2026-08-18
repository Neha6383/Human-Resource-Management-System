import { useEffect, useState } from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    Divider,
    Grid
} from "@mui/material";

import {
    Person,
    Phone,
    Business,
    Work,
    CalendarMonth,
    Badge
} from "@mui/icons-material";

import AppLayout from "../components/Layout/AppLayout";


function EmployeeProfile() {

    // ======================================================
    // STATE
    // ======================================================

    const [employee, setEmployee] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ======================================================
    // TOKEN
    // ======================================================

    const token =
        localStorage.getItem("token");


    // ======================================================
    // FETCH EMPLOYEE PROFILE
    // ======================================================

    const fetchProfile = async () => {

        try {

            setLoading(true);

            setError("");


            if (!token) {

                throw new Error(
                    "Access token is required"
                );

            }


            const response = await fetch(
                "http://localhost:5000/api/employees/my-profile",
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
                    "Failed to fetch employee profile"
                );

            }


            setEmployee(
                data.employee || data
            );


        } catch (error) {

            console.error(
                "Employee profile error:",
                error
            );


            setError(
                error.message ||
                "Unable to load employee profile."
            );


        } finally {

            setLoading(false);

        }

    };


    // ======================================================
    // LOAD PROFILE
    // ======================================================

    useEffect(() => {

        fetchProfile();

    }, []);


    // ======================================================
    // FORMAT DATE
    // ======================================================

    const formatDate = (date) => {

        if (!date) {

            return "Not available";

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
                        My Profile
                    </Typography>


                    <Typography
                        color="text.secondary"
                        sx={{
                            marginTop: 0.5
                        }}
                    >
                        View your employee information
                    </Typography>

                </Box>


                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (

                    <Alert
                        severity="error"
                        sx={{
                            marginBottom: 3,
                            borderRadius: "8px"
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
                            padding: 6
                        }}
                    >

                        <CircularProgress />

                    </Box>

                ) : employee ? (

                    <Card
                        sx={{
                            borderRadius: "12px",
                            boxShadow:
                                "0 2px 12px rgba(0,0,0,0.08)"
                        }}
                    >

                        <CardContent
                            sx={{
                                padding: {
                                    xs: 2,
                                    sm: 3,
                                    md: 4
                                }
                            }}
                        >

                            {/* ==================================================
                                PROFILE HEADER
                            ================================================== */}

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    marginBottom: 3
                                }}
                            >

                                <Box
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: "50%",
                                        backgroundColor:
                                            "#e3f2fd",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >

                                    <Person
                                        sx={{
                                            fontSize: 36,
                                            color: "#1976d2"
                                        }}
                                    />

                                </Box>


                                <Box>

                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 700
                                        }}
                                    >
                                        {employee.full_name}
                                    </Typography>


                                    <Typography
                                        color="text.secondary"
                                    >
                                        {employee.employee_id}
                                    </Typography>

                                </Box>

                            </Box>


                            <Divider
                                sx={{
                                    marginBottom: 3
                                }}
                            />


                            {/* ==================================================
                                PERSONAL INFORMATION
                            ================================================== */}

                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    marginBottom: 2
                                }}
                            >
                                Personal Information
                            </Typography>


                            <Grid
                                container
                                spacing={3}
                            >

                                {/* FULL NAME */}

                                <Grid
                                    size={{
                                        xs: 12,
                                        sm: 6
                                    }}
                                >

                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1.5,
                                            alignItems: "flex-start"
                                        }}
                                    >

                                        <Person
                                            color="action"
                                        />

                                        <Box>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Full Name
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontWeight: 600
                                                }}
                                            >
                                                {
                                                    employee.full_name
                                                    || "Not available"
                                                }
                                            </Typography>

                                        </Box>

                                    </Box>

                                </Grid>


                                {/* PHONE */}

                                <Grid
                                    size={{
                                        xs: 12,
                                        sm: 6
                                    }}
                                >

                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1.5,
                                            alignItems: "flex-start"
                                        }}
                                    >

                                        <Phone
                                            color="action"
                                        />

                                        <Box>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Phone
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontWeight: 600
                                                }}
                                            >
                                                {
                                                    employee.phone
                                                    || "Not available"
                                                }
                                            </Typography>

                                        </Box>

                                    </Box>

                                </Grid>


                                {/* GENDER */}

                                <Grid
                                    size={{
                                        xs: 12,
                                        sm: 6
                                    }}
                                >

                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1.5,
                                            alignItems: "flex-start"
                                        }}
                                    >

                                        <Person
                                            color="action"
                                        />

                                        <Box>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Gender
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontWeight: 600
                                                }}
                                            >
                                                {
                                                    employee.gender
                                                    || "Not available"
                                                }
                                            </Typography>

                                        </Box>

                                    </Box>

                                </Grid>


                                {/* DATE OF BIRTH */}

                                <Grid
                                    size={{
                                        xs: 12,
                                        sm: 6
                                    }}
                                >

                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1.5,
                                            alignItems: "flex-start"
                                        }}
                                    >

                                        <CalendarMonth
                                            color="action"
                                        />

                                        <Box>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Date of Birth
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontWeight: 600
                                                }}
                                            >
                                                {
                                                    formatDate(
                                                        employee.date_of_birth
                                                    )
                                                }
                                            </Typography>

                                        </Box>

                                    </Box>

                                </Grid>

                            </Grid>


                            <Divider
                                sx={{
                                    marginTop: 4,
                                    marginBottom: 3
                                }}
                            />


                            {/* ==================================================
                                EMPLOYMENT INFORMATION
                            ================================================== */}

                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    marginBottom: 2
                                }}
                            >
                                Employment Information
                            </Typography>


                            <Grid
                                container
                                spacing={3}
                            >

                                {/* EMPLOYEE ID */}

                                <Grid
                                    size={{
                                        xs: 12,
                                        sm: 6
                                    }}
                                >

                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1.5,
                                            alignItems: "flex-start"
                                        }}
                                    >

                                        <Badge
                                            color="action"
                                        />

                                        <Box>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Employee ID
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontWeight: 600
                                                }}
                                            >
                                                {
                                                    employee.employee_id
                                                    || "Not available"
                                                }
                                            </Typography>

                                        </Box>

                                    </Box>

                                </Grid>


                                {/* DEPARTMENT */}

                                <Grid
                                    size={{
                                        xs: 12,
                                        sm: 6
                                    }}
                                >

                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1.5,
                                            alignItems: "flex-start"
                                        }}
                                    >

                                        <Business
                                            color="action"
                                        />

                                        <Box>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Department
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontWeight: 600
                                                }}
                                            >
                                                {
                                                    employee.department_name
                                                    || "Not available"
                                                }
                                            </Typography>

                                        </Box>

                                    </Box>

                                </Grid>


                                {/* DESIGNATION */}

                                <Grid
                                    size={{
                                        xs: 12,
                                        sm: 6
                                    }}
                                >

                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1.5,
                                            alignItems: "flex-start"
                                        }}
                                    >

                                        <Work
                                            color="action"
                                        />

                                        <Box>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Designation
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontWeight: 600
                                                }}
                                            >
                                                {
                                                    employee.designation
                                                    || "Not available"
                                                }
                                            </Typography>

                                        </Box>

                                    </Box>

                                </Grid>


                                {/* JOINING DATE */}

                                <Grid
                                    size={{
                                        xs: 12,
                                        sm: 6
                                    }}
                                >

                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1.5,
                                            alignItems: "flex-start"
                                        }}
                                    >

                                        <CalendarMonth
                                            color="action"
                                        />

                                        <Box>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Joining Date
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontWeight: 600
                                                }}
                                            >
                                                {
                                                    formatDate(
                                                        employee.joining_date
                                                    )
                                                }
                                            </Typography>

                                        </Box>

                                    </Box>

                                </Grid>


                                {/* EMPLOYMENT STATUS */}

                                <Grid
                                    size={{
                                        xs: 12,
                                        sm: 6
                                    }}
                                >

                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1.5,
                                            alignItems: "flex-start"
                                        }}
                                    >

                                        <Work
                                            color="action"
                                        />

                                        <Box>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Employment Status
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontWeight: 600
                                                }}
                                            >
                                                {
                                                    employee.employment_status
                                                    || "Not available"
                                                }
                                            </Typography>

                                        </Box>

                                    </Box>

                                </Grid>

                            </Grid>

                        </CardContent>

                    </Card>

                ) : (

                    <Card>

                        <CardContent>

                            <Typography
                                color="text.secondary"
                            >
                                Employee profile not found.
                            </Typography>

                        </CardContent>

                    </Card>

                )}

            </Box>

        </AppLayout>

    );

}


export default EmployeeProfile;