import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

import {
    LocalizationProvider
} from "@mui/x-date-pickers/LocalizationProvider";

import {
    DatePicker
} from "@mui/x-date-pickers/DatePicker";

import {
    AdapterDayjs
} from "@mui/x-date-pickers/AdapterDayjs";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    MenuItem,
    TextField,
    Typography,
    CircularProgress
} from "@mui/material";

import AppLayout from "../components/Layout/AppLayout";


function EditEmployee() {

    const { id } = useParams();

    const navigate = useNavigate();

    const token = localStorage.getItem("token");


    const [departments, setDepartments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");


    const [formData, setFormData] = useState({

        employee_id: "",
        full_name: "",
        email: "",
        phone: "",
        gender: "",
        date_of_birth: "",
        department_id: "",
        designation: "",
        joining_date: "",
        employment_status: "Active"

    });


    // ==========================================
    // FETCH EMPLOYEE
    // ==========================================

    useEffect(() => {

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


                const data = await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to fetch employee"
                    );

                }


                setFormData({

                    employee_id:
                        data.employee_id || "",

                    full_name:
                        data.full_name || "",

                    email:
                        data.email || "",

                    phone:
                        data.phone || "",

                    gender:
                        data.gender || "",

                    date_of_birth:
                        data.date_of_birth
                            ? data.date_of_birth.substring(0, 10)
                            : "",

                    department_id:
                        data.department_id || "",

                    designation:
                        data.designation || "",

                    joining_date:
                        data.joining_date
                            ? data.joining_date.substring(0, 10)
                            : "",

                    employment_status:
                        data.employment_status || "Active"

                });


            } catch (error) {

                console.error(
                    "Employee fetch error:",
                    error
                );

                setError(
                    error.message ||
                    "Unable to load employee."
                );


            } finally {

                setLoading(false);

            }

        };


        fetchEmployee();

    }, [id, token]);


    // ==========================================
    // FETCH DEPARTMENTS
    // ==========================================

    useEffect(() => {

        const fetchDepartments = async () => {

            try {

                const response = await fetch(
                    "http://localhost:5000/api/departments",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );


                const data = await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to fetch departments"
                    );

                }


                setDepartments(data);


            } catch (error) {

                console.error(
                    "Department fetch error:",
                    error
                );

                setError(
                    "Unable to load departments."
                );

            }

        };


        fetchDepartments();

    }, [token]);


    // ==========================================
    // HANDLE INPUT CHANGE
    // ==========================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData((previousData) => ({

            ...previousData,

            [name]: value

        }));

    };


    // ==========================================
    // HANDLE SUBMIT
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        setSaving(true);


        try {

            const response = await fetch(
                `http://localhost:5000/api/employees/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify(formData)
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update employee"
                );

            }


            navigate(`/employees/${id}`);


        } catch (error) {

            console.error(
                "Update employee error:",
                error
            );

            setError(
                error.message ||
                "Failed to update employee."
            );


        } finally {

            setSaving(false);

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
    // UI
    // ==========================================

    return (

        <LocalizationProvider
            dateAdapter={AdapterDayjs}
        >

            <AppLayout>

                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "1200px",
                        margin: "0 auto",
                        paddingBottom: 4
                    }}
                >

                    {/* PAGE HEADER */}

                    <Box
                        sx={{
                            marginBottom: 3
                        }}
                    >

                        <Button
                            onClick={() =>
                                navigate(`/employees/${id}`)
                            }
                            sx={{
                                marginBottom: 1
                            }}
                        >
                            ← Back to Employee
                        </Button>


                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700
                            }}
                        >
                            Edit Employee
                        </Typography>


                        <Typography
                            color="text.secondary"
                            sx={{
                                marginTop: 0.5
                            }}
                        >
                            Update employee information.
                        </Typography>

                    </Box>


                    {/* FORM CARD */}

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


                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    marginBottom: 0.5
                                }}
                            >
                                Employee Information
                            </Typography>


                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    marginBottom: 3
                                }}
                            >
                                Update the employee's details below.
                            </Typography>


                            <Divider
                                sx={{
                                    marginBottom: 3
                                }}
                            />


                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                            >

                                <Box
                                    sx={{
                                        display: "grid",

                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            md: "1fr 1fr"
                                        },

                                        columnGap: 3,

                                        rowGap: 2.5
                                    }}
                                >

                                    {/* EMPLOYEE ID */}

                                    <TextField
                                        fullWidth
                                        label="Employee ID"
                                        name="employee_id"
                                        value={formData.employee_id}
                                        onChange={handleChange}
                                        required
                                    />


                                    {/* FULL NAME */}

                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        required
                                    />


                                    {/* EMAIL */}

                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />


                                    {/* PHONE */}

                                    <TextField
                                        fullWidth
                                        label="Phone Number"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />


                                    {/* GENDER */}

                                    <TextField
                                        fullWidth
                                        select
                                        label="Gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                    >

                                        <MenuItem value="">
                                            Select Gender
                                        </MenuItem>

                                        <MenuItem value="Male">
                                            Male
                                        </MenuItem>

                                        <MenuItem value="Female">
                                            Female
                                        </MenuItem>

                                        <MenuItem value="Other">
                                            Other
                                        </MenuItem>

                                    </TextField>


                                    {/* DATE OF BIRTH */}

                                    <DatePicker
                                        label="Date of Birth"
                                        value={
                                            formData.date_of_birth
                                                ? dayjs(
                                                    formData.date_of_birth
                                                )
                                                : null
                                        }
                                        onChange={(newValue) => {

                                            setFormData(
                                                (previousData) => ({

                                                    ...previousData,

                                                    date_of_birth:
                                                        newValue
                                                            ? newValue.format(
                                                                "YYYY-MM-DD"
                                                            )
                                                            : ""

                                                })
                                            );

                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true
                                            }
                                        }}
                                    />


                                    {/* DEPARTMENT */}

                                    <TextField
                                        fullWidth
                                        select
                                        label="Department"
                                        name="department_id"
                                        value={formData.department_id}
                                        onChange={handleChange}
                                        required
                                    >

                                        <MenuItem value="">
                                            Select Department
                                        </MenuItem>

                                        {departments.map(
                                            (department) => (

                                                <MenuItem
                                                    key={department.id}
                                                    value={department.id}
                                                >
                                                    {department.name}
                                                </MenuItem>

                                            )
                                        )}

                                    </TextField>


                                    {/* DESIGNATION */}

                                    <TextField
                                        fullWidth
                                        label="Designation"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                    />


                                    {/* JOINING DATE */}

                                    <DatePicker
                                        label="Joining Date"
                                        value={
                                            formData.joining_date
                                                ? dayjs(
                                                    formData.joining_date
                                                )
                                                : null
                                        }
                                        onChange={(newValue) => {

                                            setFormData(
                                                (previousData) => ({

                                                    ...previousData,

                                                    joining_date:
                                                        newValue
                                                            ? newValue.format(
                                                                "YYYY-MM-DD"
                                                            )
                                                            : ""

                                                })
                                            );

                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                required: true
                                            }
                                        }}
                                    />


                                    {/* EMPLOYMENT STATUS */}

                                    <TextField
                                        fullWidth
                                        select
                                        label="Employment Status"
                                        name="employment_status"
                                        value={
                                            formData.employment_status
                                        }
                                        onChange={handleChange}
                                        required
                                    >

                                        <MenuItem value="Active">
                                            Active
                                        </MenuItem>

                                        <MenuItem value="Inactive">
                                            Inactive
                                        </MenuItem>

                                        <MenuItem value="Resigned">
                                            Resigned
                                        </MenuItem>

                                    </TextField>

                                </Box>


                                <Divider
                                    sx={{
                                        marginTop: 4,
                                        marginBottom: 3
                                    }}
                                />


                                {/* BUTTONS */}

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        gap: 2,

                                        flexDirection: {
                                            xs: "column-reverse",
                                            sm: "row"
                                        }
                                    }}
                                >

                                    <Button
                                        variant="outlined"
                                        onClick={() =>
                                            navigate(
                                                `/employees/${id}`
                                            )
                                        }
                                        disabled={saving}
                                        sx={{
                                            minWidth: 120,
                                            height: 44,
                                            borderRadius: "6px"
                                        }}
                                    >
                                        Cancel
                                    </Button>


                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={saving}
                                        sx={{
                                            minWidth: 150,
                                            height: 44,
                                            borderRadius: "6px",
                                            fontWeight: 600
                                        }}
                                    >

                                        {saving
                                            ? "Updating..."
                                            : "Update Employee"}

                                    </Button>

                                </Box>

                            </Box>

                        </CardContent>

                    </Card>

                </Box>

            </AppLayout>

        </LocalizationProvider>

    );

}


export default EditEmployee;