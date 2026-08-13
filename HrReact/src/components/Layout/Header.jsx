import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Avatar,
    Menu,
    MenuItem,
    Divider
} from "@mui/material";

import {
    Menu as MenuIcon,
    AccountCircle
} from "@mui/icons-material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Header({ onMenuClick }) {

    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        handleMenuClose();

        navigate("/login");
    };

    return (

        <AppBar
            position="fixed"
            elevation={1}
        >

            <Toolbar>

                {/* Mobile menu */}

                <IconButton
                    color="inherit"
                    edge="start"
                    onClick={onMenuClick}
                    sx={{
                        mr: 2,
                        display: {
                            xs: "block",
                            md: "none"
                        }
                    }}
                >
                    <MenuIcon />
                </IconButton>


                {/* Application name */}

                <Typography
                    variant="h6"
                    sx={{
                        flexGrow: 1,
                        fontWeight: 600
                    }}
                >
                    HRMS
                </Typography>


                {/* User */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                    }}
                >

                    <Typography
                        variant="body2"
                        sx={{
                            display: {
                                xs: "none",
                                sm: "block"
                            }
                        }}
                    >
                        {user?.email}
                    </Typography>


                    <IconButton
                        color="inherit"
                        onClick={handleMenuOpen}
                    >

                        <Avatar
                            sx={{
                                width: 34,
                                height: 34
                            }}
                        >
                            {user?.email
                                ?.charAt(0)
                                ?.toUpperCase()}
                        </Avatar>

                    </IconButton>

                </Box>


                {/* User menu */}

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >

                    <MenuItem disabled>

                        {user?.role}

                    </MenuItem>

                    <Divider />

                    <MenuItem
                        onClick={handleLogout}
                    >
                        Logout
                    </MenuItem>

                </Menu>

            </Toolbar>

        </AppBar>
    );
}

export default Header;