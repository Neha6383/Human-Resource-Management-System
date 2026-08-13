
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert
} from "@mui/material";

import {
    Visibility
} from "@mui/icons-material";

import AppLayout from "../components/Layout/AppLayout";


function EmployeeManagement() {

    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");


    // ==========================================
    // FETCH EMPLOYEES
    // ==========================================

    const fetchEmployees = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:5000/api/employees",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            if (!response.ok) {
                throw new Error(
                    "Failed to fetch employees"
                );
            }


            const data = await response.json();

            setEmployees(data);


        } catch (error) {

            console.error(
                "Employee fetch error:",
                error
            );

            setError(
                "Unable to load employees."
            );


        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // FETCH ON PAGE LOAD
    // ==========================================

    useEffect(() => {

        fetchEmployees();

    }, []);


    return (

        <AppLayout>

            {/* ==================================
                PAGE HEADER
            ================================== */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 3
                }}
            >

                <Box>

                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700
                        }}
                    >
                        Employees
                    </Typography>


                    <Typography
                        color="text.secondary"
                    >
                        Manage organization employees
                    </Typography>

                </Box>


                <Button
                    variant="contained"
                    onClick={() =>
                        navigate("/employees/add")
                    }
                >
                    Add Employee
                </Button>

            </Box>


            {/* ==================================
                EMPLOYEE TABLE
            ================================== */}

            <Card>

                <CardContent>

                    {/* Loading */}

                    {loading && (

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                padding: 4
                            }}
                        >

                            <CircularProgress />

                        </Box>

                    )}


                    {/* Error */}

                    {error && (

                        <Alert
                            severity="error"
                        >
                            {error}
                        </Alert>

                    )}


                    {/* Table */}

                    {!loading && !error && (

                        <TableContainer
                            component={Paper}
                            sx={{
                                overflowX: "auto"
                            }}
                        >

                            <Table
                                sx={{
                                    minWidth: 1200
                                }}
                            >

                                {/* ==================================
                                    TABLE HEADER
                                ================================== */}

                                <TableHead>

                                    <TableRow>

                                        <TableCell
                                            sx={{
                                                fontWeight: 700
                                            }}
                                        >
                                            Employee ID
                                        </TableCell>


                                        <TableCell
                                            sx={{
                                                fontWeight: 700
                                            }}
                                        >
                                            Name
                                        </TableCell>


                                        <TableCell
                                            sx={{
                                                fontWeight: 700
                                            }}
                                        >
                                            Email
                                        </TableCell>


                                        <TableCell
                                            sx={{
                                                fontWeight: 700
                                            }}
                                        >
                                            Phone
                                        </TableCell>


                                        <TableCell
                                            sx={{
                                                fontWeight: 700
                                            }}
                                        >
                                            Department
                                        </TableCell>


                                        <TableCell
                                            sx={{
                                                fontWeight: 700
                                            }}
                                        >
                                            Designation
                                        </TableCell>


                                        <TableCell
                                            sx={{
                                                fontWeight: 700
                                            }}
                                        >
                                            Status
                                        </TableCell>


                                        <TableCell
                                            sx={{
                                                fontWeight: 700
                                            }}
                                        >
                                            Actions
                                        </TableCell>

                                    </TableRow>

                                </TableHead>


                                {/* ==================================
                                    TABLE BODY
                                ================================== */}

                                <TableBody>

                                    {employees.map(
                                        (employee) => (

                                            <TableRow
                                                key={employee.id}
                                                hover
                                            >

                                                {/* Employee ID */}

                                                <TableCell>
                                                    {
                                                        employee.employee_id
                                                    }
                                                </TableCell>


                                                {/* Name */}

                                                <TableCell>
                                                    {
                                                        employee.full_name
                                                    }
                                                </TableCell>


                                                {/* Email */}

                                                <TableCell>
                                                    {
                                                        employee.email
                                                            || "-"
                                                    }
                                                </TableCell>


                                                {/* Phone */}

                                                <TableCell>
                                                    {
                                                        employee.phone
                                                            || "-"
                                                    }
                                                </TableCell>


                                                {/* Department */}

                                                <TableCell>
                                                    {
                                                        employee.department
                                                            || "-"
                                                    }
                                                </TableCell>


                                                {/* Designation */}

                                                <TableCell>
                                                    {
                                                        employee.designation
                                                            || "-"
                                                    }
                                                </TableCell>


                                                {/* Status */}

                                                <TableCell>
                                                    {
                                                        employee.employment_status
                                                    }
                                                </TableCell>


                                                {/* Actions */}

                                                <TableCell>

                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={
                                                            <Visibility />
                                                        }
                                                        onClick={() =>
                                                            navigate(
                                                                `/employees/${employee.id}`
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </Button>

                                                </TableCell>

                                            </TableRow>

                                        )
                                    )}


                                    {/* No employees */}

                                    {employees.length === 0 && (

                                        <TableRow>

                                            <TableCell
                                                colSpan={8}
                                                align="center"
                                            >

                                                <Typography
                                                    color="text.secondary"
                                                    sx={{
                                                        padding: 3
                                                    }}
                                                >
                                                    No employees found.
                                                </Typography>

                                            </TableCell>

                                        </TableRow>

                                    )}

                                </TableBody>

                            </Table>

                        </TableContainer>

                    )}

                </CardContent>

            </Card>

        </AppLayout>

    );

}


export default EmployeeManagement;

