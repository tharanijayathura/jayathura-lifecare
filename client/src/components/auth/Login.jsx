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
  InputAdornment,
  IconButton,
  Grid,
  Stack,
  CircularProgress
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  EmailOutlined, 
  LockOutlined,
  ArrowForward
} from '@mui/icons-material';
import Brand from '../../shared/components/Brand';
import { useAuth } from '../../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import pimage from '../../assets/pimage.png';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = await login(formData.email, formData.password);
      const redirectPaths = {
        patient: '/patient',
        pharmacist: '/pharmacist',
        admin: '/admin',
        delivery: '/delivery',
      };
      navigate(redirectPaths[userData.role] || '/patient');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Left side: Image and Branding */}
      <Grid item xs={12} md={6} sx={{ 
        bgcolor: '#ECF4E8', 
        display: { xs: 'none', md: 'flex' }, 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        position: 'relative',
        minHeight: { xs: 'auto', md: '100vh' }
      }}>
        <Box 
          onClick={() => navigate('/')}
          sx={{ position: 'absolute', top: 40, left: 40, cursor: 'pointer', '&:hover': { opacity: 0.8 }, transition: 'opacity 0.2s' }}
        >
          <Brand size={36} textVariant="h5" />
        </Box>
        
        <Box
          component="img"
          src={pimage}
          alt="Healthcare Professional"
          sx={{
            width: '100%',
            maxWidth: 500,
            height: 'auto',
            mt: 4,
            filter: 'drop-shadow(0 20px 40px rgba(171, 231, 178, 0.3))'
          }}
        />
        
        <Box sx={{ mt: 4, textAlign: 'center', maxWidth: 400 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b', mb: 2 }}>
            Your Health, Our Priority
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
            Connect with Jayathura LifeCare for seamless pharmacy services and expert medical guidance.
          </Typography>
        </Box>
      </Grid>

      {/* Right side: Login Form */}
      <Grid item xs={12} md={6} sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: '#FFFFFF',
        p: 4
      }}>
        <Container maxWidth="xs">
          <Box sx={{ mb: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: '-1px', mb: 1 }}>
              Welcome back
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
              Please enter your details to access your account.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 4, borderRadius: 3, fontWeight: 600 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                required
                label="Email Address"
                name="email"
                type="email"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined sx={{ color: '#93BFC7' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: '#f8fafc',
                    '&:hover': { bgcolor: '#f1f5f9' },
                  }
                }}
              />

              <Box>
                <TextField
                  fullWidth
                  required
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined sx={{ color: '#93BFC7' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      bgcolor: '#f8fafc',
                      '&:hover': { bgcolor: '#f1f5f9' },
                    }
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Button 
                    onClick={() => navigate('/forgot-password')}
                    sx={{ color: '#93BFC7', fontWeight: 700, textTransform: 'none', fontSize: '0.85rem' }}
                  >
                    Forgot password?
                  </Button>
                </Box>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                sx={{
                  py: 2,
                  borderRadius: 3,
                  bgcolor: '#1e293b',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 10px 25px rgba(30, 41, 59, 0.15)',
                  '&:hover': { bgcolor: '#000', transform: 'translateY(-2px)' },
                  transition: 'all 0.2s'
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Stack>
          </Box>

          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Don't have an account?{' '}
              <Button 
                onClick={() => navigate('/register')}
                sx={{ color: '#93BFC7', fontWeight: 800, textTransform: 'none', p: 0, minWidth: 0, ml: 0.5 }}
              >
                Sign up for free
              </Button>
            </Typography>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};

export default Login;
