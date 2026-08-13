import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Button
} from "@mui/material";

import {
    People,
    Business,
    EventAvailable,
    EventNote
} from "@mui/icons-material";

import AppLayout from "../components/Layout/AppLayout";


function AdminDashboard() {

    const user = JSON.parse(
        localStorage.getItem("user")
    );


    const stats = [
        {
            title: "Total Employees",
            value: "0",
            icon: <People fontSize="large" />
        },

        {
            title: "Departments",
            value: "0",
            icon: <Business fontSize="large" />
        },

        {
            title: "Today's Attendance",
            value: "0",
            icon: <EventAvailable fontSize="large" />
        },

        {
            title: "Pending Leaves",
            value: "0",
            icon: <EventNote fontSize="large" />
        }
    ];


    return (

        <AppLayout>

            {/* Page Header */}

            <Box
                sx={{
                    marginBottom: 4
                }}
            >

                <Typography
                    variant="h4"
                    gutterBottom
                >
                    Dashboard
                </Typography>

                <Typography
                    color="text.secondary"
                >
                    Welcome back, {user?.email}
                </Typography>

            </Box>


            {/* Statistics */}

            <Grid
                container
                spacing={3}
            >

                {stats.map((stat) => (

                    <Grid
                        key={stat.title}
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 3
                        }}
                    >

                        <Card>

                            <CardContent>

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems: "center"
                                    }}
                                >

                                    <Box>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {stat.title}
                                        </Typography>

                                        <Typography
                                            variant="h4"
                                            sx={{
                                                marginTop: 1,
                                                fontWeight: 700
                                            }}
                                        >
                                            {stat.value}
                                        </Typography>

                                    </Box>

                                    {stat.icon}

                                </Box>

                            </CardContent>

                        </Card>

                    </Grid>

                ))}

            </Grid>


            {/* Recent activity */}

            <Card
                sx={{
                    marginTop: 4
                }}
            >

                <CardContent>

                    <Typography
                        variant="h6"
                        gutterBottom
                    >
                        Recent Activity
                    </Typography>

                    <Typography
                        color="text.secondary"
                    >
                        No recent activities available.
                    </Typography>

                </CardContent>

            </Card>

        </AppLayout>
    );
}

export default AdminDashboard;