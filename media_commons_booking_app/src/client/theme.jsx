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
    custom: {
      gray: 'rgba(33, 33, 33, 0.08)',
      border: 'rgba(0,0,0,0.12)',
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

        table: {
          border: '1px solid rgba(0,0,0,0.12)',
        },
      },
    },
  },
});

export default theme;
