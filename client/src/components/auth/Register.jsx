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
  MenuItem,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Google as GoogleIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import Brand from '../../shared/components/Brand';
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
    confirmPassword: '',
    role: 'patient',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please try again.');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);
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

  const handleGoogleSignup = () => {
    // TODO: Implement Google OAuth
    // For now, show a message
    setError('Google signup is coming soon! Please use email and password for now.');
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
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <Brand size={32} textVariant="h5" />
              <Typography variant="h6" sx={{ color: '#2C3E50', fontWeight: 700, mt: 1 }}>
                Create Account
              </Typography>
            </Box>
            
            <Typography variant="body2" sx={{ color: '#546E7A', mb: 3, textAlign: 'center' }}>
              Join Jayathura LifeCare today and start your health journey
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2, backgroundColor: '#FFEBEE', borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ width: '100%', mb: 2, backgroundColor: '#E8F5E9', borderRadius: 2 }}>
                {success}
              </Alert>
            )}

            {/* Google Signup Button */}
            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleSignup}
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
              Sign up with Google
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
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={formData.confirmPassword !== '' && formData.password !== formData.confirmPassword}
              helperText={
                formData.confirmPassword !== '' && formData.password !== formData.confirmPassword
                  ? 'Passwords do not match'
                  : ''
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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