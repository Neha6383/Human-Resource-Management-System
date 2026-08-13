
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import dayjs from "dayjs";

import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Grid,
    CircularProgress,
    Alert,
    Divider,
    Chip
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Person,
    Email,
    Phone,
    Business,
    Work,
    CalendarMonth
} from "@mui/icons-material";

import AppLayout from "../components/Layout/AppLayout";


function EmployeeDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [employee, setEmployee] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const token = localStorage.getItem("token");


    // ==========================================
    // FETCH EMPLOYEE
    // ==========================================

    const fetchEmployee = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await fetch(
                `http://localhost:5000/api/employees/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            if (!response.ok) {

                const data = await response.json();

                throw new Error(
                    data.message ||
                    "Failed to fetch employee"
                );

            }


            const data = await response.json();

            setEmployee(data);


        } catch (error) {

            console.error(
                "Employee details error:",
                error
            );

            setError(
                error.message ||
                "Unable to load employee details."
            );


        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchEmployee();

    }, [id]);


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

    if (!date) {
        return "-";
    }

    return dayjs(date).format("DD MMM YYYY");
};


    // ==========================================
    // STATUS COLOR
    // ==========================================

    const getStatusColor = (status) => {

        switch (status) {

            case "Active":
                return "success";

            case "Inactive":
                return "warning";

            case "Resigned":
                return "error";

            default:
                return "default";

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <AppLayout>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "50vh"
                    }}
                >

                    <CircularProgress />

                </Box>

            </AppLayout>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error || !employee) {

        return (

            <AppLayout>

                <Alert
                    severity="error"
                    sx={{
                        mb: 2
                    }}
                >
                    {error || "Employee not found."}
                </Alert>

                <Button
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/employees")
                    }
                >
                    Back to Employees
                </Button>

            </AppLayout>

        );

    }


    // ==========================================
    // MAIN UI
    // ==========================================

    return (

        <AppLayout>

            {/* ==================================
                PAGE HEADER
            ================================== */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        sm: "center"
                    },
                    flexDirection: {
                        xs: "column",
                        sm: "row"
                    },
                    gap: 2,
                    mb: 3
                }}
            >

                <Box>

                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate("/employees")
                        }
                        sx={{
                            mb: 1
                        }}
                    >
                        Back to Employees
                    </Button>


                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700
                        }}
                    >
                        Employee Details
                    </Typography>


                    <Typography
                        color="text.secondary"
                    >
                        View employee information
                    </Typography>

                </Box>


                <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() =>
                        navigate(
                            `/employees/edit/${employee.id}`
                        )
                    }
                >
                    Edit Employee
                </Button>

            </Box>


            {/* ==================================
                EMPLOYEE SUMMARY
            ================================== */}

            <Card
                sx={{
                    mb: 3
                }}
            >

                <CardContent>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            flexWrap: "wrap"
                        }}
                    >

                        {/* Employee Avatar */}

                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor:
                                    "primary.main",
                                color: "white",
                                flexShrink: 0
                            }}
                        >

                            <Person fontSize="large" />

                        </Box>


                        {/* Employee Name */}

                        <Box>

                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 600
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


                        {/* Employee Status */}

                        <Box
                            sx={{
                                marginLeft: {
                                    xs: 0,
                                    sm: "auto"
                                }
                            }}
                        >

                            <Chip
                                label={
                                    employee.employment_status
                                }
                                color={
                                    getStatusColor(
                                        employee.employment_status
                                    )
                                }
                            />

                        </Box>

                    </Box>

                </CardContent>

            </Card>


            {/* ==================================
                BASIC INFORMATION
            ================================== */}

            <Card
                sx={{
                    mb: 3
                }}
            >

                <CardContent>

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            mb: 2
                        }}
                    >
                        Basic Information
                    </Typography>


                    <Divider
                        sx={{
                            mb: 3
                        }}
                    />


                    <Grid
                        container
                        spacing={3}
                    >

                        {/* Email */}

                        <Grid
                            size={{
                                xs: 12,
                                md: 6
                            }}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2
                                }}
                            >

                                <Email color="primary" />

                                <Box>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Email
                                    </Typography>

                                    <Typography>
                                        {employee.email || "-"}
                                    </Typography>

                                </Box>

                            </Box>

                        </Grid>


                        {/* Phone */}

                        <Grid
                            size={{
                                xs: 12,
                                md: 6
                            }}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2
                                }}
                            >

                                <Phone color="primary" />

                                <Box>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Phone
                                    </Typography>

                                    <Typography>
                                        {employee.phone || "-"}
                                    </Typography>

                                </Box>

                            </Box>

                        </Grid>


                        {/* Gender */}

                        <Grid
                            size={{
                                xs: 12,
                                md: 6
                            }}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2
                                }}
                            >

                                <Person color="primary" />

                                <Box>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Gender
                                    </Typography>

                                    <Typography>
                                        {employee.gender || "-"}
                                    </Typography>

                                </Box>

                            </Box>

                        </Grid>


                        {/* Date of Birth */}

                        <Grid
                            size={{
                                xs: 12,
                                md: 6
                            }}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2
                                }}
                            >

                                <CalendarMonth color="primary" />

                                <Box>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Date of Birth
                                    </Typography>

                                    <Typography>
                                        {formatDate(
                                            employee.date_of_birth
                                        )}
                                    </Typography>

                                </Box>

                            </Box>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>


            {/* ==================================
                JOB INFORMATION
            ================================== */}

            <Card>

                <CardContent>

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            mb: 2
                        }}
                    >
                        Job Information
                    </Typography>


                    <Divider
                        sx={{
                            mb: 3
                        }}
                    />


                    <Grid
                        container
                        spacing={3}
                    >

                        {/* Department */}

                        <Grid
                            size={{
                                xs: 12,
                                md: 6
                            }}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2
                                }}
                            >

                                <Business color="primary" />

                                <Box>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Department
                                    </Typography>

                                    <Typography>
                                        {
                                            employee.department ||
                                            "-"
                                        }
                                    </Typography>

                                </Box>

                            </Box>

                        </Grid>


                        {/* Designation */}

                        <Grid
                            size={{
                                xs: 12,
                                md: 6
                            }}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2
                                }}
                            >

                                <Work color="primary" />

                                <Box>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Designation
                                    </Typography>

                                    <Typography>
                                        {
                                            employee.designation ||
                                            "-"
                                        }
                                    </Typography>

                                </Box>

                            </Box>

                        </Grid>


                        {/* Joining Date */}

                        <Grid
                            size={{
                                xs: 12,
                                md: 6
                            }}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2
                                }}
                            >

                                <CalendarMonth color="primary" />

                                <Box>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Joining Date
                                    </Typography>

                                    <Typography>
                                        {formatDate(
                                            employee.joining_date
                                        )}
                                    </Typography>

                                </Box>

                            </Box>

                        </Grid>


                        {/* Employment Status */}

                        <Grid
                            size={{
                                xs: 12,
                                md: 6
                            }}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2
                                }}
                            >

                                <Work color="primary" />

                                <Box>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Employment Status
                                    </Typography>

                                    <Chip
                                        label={
                                            employee.employment_status
                                        }
                                        color={
                                            getStatusColor(
                                                employee.employment_status
                                            )
                                        }
                                        size="small"
                                        sx={{
                                            mt: 0.5
                                        }}
                                    />

                                </Box>

                            </Box>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>

        </AppLayout>

    );

}


export default EmployeeDetails;
