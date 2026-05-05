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
      main: '#7AA8B0',
      light: '#ECF4E8',
      dark: '#93BFC7',
    },
    background: {
      default: '#ECF4E8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
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
      main: '#f43f5e',
      light: '#fff1f2',
    },
  },
  typography: {
    fontFamily: '"Inter", "Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 800,
      color: '#1e293b',
      fontSize: '2.25rem',
      letterSpacing: '-0.025em',
    },
    h5: {
      fontWeight: 700,
      color: '#1e293b',
    },
    h6: {
      fontWeight: 700,
      color: '#1e293b',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#1e293b',
    },
    body2: {
      color: '#64748b',
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 700,
          padding: '10px 24px',
          fontSize: '0.9rem',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          backgroundColor: '#ABE7B2',
          color: '#1e293b',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#CBF3BB',
            boxShadow: '0 8px 20px rgba(171, 231, 178, 0.25)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: 'rgba(147, 191, 199, 0.4)',
          color: '#7AA8B0',
          '&:hover': {
            backgroundColor: '#ECF4E8',
            borderColor: '#7AA8B0',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 12px rgba(171, 231, 178, 0.08)',
          border: '1px solid rgba(147, 191, 199, 0.2)',
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#1e293b',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          borderBottom: '1px solid rgba(147, 191, 199, 0.2)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#f8fafc',
            '& fieldset': {
              borderColor: 'rgba(147, 191, 199, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: '#ABE7B2',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#7AA8B0',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 16,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
        },
      },
    },
  },
});