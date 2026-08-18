import {
    Drawer,
    Toolbar,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider
} from "@mui/material";

import {
    Dashboard,
    People,
    Business,
    EventAvailable,
    EventNote,
    Security,
    AccountCircle
} from "@mui/icons-material";

import { useLocation, useNavigate } from "react-router-dom";


const drawerWidth = 240;


function Sidebar({
    mobileOpen,
    onMobileClose
}) {

    const navigate = useNavigate();

    const location = useLocation();


    // ======================================================
    // GET LOGGED-IN USER
    // ======================================================

    const user = JSON.parse(
        localStorage.getItem("user")
    );


    const role = user?.role;


    // ======================================================
    // DASHBOARD PATH
    // ======================================================

    const dashboardPath =
        role === "Admin"
            ? "/admin/dashboard"
            : role === "HR"
                ? "/hr/dashboard"
                : "/employee/dashboard";


    // ======================================================
    // MENU ITEMS
    // ======================================================

    const menuItems = [

        // ==================================================
        // DASHBOARD
        // ==================================================

        {
            label: "Dashboard",
            icon: <Dashboard />,
            path: dashboardPath
        },


        // ==================================================
        // EMPLOYEES
        // ADMIN + HR ONLY
        // ==================================================

        ...(role === "Admin" || role === "HR"
            ? [
                {
                    label: "Employees",
                    icon: <People />,
                    path: "/employees"
                }
            ]
            : []),


        // ==================================================
        // DEPARTMENTS
        // ADMIN + HR ONLY
        // ==================================================

        ...(role === "Admin" || role === "HR"
            ? [
                {
                    label: "Departments",
                    icon: <Business />,
                    path: "/departments"
                }
            ]
            : []),


        // ==================================================
        // ATTENDANCE
        // ==================================================

        {
            label: "Attendance",
            icon: <EventAvailable />,
            path: "/employee/attendance"
        },

        // ==================================================
// PROFILE
// EMPLOYEE ONLY
// ==================================================

...(role === "Employee"
    ? [
        {
            label: "Profile",
            icon: <AccountCircle />,
            path: "/employee/profile"
        }
    ]
    : []),

        // ==================================================
        // LEAVES
        // ==================================================

        {
            label: "Leaves",
            icon: <EventNote />,
            path: "/leave"
        },


        // ==================================================
        // ROLES
        // ADMIN ONLY
        // ==================================================

        ...(role === "Admin"
            ? [
                {
                    label: "Roles",
                    icon: <Security />,
                    path: "/roles"
                }
            ]
            : [])

    ];


    // ======================================================
    // DRAWER CONTENT
    // ======================================================

    const drawerContent = (

        <Box>

            <Toolbar />

            <Divider />


            <List>

                {menuItems.map((item) => (

                    <ListItem
                        key={item.label}
                        disablePadding
                    >

                        <ListItemButton
                            selected={
                                location.pathname === item.path
                            }
                            onClick={() => {

                                navigate(item.path);

                                onMobileClose();

                            }}
                        >

                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>


                            <ListItemText
                                primary={item.label}
                            />

                        </ListItemButton>

                    </ListItem>

                ))}

            </List>

        </Box>

    );


    // ======================================================
    // SIDEBAR
    // ======================================================

    return (

        <>

            {/* ==============================================
                DESKTOP SIDEBAR
            ============================================== */}

            <Drawer
                variant="permanent"
                sx={{
                    display: {
                        xs: "none",
                        md: "block"
                    },

                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box"
                    }
                }}
                open
            >

                {drawerContent}

            </Drawer>


            {/* ==============================================
                MOBILE SIDEBAR
            ============================================== */}

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onMobileClose}
                ModalProps={{
                    keepMounted: true
                }}
                sx={{
                    display: {
                        xs: "block",
                        md: "none"
                    },

                    "& .MuiDrawer-paper": {
                        width: drawerWidth
                    }
                }}
            >

                {drawerContent}

            </Drawer>

        </>

    );

}


export default Sidebar;