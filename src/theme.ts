import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    primary: {
      main: "#f5bf55",
      contrastText: "FFF",
    },
    secondary: {
      main: "#333333",
    },
    background: {
      default: "#000",
    },
    text: {
      primary: "#ffffff",
      secondary: "#d2c1af",
    }
  },
  typography: {
    fontFamily: "Roboto, Tw Cen MT, sans-serif",
    h1: {},
    h2: {},
    h3: {
      fontSize: "2.5em"
    },
    h4: {},
    h5: {},
    h6: {},
    button: {},
    subtitle1: {},
    subtitle2: {},
    body1: {},
    body2: {},
  },
});

export default theme;