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
    Security
} from "@mui/icons-material";

import { useLocation, useNavigate } from "react-router-dom";


const drawerWidth = 240;


function Sidebar({
    mobileOpen,
    onMobileClose
}) {

    const navigate = useNavigate();

    const location = useLocation();

    const user = JSON.parse(
        localStorage.getItem("user")
    );


    const menuItems = [
    {
        label: "Dashboard",
        icon: <Dashboard />,
        path:
            user?.role === "Admin"
                ? "/admin/dashboard"
                : user?.role === "HR"
                    ? "/hr/dashboard"
                    : "/employee/dashboard"
    },

    {
        label: "Employees",
        icon: <People />,
        path: "/employees"
    },

    {
        label: "Departments",
        icon: <Business />,
        path: "/departments"
    },

    {
        label: "Attendance",
        icon: <EventAvailable />,
        path: "/attendance"
    },

    {
        label: "Leaves",
        icon: <EventNote />,
        path: "/leave"
    },

    ...(user?.role === "Admin"
        ? [
            {
                label: "Roles",
                icon: <Security />,
                path: "/roles"
            }
        ]
        : [])
];


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


    return (

        <>

            {/* Desktop sidebar */}

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


            {/* Mobile sidebar */}

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