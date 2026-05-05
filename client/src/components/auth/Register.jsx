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
  Stack,
  CircularProgress
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  PersonOutline, 
  EmailOutlined, 
  LockOutlined, 
  PhoneOutlined, 
  WorkOutline,
  ArrowForward
} from '@mui/icons-material';
import Brand from '../../shared/components/Brand';
import { useAuth } from '../../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
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
      setError('Registration Error: Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, firstName, lastName, ...rest } = formData;
      const registerData = {
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        ...rest
      };
      const result = await register(registerData);
      setSuccess(result?.isApproved ? 'Identity verified! Redirecting to login...' : 'Credentials submitted for approval.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'System error. Please verify your details.');
      setLoading(false);
    }
  };

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Left side: Image and Branding */}
      <Grid item xs={12} md={5} lg={4} sx={{ 
        bgcolor: '#ECF4E8', 
        display: { xs: 'none', md: 'flex' }, 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        position: 'relative',
        minHeight: '100vh'
      }}>
        <Box 
          onClick={() => navigate('/')}
          sx={{ position: 'absolute', top: 40, left: 40, cursor: 'pointer', '&:hover': { opacity: 0.8 }, transition: 'opacity 0.2s' }}
        >
          <Brand size={32} textVariant="h6" />
        </Box>
        
        <Box
          component="img"
          src={pimage}
          alt="Healthcare Professional"
          sx={{
            width: '100%',
            maxWidth: 400,
            height: 'auto',
            filter: 'drop-shadow(0 20px 40px rgba(171, 231, 178, 0.3))'
          }}
        />
        
        <Box sx={{ mt: 4, textAlign: 'center', maxWidth: 350 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#1e293b', mb: 1.5 }}>
            Join our Community
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, lineHeight: 1.6 }}>
            Gain access to personalized healthcare, real-time prescription tracking, and professional support.
          </Typography>
        </Box>
      </Grid>

      {/* Right side: Register Form */}
      <Grid item xs={12} md={7} lg={8} sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: '#FFFFFF',
        p: { xs: 3, md: 6 },
        overflowY: 'auto'
      }}>
        <Container maxWidth="sm">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: '-1px', mb: 1 }}>
              Create account
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
              Start your journey with Jayathura LifeCare.
            </Typography>
          </Box>

          {(error || success) && (
            <Alert severity={error ? 'error' : 'success'} sx={{ mb: 3, borderRadius: 3, fontWeight: 600 }}>
              {error || success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth required label="First Name" name="firstName"
                  value={formData.firstName} onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth required label="Last Name" name="lastName"
                  value={formData.lastName} onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth required label="Email Address" name="email" type="email"
                  value={formData.email} onChange={handleChange}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><EmailOutlined sx={{ color: '#93BFC7' }} /></InputAdornment>) }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth required label="Password" name="password" type={showPassword ? 'text' : 'password'}
                  value={formData.password} onChange={handleChange}
                  InputProps={{
                    startAdornment: (<InputAdornment position="start"><LockOutlined sx={{ color: '#93BFC7' }} /></InputAdornment>),
                    endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end"><Visibility fontSize="small" /></IconButton></InputAdornment>)
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth required label="Confirm Password" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword} onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth required label="Phone Number" name="phone"
                  value={formData.phone} onChange={handleChange}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneOutlined sx={{ color: '#93BFC7' }} /></InputAdornment>) }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth required select label="Register as" name="role"
                  value={formData.role} onChange={handleChange}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><WorkOutline sx={{ color: '#93BFC7' }} /></InputAdornment>) }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
                >
                  <MenuItem value="patient">Patient</MenuItem>
                  <MenuItem value="pharmacist">Pharmacist</MenuItem>
                  <MenuItem value="delivery">Delivery Person</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="submit" fullWidth variant="contained" disabled={loading}
                  endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                  sx={{
                    py: 2, borderRadius: 3, bgcolor: '#1e293b', color: '#FFFFFF', fontWeight: 800, fontSize: '1rem',
                    textTransform: 'none', boxShadow: '0 10px 25px rgba(30, 41, 59, 0.15)',
                    '&:hover': { bgcolor: '#000', transform: 'translateY(-2px)' }, transition: 'all 0.2'
                  }}
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Already have an account?{' '}
              <Button 
                onClick={() => navigate('/login')}
                sx={{ color: '#93BFC7', fontWeight: 800, textTransform: 'none', p: 0, minWidth: 0, ml: 0.5 }}
              >
                Log in
              </Button>
            </Typography>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};

export default Register;
