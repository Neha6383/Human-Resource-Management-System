import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box
} from "@mui/material";

import {
    Person,
    EventAvailable,
    EventNote,
    BeachAccess
} from "@mui/icons-material";

import AppLayout from "../components/Layout/AppLayout";


function EmployeeDashboard() {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const stats = [
        {
            title: "Attendance",
            value: "Present",
            icon: <EventAvailable fontSize="large" />
        },
        {
            title: "Leave Balance",
            value: "0",
            icon: <EventNote fontSize="large" />
        },
        {
            title: "Holidays",
            value: "0",
            icon: <BeachAccess fontSize="large" />
        },
        {
            title: "Profile",
            value: "View",
            icon: <Person fontSize="large" />
        }
    ];

    return (
        <AppLayout>

            <Box sx={{ marginBottom: 4 }}>

                <Typography
                    variant="h4"
                    gutterBottom
                >
                    Employee Dashboard
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
                                            variant="h5"
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
                        My Profile
                    </Typography>

                    <Typography color="text.secondary">
                        Employee profile information will appear here.
                    </Typography>

                </CardContent>

            </Card>

        </AppLayout>
    );
}

export default EmployeeDashboard;