import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box
} from "@mui/material";

import {
    People,
    EventAvailable,
    EventNote,
    Assessment
} from "@mui/icons-material";

import AppLayout from "../components/Layout/AppLayout";


function HRDashboard() {

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
            title: "Today's Attendance",
            value: "0",
            icon: <EventAvailable fontSize="large" />
        },
        {
            title: "Pending Leave",
            value: "0",
            icon: <EventNote fontSize="large" />
        },
        {
            title: "Reports",
            value: "0",
            icon: <Assessment fontSize="large" />
        }
    ];

    return (
        <AppLayout>

            <Box sx={{ marginBottom: 4 }}>

                <Typography
                    variant="h4"
                    gutterBottom
                >
                    HR Dashboard
                </Typography>

                <Typography color="text.secondary">
                    Welcome back, {user?.email}
                </Typography>

            </Box>

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
                                        justifyContent: "space-between",
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


            <Card sx={{ marginTop: 4 }}>

                <CardContent>

                    <Typography
                        variant="h6"
                        gutterBottom
                    >
                        Leave Approvals
                    </Typography>

                    <Typography color="text.secondary">
                        No pending leave requests.
                    </Typography>

                </CardContent>

            </Card>

        </AppLayout>
    );
}

export default HRDashboard;