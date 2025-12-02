// client/src/components/auth/Login.jsx
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Paper,
  Container
} from '@mui/material';
import { LocalPharmacy } from '@mui/icons-material';
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

  return (
    <Container component="main" maxWidth="sm">
      <PageHeader title="Login" subtitle="Welcome back to Jayathura LifeCare" showBack={true} backPath="/" />
      <Box
        sx={{
          marginTop: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 3,
            border: '1px solid #ECF4E8',
            width: '100%',
          }}
        >

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2, backgroundColor: '#ECF4E8' }}>
              {error}
            </Alert>
          )}

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
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
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
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
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
                mt: 3,
                mb: 2,
                py: 1.5,
                backgroundColor: '#ABE7B2',
                color: '#2C3E50',
                '&:hover': {
                  backgroundColor: '#CBF3BB',
                },
                '&:disabled': {
                  backgroundColor: '#ECF4E8',
                  color: '#93BFC7',
                },
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
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
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;