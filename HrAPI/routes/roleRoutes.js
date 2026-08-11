const express = require("express");

const {
    getRoles,
    getRoleById,
    createRole,
    updateRole,
    getRolePermissions,
    updateRolePermissions
} = require("../controllers/roleController");


const router = express.Router();


/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     description: Returns all roles available in the HRMS system.
 *     tags:
 *       - Role Management
 *     responses:
 *       200:
 *         description: Roles fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Admin
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *
 *       500:
 *         description: Failed to fetch roles
 */


router.get("/", getRoles);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create a new role
 *     description: Creates a new role in the HRMS system.
 *     tags:
 *       - Role Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Manager
 *     responses:
 *       201:
 *         description: Role created successfully
 *       400:
 *         description: Role name is required
 *       409:
 *         description: Role already exists
 *       500:
 *         description: Failed to create role
 */

router.post("/", createRole);

/**
 * @swagger
 * /api/roles/{id}/permissions:
 *   get:
 *     summary: Get permissions for a role
 *     description: Returns all available permissions and indicates which permissions are enabled for the selected role.
 *     tags:
 *       - Role Management
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Role permissions fetched successfully
 *       404:
 *         description: Role not found
 *       500:
 *         description: Failed to fetch role permissions
 */

router.get("/:id/permissions", getRolePermissions);

/**
 * @swagger
 * /api/roles/{id}/permissions:
 *   put:
 *     summary: Update permissions for a role
 *     description: Replaces the existing permissions of a role with the supplied permission IDs.
 *     tags:
 *       - Role Management
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissionIds
 *             properties:
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3, 5]
 *     responses:
 *       200:
 *         description: Role permissions updated successfully
 *       400:
 *         description: Invalid permission IDs
 *       404:
 *         description: Role not found
 *       500:
 *         description: Failed to update role permissions
 */

router.put("/:id/permissions", updateRolePermissions);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get role by ID
 *     description: Returns a specific role using its ID.
 *     tags:
 *       - Role Management
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Role fetched successfully
 *       404:
 *         description: Role not found
 *       500:
 *         description: Failed to fetch role
 */

router.get("/:id", getRoleById);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Update a role
 *     description: Updates the name of an existing role.
 *     tags:
 *       - Role Management
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Team Manager
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Role name is required
 *       404:
 *         description: Role not found
 *       409:
 *         description: Role name already exists
 *       500:
 *         description: Failed to update role
 */

router.put("/:id", updateRole);


module.exports = router;