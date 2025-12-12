import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#455a64',
    },
    secondary: {
      main: '#eceff1',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
  },
  components: {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        fontFamily: "Roboto, sans-serif",
        fontSize: "14px",
      },
    },
  },
},
});