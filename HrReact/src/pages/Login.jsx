import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
} from "@mui/material";

import {
    EmailOutlined,
    LockOutlined,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";

import { loginUser } from "../services/authService";


function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loginError, setLoginError] = useState("");

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);


    const handleSubmit = async (event) => {

        event.preventDefault();

        setEmailError("");
        setPasswordError("");
        setLoginError("");

        let isValid = true;


        // Email validation

        if (!email) {

            setEmailError("Email is required");

            isValid = false;

        } else if (!email.includes("@")) {

            setEmailError("Enter a valid email");

            isValid = false;
        }


        // Password validation

        if (!password) {

            setPasswordError(
                "Password is required"
            );

            isValid = false;

        } else if (password.length < 6) {

            setPasswordError(
                "Password must be at least 6 characters"
            );

            isValid = false;
        }


        if (!isValid) {
            return;
        }


        try {

            setLoading(true);

            const data = await loginUser(
                email,
                password
            );


            console.log(
                "Login response:",
                data
            );


            // Store JWT

            localStorage.setItem(
                "token",
                data.token
            );


            // Store user

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            // Role based redirect

            if (data.user.role === "Admin") {

                navigate(
                    "/admin/dashboard"
                );

            } else if (
                data.user.role === "HR"
            ) {

                navigate(
                    "/hr/dashboard"
                );

            } else if (
                data.user.role === "Employee"
            ) {

                navigate(
                    "/employee/dashboard"
                );

            } else {

                navigate(
                    "/unauthorized"
                );
            }


        } catch (error) {

            console.error(
                "Login error:",
                error.response?.data ||
                error.message
            );


            setLoginError(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );


        } finally {

            setLoading(false);

        }
    };


    return (

        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "background.default",
                padding: 2,
            }}
        >

            <Paper
                elevation={4}
                sx={{
                    width: "100%",
                    maxWidth: 430,
                    padding: {
                        xs: 3,
                        sm: 5,
                    },
                    borderRadius: 3,
                }}
            >

                {/* Header */}

                <Box
                    sx={{
                        textAlign: "center",
                        marginBottom: 4,
                    }}
                >

                    <Typography
                        variant="h4"
                        color="primary"
                        gutterBottom
                    >
                        HRMS
                    </Typography>


                    <Typography
                        variant="h5"
                        gutterBottom
                    >
                        Welcome Back
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Sign in to access your account
                    </Typography>

                </Box>


                {/* Login Error */}

                {loginError && (

                    <Alert
                        severity="error"
                        sx={{ marginBottom: 2 }}
                    >
                        {loginError}
                    </Alert>

                )}


                {/* Login Form */}

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >

                    {/* Email */}

                    <TextField
                        label="Email"
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) =>
                            setEmail(
                                event.target.value
                            )
                        }
                        error={Boolean(emailError)}
                        helperText={emailError}
                        autoComplete="email"
                        sx={{ marginBottom: 2 }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlined />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />


                    {/* Password */}

                    <TextField
                        label="Password"
                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) =>
                            setPassword(
                                event.target.value
                            )
                        }
                        error={Boolean(passwordError)}
                        helperText={passwordError}
                        autoComplete="current-password"
                        sx={{ marginBottom: 3 }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlined />
                                    </InputAdornment>
                                ),

                                endAdornment: (
                                    <InputAdornment position="end">

                                        <IconButton
                                            onClick={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
                                            edge="end"
                                        >

                                            {showPassword
                                                ? <VisibilityOff />
                                                : <Visibility />
                                            }

                                        </IconButton>

                                    </InputAdornment>
                                ),
                            },
                        }}
                    />


                    {/* Login Button */}

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={loading}
                        sx={{
                            height: 48,
                            fontSize: "1rem",
                        }}
                    >

                        {loading ? (

                            <CircularProgress
                                size={24}
                                color="inherit"
                            />

                        ) : (

                            "Login"

                        )}

                    </Button>

                </Box>

            </Paper>

        </Box>
    );
}

export default Login;