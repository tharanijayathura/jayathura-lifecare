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
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack, Home } from '@mui/icons-material';
import Brand from '../../shared/components/Brand';
import { useAuth } from '../../contexts/useAuth';
import { useNavigate } from 'react-router-dom';

// ✅ add your doctor image (prefer .png with transparent bg)
import pimage from '../../assets/pimage.png'; // change if your file is .jpg

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

      // Redirect based on role
      const redirectPaths = {
        patient: '/patient',
        pharmacist: '/pharmacist',
        admin: '/admin',
        delivery: '/delivery',
      };

      navigate(redirectPaths[userData.role] || '/patient');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  const FIELD_SX = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: '#FFFFFF',
      '&:hover fieldset': { borderColor: '#93BFC7' },
      '&.Mui-focused fieldset': { borderColor: '#93BFC7' },
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 3, md: 5 },
        background: 'linear-gradient(135deg, #ECF4E8 0%, #CBF3BB 55%, #ABE7B2 100%)',
      }}
    >
      <Container maxWidth="md">
        {/* Top actions */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' } }}
          >
            <ArrowBack />
          </IconButton>
          <IconButton
            onClick={() => navigate('/')}
            sx={{ bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' } }}
          >
            <Home />
          </IconButton>

          <Box sx={{ ml: 'auto', textAlign: 'right' }}>
            <Typography sx={{ fontSize: { xs: '1.25rem', md: '1.6rem' }, fontWeight: 600, color: '#2C3E50' }}>
              Login
            </Typography>
            <Typography variant="body2" sx={{ color: '#546E7A' }}>
              Welcome back to Jayathura LifeCare
            </Typography>
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid rgba(171, 231, 178, 0.35)',
            boxShadow: '0 18px 50px rgba(44,62,80,0.12)',
            backgroundColor: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Grid container>
            {/* Left image panel */}
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                position: 'relative',
                minHeight: { xs: 220, md: 520 },
                background: 'linear-gradient(180deg, rgba(147,191,199,0.18) 0%, rgba(171,231,178,0.18) 100%)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                p: { xs: 2, md: 3 },
              }}
            >
              <Box
                component="img"
                src={pimage}
                alt="Doctor"
                sx={{
                  width: { xs: 260, md: 320 }, // ✅ a bit larger
                  maxWidth: '90%',
                  height: 'auto',
                  filter: 'drop-shadow(0 18px 30px rgba(44,62,80,0.18))',
                  position: 'relative',
                  bottom: { xs: -10, md: -28 },
                }}
              />
            </Grid>

            {/* Right form */}
            <Grid item xs={12} md={7} sx={{ p: { xs: 3, md: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 }}>
                <Brand size={28} textVariant="h6" />
              </Box>

              <Typography sx={{ color: '#2C3E50', fontWeight: 600, mb: 0.5 }}>
                Sign in to your account
              </Typography>
              <Typography variant="body2" sx={{ color: '#546E7A', mb: 2 }}>
                Manage prescriptions, track orders, and chat with pharmacists.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2, backgroundColor: '#FFEBEE' }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  required
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  sx={{ ...FIELD_SX, mb: 2 }}
                />

                <TextField
                  fullWidth
                  required
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  sx={{ ...FIELD_SX, mb: 1 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((v) => !v)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  fullWidth
                  variant="text"
                  onClick={() => navigate('/forgot-password')}
                  sx={{
                    justifyContent: 'flex-end',
                    color: '#93BFC7',
                    textTransform: 'none',
                    mt: 0.5,
                    mb: 2,
                    '&:hover': { backgroundColor: 'rgba(236,244,232,0.9)' },
                  }}
                >
                  Forgot password?
                </Button>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    backgroundColor: '#93BFC7',
                    color: '#fff',
                    fontWeight: 600,
                    boxShadow: '0 10px 22px rgba(147, 191, 199, 0.28)',
                    '&:hover': { backgroundColor: '#7AA8B0' },
                    '&:disabled': { backgroundColor: '#ECF4E8', color: '#93BFC7' },
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>

                <Divider sx={{ my: 2.5, borderColor: 'rgba(147,191,199,0.35)' }} />

                <Button
                  fullWidth
                  variant="text"
                  onClick={() => navigate('/register')}
                  sx={{
                    color: '#93BFC7',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: 'rgba(236,244,232,0.9)' },
                  }}
                >
                  Don&apos;t have an account? Create one
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
