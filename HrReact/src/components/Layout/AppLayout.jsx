import { useState } from "react";

import {
    Box,
    Toolbar
} from "@mui/material";

import Header from "./Header";
import Sidebar from "./Sidebar";


const drawerWidth = 240;


function AppLayout({ children }) {

    const [mobileOpen, setMobileOpen] = useState(false);


    const handleMenuClick = () => {
        setMobileOpen(true);
    };


    const handleMobileClose = () => {
        setMobileOpen(false);
    };


    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                backgroundColor: "background.default"
            }}
        >

            {/* Header */}

            <Header
                onMenuClick={handleMenuClick}
            />


            {/* Sidebar */}

            <Sidebar
                mobileOpen={mobileOpen}
                onMobileClose={handleMobileClose}
            />


            {/* Main Content */}

            <Box
                component="main"
                sx={{
                    flexGrow: 1,

                    width: {
                        xs: "100%",
                        md: `calc(100% - ${drawerWidth}px)`
                    },

                    marginLeft: {
                        xs: 0,
                        md: `${drawerWidth}px`
                    },

                    minHeight: "100vh",

                    backgroundColor: "background.default"
                }}
            >

                {/* Space for fixed Header */}

                <Toolbar />


                {/* Page Content */}

                <Box
                    sx={{
                        padding: {
                            xs: 2,
                            sm: 3,
                            md: 4
                        }
                    }}
                >

                    {children}

                </Box>

            </Box>

        </Box>
    );
}


export default AppLayout;