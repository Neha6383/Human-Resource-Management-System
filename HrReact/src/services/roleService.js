import axios from "axios";

const API_URL = "http://localhost:5000/api/roles";

export const getUsersWithRoles = async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
};

export const updateUserRole = async (userId, roleId) => {
    const response = await axios.put(
        `${API_URL}/users/${userId}`,
        {
            roleId: roleId
        }
    );

    return response.data;
};

export const getRoles = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getRolePermissions = async (roleId) => {
    const response = await axios.get(
        `${API_URL}/${roleId}/permissions`
    );

    return response.data;
};

export const updateRolePermissions = async (
    roleId,
    permissionIds
) => {
    const response = await axios.put(
        `${API_URL}/${roleId}/permissions`,
        {
            permissionIds: permissionIds
        }
    );

    return response.data;
};