import { useEffect, useState } from "react";

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
    Typography
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import AppLayout from "../components/Layout/AppLayout";


function AddEmployee() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");


    const [departments, setDepartments] = useState([]);

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


    /* =========================================
       FETCH DEPARTMENTS
    ========================================= */

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


    /* =========================================
       HANDLE INPUT CHANGE
    ========================================= */

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


    /* =========================================
       SUBMIT FORM
    ========================================= */

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        try {

            const response = await fetch(
                "http://localhost:5000/api/employees",
                {
                    method: "POST",

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
                    "Failed to create employee"
                );

            }


            navigate("/employees");


        } catch (error) {

            console.error(
                "Create employee error:",
                error
            );


            setError(
                error.message
            );

        }

    };


    /* =========================================
       UI
    ========================================= */

    return (

        <LocalizationProvider dateAdapter={AdapterDayjs}>
    <AppLayout>

            <Box
                sx={{
                    width: "100%",
                    maxWidth: "1200px",
                    margin: "0 auto",
                    paddingBottom: 4
                }}
            >

                {/* =================================
                    PAGE HEADER
                ================================= */}

                <Box
                    sx={{
                        marginBottom: 3
                    }}
                >

                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,

                            fontSize: {
                                xs: "1.7rem",
                                md: "2rem"
                            }
                        }}
                    >
                        Add Employee
                    </Typography>


                    <Typography
                        sx={{
                            color: "text.secondary",
                            marginTop: 0.5
                        }}
                    >
                        Add a new employee to the HRMS system.
                    </Typography>

                </Box>


                {/* =================================
                    FORM CARD
                ================================= */}

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

                        {/* ERROR */}

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


                        {/* =================================
                            SECTION HEADER
                        ================================= */}

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                marginBottom: 0.5
                            }}
                        >
                            Personal Information
                        </Typography>


                        <Typography
                            variant="body2"
                            sx={{
                                color: "text.secondary",
                                marginBottom: 3
                            }}
                        >
                            Enter the employee's basic information.
                        </Typography>


                        <Divider
                            sx={{
                                marginBottom: 3
                            }}
                        />


                        {/* =================================
                            FORM
                        ================================= */}

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

                                {/* =================================
                                    EMPLOYEE ID
                                ================================= */}

                                <TextField
                                    fullWidth
                                    label="Employee ID"
                                    name="employee_id"
                                    value={
                                        formData.employee_id
                                    }
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                />


                                {/* =================================
                                    FULL NAME
                                ================================= */}

                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    name="full_name"
                                    value={
                                        formData.full_name
                                    }
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                />

                                {/* =================================
                                    EMAIL
                                ================================= */}


                                <TextField
    fullWidth
    label="Email"
    name="email"
    type="email"
    value={formData.email}
    onChange={handleChange}
    required
    variant="outlined"
/>


                                {/* =================================
                                    PHONE
                                ================================= */}

                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="phone"
                                    value={
                                        formData.phone
                                    }
                                    onChange={handleChange}
                                    variant="outlined"
                                />


                                {/* =================================
                                    GENDER
                                ================================= */}

                                <TextField
                                    fullWidth
                                    select
                                    label="Gender"
                                    name="gender"
                                    value={
                                        formData.gender
                                    }
                                    onChange={handleChange}
                                    variant="outlined"
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


                                {/* =================================
                                    DATE OF BIRTH
                                ================================= */}

                               <DatePicker
    label="Date of Birth"
    value={
        formData.date_of_birth
            ? dayjs(formData.date_of_birth)
            : null
    }
    onChange={(newValue) => {
        setFormData((previousData) => ({
            ...previousData,
            date_of_birth: newValue
                ? newValue.format("YYYY-MM-DD")
                : ""
        }));
    }}
    slotProps={{
        textField: {
            fullWidth: true,
            variant: "outlined"
        }
    }}
/>


                                {/* =================================
                                    DEPARTMENT
                                ================================= */}

                                <TextField
                                    fullWidth
                                    select
                                    label="Department"
                                    name="department_id"
                                    value={
                                        formData.department_id
                                    }
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
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


                                {/* =================================
                                    DESIGNATION
                                ================================= */}

                                <TextField
                                    fullWidth
                                    label="Designation"
                                    name="designation"
                                    value={
                                        formData.designation
                                    }
                                    onChange={handleChange}
                                    variant="outlined"
                                />


                                {/* =================================
                                    JOINING DATE
                                ================================= */}

                                <DatePicker
    label="Joining Date"
    value={
        formData.joining_date
            ? dayjs(formData.joining_date)
            : null
    }
    onChange={(newValue) => {
        setFormData((previousData) => ({
            ...previousData,
            joining_date: newValue
                ? newValue.format("YYYY-MM-DD")
                : ""
        }));
    }}
    slotProps={{
        textField: {
            fullWidth: true,
            variant: "outlined",
            required: true
        }
    }}
/>


                                {/* =================================
                                    EMPLOYMENT STATUS
                                ================================= */}

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
                                    variant="outlined"
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


                            {/* =================================
                                BUTTON SECTION
                            ================================= */}

                            <Divider
                                sx={{
                                    marginTop: 4,
                                    marginBottom: 3
                                }}
                            />


                            <Box
                                sx={{
                                    display: "flex",

                                    justifyContent:
                                        "flex-end",

                                    alignItems: "center",

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
                                        navigate("/employees")
                                    }
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
                                    sx={{
                                        minWidth: 150,
                                        height: 44,
                                        borderRadius: "6px",
                                        fontWeight: 600
                                    }}
                                >
                                    Save Employee
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


export default AddEmployee;