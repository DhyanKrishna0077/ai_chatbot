import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Lato"
  },
  palette: {
    primary: {
      light: "#8da8f0",
      main: "#95c4e6",
      dark: "#001f3f",
      contrastText: "#fff",
    },
  },
});

export default theme;
