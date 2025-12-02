// client/src/components/auth/Register.jsx
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Paper,
  Container,
  MenuItem
} from '@mui/material';
import { LocalPharmacy } from '@mui/icons-material';
import { useAuth } from '../../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../common/PageHeader';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setSuccess('');

    try {
      const result = await register(formData);
      // Show appropriate message based on role
      if (result.isApproved) {
        setSuccess('Registration successful! You can now sign in.');
      } else {
        setSuccess('Registration successful! Your account is pending approval. You will be notified once approved by the administrator.');
      }
      // Wait a moment to show the message, then redirect to login
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container component="main" maxWidth="sm">
        <PageHeader title="Register" subtitle="Create your account to get started" showBack={true} backPath="/" />
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
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: 3,
              border: '1px solid #ECF4E8',
              width: '100%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocalPharmacy sx={{ color: '#ABE7B2', fontSize: 40, mr: 1 }} />
              <Typography variant="h5" sx={{ color: '#2C3E50', fontWeight: 700 }}>
                Create Account
              </Typography>
            </Box>
            
            <Typography variant="body2" sx={{ color: '#546E7A', mb: 3, textAlign: 'center' }}>
              Join Jayathura LifeCare today and start your health journey
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2, backgroundColor: '#ECF4E8' }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ width: '100%', mb: 2, backgroundColor: '#ECF4E8' }}>
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
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
              autoComplete="new-password"
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="phone"
              label="Phone Number"
              type="tel"
              id="phone"
              autoComplete="tel"
              value={formData.phone}
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
              select
              name="role"
              label="Role"
              value={formData.role}
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
            >
              <MenuItem value="patient">Patient</MenuItem>
              <MenuItem value="pharmacist">Pharmacist</MenuItem>
              <MenuItem value="delivery">Delivery Person</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/login')}
              sx={{
                color: '#93BFC7',
                '&:hover': {
                  backgroundColor: '#ECF4E8',
                },
              }}
            >
              Already have an account? Sign In
            </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;