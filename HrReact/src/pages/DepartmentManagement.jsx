import { useEffect, useState } from "react";

import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    TextField,
    Divider
} from "@mui/material";

import AppLayout from "../components/Layout/AppLayout";


function DepartmentManagement() {

    // ==========================================
    // STATE
    // ==========================================

    const [departments, setDepartments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [name, setName] = useState("");

    const [description, setDescription] = useState("");

    const [saving, setSaving] = useState(false);

    const [success, setSuccess] = useState("");

    // Stores the ID of the department currently being edited
    const [editingId, setEditingId] = useState(null);


    const token = localStorage.getItem("token");


    // ==========================================
    // FETCH DEPARTMENTS
    // ==========================================

    const fetchDepartments = async () => {

        try {

            setLoading(true);

            setError("");


            if (!token) {

                throw new Error(
                    "Access token is required"
                );

            }


            const response = await fetch(
                "http://localhost:5000/api/departments",
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
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


            setDepartments(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (error) {

            console.error(
                "Department fetch error:",
                error
            );


            setError(
                error.message ||
                "Unable to load departments."
            );


        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // FETCH ON PAGE LOAD
    // ==========================================

    useEffect(() => {

        fetchDepartments();

    }, [token]);


    // ==========================================
    // HANDLE ADD DEPARTMENT
    // ==========================================

    const handleAddDepartment = async (event) => {

        event.preventDefault();

        setError("");

        setSuccess("");


        // ==========================================
        // VALIDATION
        // ==========================================

        if (!name.trim()) {

            setError(
                "Department name is required"
            );

            return;

        }


        if (!token) {

            setError(
                "Access token is required"
            );

            return;

        }


        try {

            setSaving(true);


            // ==========================================
            // POST REQUEST
            // ==========================================

            const response = await fetch(
                "http://localhost:5000/api/departments",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        name:
                            name.trim(),

                        description:
                            description.trim()
                                ? description.trim()
                                : null

                    })
                }
            );


            const data = await response.json();


            // ==========================================
            // HANDLE API ERROR
            // ==========================================

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to create department"
                );

            }


            // ==========================================
            // GET CREATED DEPARTMENT
            // ==========================================

            const newDepartment =
                data.department || data;


            // ==========================================
            // UPDATE UI
            // ==========================================

            if (
                newDepartment &&
                newDepartment.id
            ) {

                setDepartments(
                    (previousDepartments) => [

                        ...previousDepartments,

                        newDepartment

                    ]
                );

            } else {

                await fetchDepartments();

            }


            // ==========================================
            // CLEAR FORM
            // ==========================================

            setName("");

            setDescription("");


            // ==========================================
            // SUCCESS MESSAGE
            // ==========================================

            setSuccess(
                data.message ||
                "Department created successfully"
            );


        } catch (error) {

            console.error(
                "Create department error:",
                error
            );


            setError(
                error.message ||
                "Failed to create department"
            );


        } finally {

            setSaving(false);

        }

    };


    // ==========================================
    // START EDITING DEPARTMENT
    // ==========================================

    const handleEditDepartment = (department) => {

        setEditingId(department.id);

        setName(department.name || "");

        setDescription(
            department.description || ""
        );

        setError("");

        setSuccess("");

        // Scroll to the form
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // ==========================================
    // CANCEL EDIT
    // ==========================================

    const handleCancelEdit = () => {

        setEditingId(null);

        setName("");

        setDescription("");

        setError("");

        setSuccess("");

    };


    // ==========================================
    // UPDATE DEPARTMENT
    // ==========================================

    const handleUpdateDepartment = async (event) => {

        event.preventDefault();

        setError("");

        setSuccess("");


        // ==========================================
        // VALIDATION
        // ==========================================

        if (!name.trim()) {

            setError(
                "Department name is required"
            );

            return;

        }


        if (!editingId) {

            setError(
                "Department ID is required"
            );

            return;

        }


        if (!token) {

            setError(
                "Access token is required"
            );

            return;

        }


        try {

            setSaving(true);


            // ==========================================
            // PUT REQUEST
            // ==========================================

            const response = await fetch(
                `http://localhost:5000/api/departments/${editingId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        name:
                            name.trim(),

                        description:
                            description.trim()
                                ? description.trim()
                                : null

                    })
                }
            );


            const data = await response.json();


            // ==========================================
            // HANDLE API ERROR
            // ==========================================

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update department"
                );

            }


            // ==========================================
            // UPDATED DEPARTMENT
            // ==========================================

            const updatedDepartment =
                data.department;


            // ==========================================
            // UPDATE REACT STATE
            // ==========================================

            if (updatedDepartment) {

                setDepartments(
                    (previousDepartments) =>

                        previousDepartments.map(
                            (department) =>

                                department.id === editingId
                                    ? updatedDepartment
                                    : department
                        )
                );

            } else {

                // Fallback:
                // Fetch latest data from database

                await fetchDepartments();

            }


            // ==========================================
            // CLEAR EDIT MODE
            // ==========================================

            setEditingId(null);

            setName("");

            setDescription("");


            // ==========================================
            // SUCCESS MESSAGE
            // ==========================================

            setSuccess(
                data.message ||
                "Department updated successfully"
            );


        } catch (error) {

            console.error(
                "Update department error:",
                error
            );


            setError(
                error.message ||
                "Failed to update department"
            );


        } finally {

            setSaving(false);

        }

    };

    // ==========================================
// DELETE DEPARTMENT
// ==========================================

const handleDeleteDepartment = async (department) => {

    // ==========================================
    // CONFIRM DELETE
    // ==========================================

    const confirmed = window.confirm(
        `Are you sure you want to delete "${department.name}"?`
    );

    if (!confirmed) {
        return;
    }


    setError("");

    setSuccess("");


    // ==========================================
    // CHECK TOKEN
    // ==========================================

    if (!token) {

        setError(
            "Access token is required"
        );

        return;

    }


    try {

        setSaving(true);


        // ==========================================
        // DELETE REQUEST
        // ==========================================

        const response = await fetch(
            `http://localhost:5000/api/departments/${department.id}`,
            {
                method: "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


        const data = await response.json();


        // ==========================================
        // HANDLE API ERROR
        // ==========================================

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to delete department"
            );

        }


        // ==========================================
        // REMOVE FROM UI
        // ==========================================

        setDepartments(
            (previousDepartments) =>
                previousDepartments.filter(
                    (item) =>
                        item.id !== department.id
                )
        );


        // ==========================================
        // SUCCESS MESSAGE
        // ==========================================

        setSuccess(
            data.message ||
            "Department deleted successfully"
        );


    } catch (error) {

        console.error(
            "Delete department error:",
            error
        );


        setError(
            error.message ||
            "Failed to delete department"
        );


    } finally {

        setSaving(false);

    }

};


    // ==========================================
    // UI
    // ==========================================

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

                {/* ==================================
                    PAGE HEADER
                ================================== */}

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
                        Departments
                    </Typography>


                    <Typography
                        color="text.secondary"
                        sx={{
                            marginTop: 0.5
                        }}
                    >
                        Manage organization departments
                    </Typography>

                </Box>


                {/* ==================================
                    MAIN CARD
                ================================== */}

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

                        {/* ==================================
                            ERROR MESSAGE
                        ================================== */}

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


                        {/* ==================================
                            SUCCESS MESSAGE
                        ================================== */}

                        {success && (

                            <Alert
                                severity="success"
                                sx={{
                                    marginBottom: 3,
                                    borderRadius: "8px"
                                }}
                            >
                                {success}
                            </Alert>

                        )}


                        {/* ==================================
                            ADD / EDIT DEPARTMENT
                        ================================== */}

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                marginBottom: 0.5
                            }}
                        >
                            {editingId
                                ? "Edit Department"
                                : "Add Department"}
                        </Typography>


                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                marginBottom: 3
                            }}
                        >
                            {editingId
                                ? "Update the department information below."
                                : "Create a new department for the organization."}
                        </Typography>


                        {/* ==================================
                            FORM
                        ================================== */}

                        <Box
                            component="form"
                            onSubmit={
                                editingId
                                    ? handleUpdateDepartment
                                    : handleAddDepartment
                            }
                        >

                            <Box
                                sx={{
                                    display: "grid",

                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        md: "1fr 1fr auto"
                                    },

                                    gap: 2,

                                    alignItems: "center"
                                }}
                            >

                                {/* DEPARTMENT NAME */}

                                <TextField
                                    label="Department Name"
                                    value={name}
                                    onChange={(event) =>
                                        setName(
                                            event.target.value
                                        )
                                    }
                                    required
                                    fullWidth
                                />


                                {/* DESCRIPTION */}

                                <TextField
                                    label="Description"
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(
                                            event.target.value
                                        )
                                    }
                                    fullWidth
                                />


                                {/* ACTION BUTTONS */}

                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 1
                                    }}
                                >

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={saving}
                                        sx={{
                                            height: 56,
                                            minWidth: 150,
                                            borderRadius: "6px",
                                            fontWeight: 600
                                        }}
                                    >

                                        {saving
                                            ? editingId
                                                ? "Updating..."
                                                : "Adding..."
                                            : editingId
                                                ? "Update Department"
                                                : "Add Department"}

                                    </Button>


                                    {/* CANCEL EDIT */}

                                    {editingId && (

                                        <Button
                                            type="button"
                                            variant="outlined"
                                            onClick={
                                                handleCancelEdit
                                            }
                                            disabled={saving}
                                            sx={{
                                                height: 56,
                                                minWidth: 100,
                                                borderRadius: "6px"
                                            }}
                                        >
                                            Cancel
                                        </Button>

                                    )}

                                </Box>

                            </Box>

                        </Box>


                        <Divider
                            sx={{
                                marginTop: 4,
                                marginBottom: 3
                            }}
                        />


                        {/* ==================================
                            DEPARTMENT LIST HEADER
                        ================================== */}

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                marginBottom: 0.5
                            }}
                        >
                            Department List
                        </Typography>


                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                marginBottom: 3
                            }}
                        >
                            View all departments in the organization.
                        </Typography>


                        {/* ==================================
                            LOADING
                        ================================== */}

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


                        {/* ==================================
                            DEPARTMENT LIST
                        ================================== */}

                        {!loading &&
                            !error &&
                            departments.map(
                                (department) => (

                                    <Box
                                        key={department.id}
                                        sx={{
                                            padding: 2,
                                            marginBottom: 1.5,
                                            border:
                                                "1px solid #e0e0e0",
                                            borderRadius: "8px",

                                            display: "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems:
                                                "center",

                                            gap: 2,

                                            flexWrap: "wrap"
                                        }}
                                    >

                                        {/* DEPARTMENT INFORMATION */}

                                        <Box
                                            sx={{
                                                flex: 1,
                                                minWidth:
                                                    "250px"
                                            }}
                                        >

                                            {/* Department ID */}

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    marginBottom:
                                                        0.5
                                                }}
                                            >
                                                Department ID:{" "}
                                                {department.id}
                                            </Typography>


                                            {/* Department Name */}

                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 600
                                                }}
                                            >
                                                {
                                                    department.name
                                                }
                                            </Typography>


                                            {/* Description */}

                                            <Typography
                                                color="text.secondary"
                                                sx={{
                                                    marginTop:
                                                        0.5
                                                }}
                                            >
                                                {
                                                    department.description
                                                    ||
                                                    "No description"
                                                }
                                            </Typography>

                                        </Box>


                                        {/* ACTIONS */}

                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 1
                                            }}
                                        >

                                            {/* EDIT */}

                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() =>
                                                    handleEditDepartment(
                                                        department
                                                    )
                                                }
                                                disabled={saving}
                                            >
                                                Edit
                                            </Button>


                                            {/* DELETE */}

                                            <Button
    variant="outlined"
    color="error"
    size="small"
    onClick={() =>
        handleDeleteDepartment(department)
    }
    disabled={saving}
>
    Delete
</Button>

                                        </Box>

                                    </Box>

                                )
                            )}


                        {/* ==================================
                            NO DEPARTMENTS
                        ================================== */}

                        {!loading &&
                            !error &&
                            departments.length === 0 && (

                                <Typography
                                    color="text.secondary"
                                    sx={{
                                        padding: 3,
                                        textAlign: "center"
                                    }}
                                >
                                    No departments found.
                                </Typography>

                            )}

                    </CardContent>

                </Card>

            </Box>

        </AppLayout>

    );

}


export default DepartmentManagement;