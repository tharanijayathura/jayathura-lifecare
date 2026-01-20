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
  InputAdornment,
  IconButton,
  Grid,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack, Home } from '@mui/icons-material';
import Brand from '../../shared/components/Brand';
import { useAuth } from '../../contexts/useAuth';
import { useNavigate } from 'react-router-dom';

// ✅ transparent doctor image
import pimage from '../../assets/pimage.png';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    phone: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    // Password validation: at least 8 chars, one uppercase, one lowercase, one special char
    const password = formData.password;
    const passwordRequirements = [
      { test: /.{8,}/, message: 'Password must be at least 8 characters.' },
      { test: /[A-Z]/, message: 'Password must contain at least one uppercase letter.' },
      { test: /[a-z]/, message: 'Password must contain at least one lowercase letter.' },
      { test: /[@$!%*?&#^()_+=\-]/, message: 'Password must contain at least one special character (e.g. @, #, $).' },
    ];
    for (const req of passwordRequirements) {
      if (!req.test.test(password)) {
        setError(req.message);
        setLoading(false);
        return;
      }
    }

    try {
      const { confirmPassword, firstName, lastName, ...rest } = formData;
      const registerData = {
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        ...rest
      };
      const result = await register(registerData);

      setSuccess(
        result?.isApproved
          ? 'Registration successful! You can now sign in.'
          : 'Registration successful! Your account is pending approval.'
      );

      setTimeout(() => navigate('/login'), 1400);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const FIELD_SX = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: '#FFFFFF',
      '&:hover fieldset': { borderColor: '#ABE7B2' },
      '&.Mui-focused fieldset': { borderColor: '#ABE7B2' },
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
        {/* Top bar - aligned with Login */}
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
              Register
            </Typography>
            <Typography variant="body2" sx={{ color: '#546E7A' }}>
              Create your account to get started
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
                  width: { xs: 260, md: 320 },
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
                Create your account
              </Typography>
              <Typography variant="body2" sx={{ color: '#546E7A', mb: 2 }}>
                Join Jayathura LifeCare and manage your health easily.
              </Typography>

              {(error || success) && (
                <Alert
                  severity={error ? 'error' : 'success'}
                  sx={{ mb: 2, borderRadius: 2, backgroundColor: error ? '#FFEBEE' : '#E8F5E9' }}
                >
                  {error || success}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      sx={FIELD_SX}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      sx={FIELD_SX}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      sx={FIELD_SX}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      sx={FIELD_SX}
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
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      sx={FIELD_SX}
                      error={formData.confirmPassword !== '' && formData.password !== formData.confirmPassword}
                      helperText={
                        formData.confirmPassword !== '' && formData.password !== formData.confirmPassword
                          ? 'Passwords do not match'
                          : ' '
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowConfirmPassword((v) => !v)} edge="end">
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      sx={FIELD_SX}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      select
                      label="Role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      sx={FIELD_SX}
                    >
                      <MenuItem value="patient">Patient</MenuItem>
                      <MenuItem value="pharmacist">Pharmacist</MenuItem>
                      <MenuItem value="delivery">Delivery Person</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
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
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2.5, borderColor: 'rgba(147,191,199,0.35)' }} />

                <Button
                  fullWidth
                  variant="text"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: '#93BFC7',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: 'rgba(236,244,232,0.9)' },
                  }}
                >
                  Already have an account? Sign In
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
