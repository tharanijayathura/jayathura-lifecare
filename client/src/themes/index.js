// client/src/themes/index.js
import { createTheme } from '@mui/material/styles';

export const lifecareTheme = createTheme({
  palette: {
    primary: {
      main: '#ABE7B2',
      light: '#ECF4E8',
      dark: '#CBF3BB',
    },
    secondary: {
      main: '#93BFC7',
      light: '#ECF4E8',
      dark: '#93BFC7',
    },
    background: {
      default: '#ECF4E8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#546E7A',
    },
    success: {
      main: '#ABE7B2',
      light: '#ECF4E8',
    },
    info: {
      main: '#93BFC7',
      light: '#ECF4E8',
    },
    warning: {
      main: '#CBF3BB',
      light: '#ECF4E8',
    },
    error: {
      main: '#ABE7B2',
      light: '#ECF4E8',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      color: '#2C3E50',
      fontSize: '2rem',
    },
    h5: {
      fontWeight: 600,
      color: '#2C3E50',
    },
    h6: {
      fontWeight: 500,
      color: '#2C3E50',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#2C3E50',
    },
    body2: {
      color: '#546E7A',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 24px',
          fontSize: '0.9rem',
        },
        contained: {
          backgroundColor: '#ABE7B2',
          color: '#2C3E50',
          '&:hover': {
            backgroundColor: '#CBF3BB',
            boxShadow: '0 4px 8px rgba(171, 231, 178, 0.3)',
          },
        },
        outlined: {
          borderColor: '#93BFC7',
          color: '#93BFC7',
          '&:hover': {
            backgroundColor: '#ECF4E8',
            borderColor: '#93BFC7',
          },
        },
        text: {
          color: '#93BFC7',
          '&:hover': {
            backgroundColor: '#ECF4E8',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(171, 231, 178, 0.1)',
          border: '1px solid #ECF4E8',
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#2C3E50',
          boxShadow: '0 1px 3px rgba(171, 231, 178, 0.2)',
          borderBottom: '1px solid #ECF4E8',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover fieldset': {
              borderColor: '#ABE7B2',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#93BFC7',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        standardSuccess: {
          backgroundColor: '#ECF4E8',
          color: '#2C3E50',
        },
        standardError: {
          backgroundColor: '#ECF4E8',
          color: '#2C3E50',
        },
      },
    },
  },
});