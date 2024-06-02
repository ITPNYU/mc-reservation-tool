import { createTheme } from '@mui/material/styles';
import { deepPurple } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: deepPurple.A700,
    },
    secondary: {
      main: deepPurple.A100,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'a:not(.navbar-brand > a):not(.nav-link)': {
          color: deepPurple.A700,
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
});

export default theme;
