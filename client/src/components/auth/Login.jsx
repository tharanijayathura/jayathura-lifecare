// client/src/components/auth/Login.jsx
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Paper,
  Container,
  Divider,
  IconButton
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import Brand from '../../shared/components/Brand';
import { useAuth } from '../../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../common/PageHeader';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = await login(formData.email, formData.password);
      
      // Redirect based on role
      const redirectPaths = {
        patient: '/patient',
        pharmacist: '/pharmacist',
        admin: '/admin',
        delivery: '/delivery'
      };
      
      const redirectPath = redirectPaths[userData.role] || '/patient';
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    // For now, show a message
    setError('Google login is coming soon! Please use email and password for now.');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ECF4E8 0%, #CBF3BB 50%, #ABE7B2 100%)',
        py: 4,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.2,
          zIndex: 0,
        },
      }}
    >
      <Container component="main" maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <PageHeader title="Login" subtitle="Welcome back to Jayathura LifeCare" showBack={true} backPath="/" />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              padding: { xs: 3, md: 4 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              border: '1px solid rgba(171, 231, 178, 0.3)',
              width: '100%',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Brand size={32} textVariant="h5" />
              <Typography variant="h6" sx={{ color: '#2C3E50', fontWeight: 700, mt: 1 }}>
                Sign In
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2, backgroundColor: '#FFEBEE', borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* Google Login Button */}
            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleLogin}
              startIcon={<GoogleIcon />}
              sx={{
                mb: 3,
                py: 1.5,
                borderRadius: 2,
                borderColor: '#DB4437',
                color: '#DB4437',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#C23321',
                  backgroundColor: 'rgba(219, 68, 55, 0.04)',
                },
              }}
            >
              Continue with Google
            </Button>

            <Divider sx={{ width: '100%', mb: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', px: 2 }}>
                OR
              </Typography>
            </Divider>

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#ABE7B2',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ABE7B2',
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#ABE7B2',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ABE7B2',
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.75,
                backgroundColor: '#ABE7B2',
                color: '#2C3E50',
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(171, 231, 178, 0.4)',
                '&:hover': {
                  backgroundColor: '#CBF3BB',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(171, 231, 178, 0.5)',
                },
                '&:disabled': {
                  backgroundColor: '#ECF4E8',
                  color: '#93BFC7',
                },
                transition: 'all 0.3s',
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
              <Button
                fullWidth
                variant="text"
                onClick={() => navigate('/forgot-password')}
                sx={{
                  color: '#93BFC7',
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: '#ECF4E8',
                  },
                }}
              >
                Forgot Password?
              </Button>
              <Button
                fullWidth
                variant="text"
                onClick={() => navigate('/register')}
                sx={{
                  color: '#93BFC7',
                  '&:hover': {
                    backgroundColor: '#ECF4E8',
                  },
                }}
              >
                Don't have an account? Sign Up
              </Button>
            </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;