import { useEffect, useState } from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
    Checkbox,
    FormControlLabel,
    Button
} from "@mui/material";

import {
    getUsersWithRoles,
    getRoles,
    updateUserRole,
    getRolePermissions,
    updateRolePermissions
} from "../services/roleService";

function RoleManagement() {

    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedRole, setSelectedRole] = useState("");

    const [permissions, setPermissions] = useState([]);

    const [permissionLoading, setPermissionLoading] = useState(false);

    const [permissionSaving, setPermissionSaving] = useState(false);

    useEffect(() => {
        loadRoleData();
    }, []);

    const loadRoleData = async () => {

        try {

            setLoading(true);
            setError("");

            const usersData = await getUsersWithRoles();
            const rolesData = await getRoles();

            setUsers(usersData);
            setRoles(rolesData);

        } catch (error) {

            console.error(
                "Error loading role management data:",
                error
            );

            setError(
                "Unable to load role management data."
            );

        } finally {

            setLoading(false);

        }
    };

    const handleRoleChange = async (userId, roleId) => {

        try {

            await updateUserRole(userId, roleId);

            await loadRoleData();

        } catch (error) {

            console.error(
                "Error updating user role:",
                error
            );

            setError(
                "Unable to update user role."
            );
        }
    };

    if (loading) {

        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "400px"
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    const handleRoleSelect = async (roleId) => {

    setSelectedRole(roleId);

    if (!roleId) {
        setPermissions([]);
        setSelectedPermissions([]);
        return;
    }

    try {

        setPermissionLoading(true);
        setError("");

        const data = await getRolePermissions(roleId);

        setPermissions(data);

        const enabledPermissionIds = data
            .filter((permission) => permission.assigned)
            .map((permission) => permission.id);

        setSelectedPermissions(
            enabledPermissionIds
        );

    } catch (error) {

        console.error(
            "Error loading permissions:",
            error
        );

        setError(
            "Unable to load role permissions."
        );

    } finally {

        setPermissionLoading(false);
    }
};

const handlePermissionChange = (permissionId) => {

    setSelectedPermissions((previous) => {

        if (previous.includes(permissionId)) {

            return previous.filter(
                (id) => id !== permissionId
            );

        }

        return [
            ...previous,
            permissionId
        ];
    });
};

const handleSavePermissions = async () => {

    if (!selectedRole) {
        setError("Please select a role.");
        return;
    }

    try {

        setPermissionSaving(true);
        setError("");

        await updateRolePermissions(
            selectedRole,
            selectedPermissions
        );

        alert(
            "Permissions updated successfully."
        );

        await handleRoleSelect(selectedRole);

    } catch (error) {

        console.error(
            "Error updating permissions:",
            error
        );

        setError(
            "Unable to update permissions."
        );

    } finally {

        setPermissionSaving(false);
    }
};

    return (
        <Box sx={{ padding: 3 }}>

            <Typography
                variant="h4"
                sx={{
                    fontWeight: 600,
                    marginBottom: 3
                }}
            >
                Role Management
            </Typography>

            {error && (
                <Alert
                    severity="error"
                    sx={{ marginBottom: 3 }}
                >
                    {error}
                </Alert>
            )}

            <Card>

                <CardContent>

                    <Typography
                        variant="h6"
                        sx={{
                            marginBottom: 2,
                            fontWeight: 600
                        }}
                    >
                        User Role Assignment
                    </Typography>

                    {users.map((user) => (

                        <Box
                            key={user.id}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: 2,
                                borderBottom:
                                    "1px solid #eeeeee"
                            }}
                        >

                            <Box>

                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontWeight: 500
                                    }}
                                >
                                    {user.email}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    User ID: {user.id}
                                </Typography>

                            </Box>

                            <FormControl
                                size="small"
                                sx={{ minWidth: 160 }}
                            >

                                <InputLabel>
                                    Role
                                </InputLabel>

                                <Select
                                    value={user.role_id || ""}
                                    label="Role"
                                    onChange={(event) =>
                                        handleRoleChange(
                                            user.id,
                                            event.target.value
                                        )
                                    }
                                >

                                    {roles.map((role) => (

                                        <MenuItem
                                            key={role.id}
                                            value={role.id}
                                        >
                                            {role.name}
                                        </MenuItem>

                                    ))}

                                </Select>

                            </FormControl>

                        </Box>

                    ))}

                </CardContent>

            </Card>

            <Card sx={{ marginTop: 3 }}>

    <CardContent>

        <Typography
            variant="h6"
            sx={{
                marginBottom: 2,
                fontWeight: 600
            }}
        >
            Permission Management
        </Typography>

        <FormControl
            size="small"
            sx={{
                minWidth: 220,
                marginBottom: 3
            }}
        >

            <InputLabel>
                Select Role
            </InputLabel>

            <Select
                value={selectedRole}
                label="Select Role"
                onChange={(event) =>
                    handleRoleSelect(
                        event.target.value
                    )
                }
            >

                {roles.map((role) => (

                    <MenuItem
                        key={role.id}
                        value={role.id}
                    >
                        {role.name}
                    </MenuItem>

                ))}

            </Select>

        </FormControl>


        {permissionLoading && (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    padding: 3
                }}
            >
                <CircularProgress />
            </Box>
        )}


        {!permissionLoading &&
            permissions.length > 0 && (

                <Box>

                    {permissions.map(
                        (permission) => (

                            <Box
                                key={permission.id}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent:
                                        "space-between",
                                    padding: 1.5,
                                    borderBottom:
                                        "1px solid #eeeeee"
                                }}
                            >

                                <Box>

                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: 500
                                        }}
                                    >
                                        {permission.module}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {permission.feature}
                                    </Typography>

                                </Box>

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedPermissions.includes(
                                                permission.id
                                            )}
                                            onChange={() =>
                                                handlePermissionChange(
                                                    permission.id
                                                )
                                            }
                                        />
                                    }
                                    label={
                                        permission.action
                                    }
                                />

                            </Box>

                        )
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                "flex-end",
                            marginTop: 3
                        }}
                    >

                        <Button
                            variant="contained"
                            onClick={
                                handleSavePermissions
                            }
                            disabled={
                                permissionSaving
                            }
                        >
                            {permissionSaving
                                ? "Saving..."
                                : "Save Permissions"}
                        </Button>

                    </Box>

                </Box>
            )}

    </CardContent>

</Card>

        </Box>
    );
}

export default RoleManagement;