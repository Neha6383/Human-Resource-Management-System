import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1976d2",
        },
        secondary: {
            main: "#9c27b0",
        },
        background: {
            default: "#f5f7fa",
        },
    },

    typography: {
        fontFamily: "Inter, Arial, sans-serif",

        h4: {
            fontWeight: 700,
        },

        h5: {
            fontWeight: 600,
        },
    },

    shape: {
        borderRadius: 10,
    },

    components: {
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
        },

        MuiTextField: {
            defaultProps: {
                variant: "outlined",
                fullWidth: true,
            },
        },
    },
});

export default theme;