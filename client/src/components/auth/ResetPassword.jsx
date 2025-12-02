// client/src/components/auth/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { LocalPharmacy, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import axios from 'axios';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);

  useEffect(() => {
    if (!email) {
      // If no email in state, redirect to forgot password
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth/verify-reset-code`, {
        email,
        code
      });

      if (response.data.verified) {
        setCodeVerified(true);
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!codeVerified) {
      setError('Please verify the code first');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth/reset-password`, {
        email,
        code,
        newPassword
      });

      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login', { state: { message: 'Password reset successful! Please login with your new password.' } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container component="main" maxWidth="sm">
        <PageHeader title="Reset Password" subtitle="Enter verification code and new password" showBack={true} backPath="/login" />
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
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <LocalPharmacy sx={{ color: '#ABE7B2', fontSize: 40, mr: 1 }} />
              <Typography variant="h5" sx={{ color: '#2C3E50', fontWeight: 700 }}>
                Set New Password
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2, backgroundColor: '#ECF4E8' }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ width: '100%', mb: 2, backgroundColor: '#ECF4E8' }}>
                Password reset successful! Redirecting to login...
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                value={email}
                disabled
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#F5F5F5',
                  },
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="code"
                label="Verification Code"
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                disabled={loading || codeVerified || success}
                placeholder="Enter 6-digit code"
                inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: '8px', fontSize: '20px' } }}
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

              {!codeVerified && (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleVerifyCode}
                  disabled={loading || code.length !== 6}
                  sx={{
                    mb: 2,
                    py: 1.5,
                    borderColor: '#ABE7B2',
                    color: '#2C3E50',
                    '&:hover': {
                      borderColor: '#CBF3BB',
                      backgroundColor: '#ECF4E8',
                    },
                  }}
                >
                  Verify Code
                </Button>
              )}

              {codeVerified && (
                <>
                  <Alert severity="success" sx={{ width: '100%', mb: 2, backgroundColor: '#ECF4E8' }}>
                    Code verified! Now set your new password.
                  </Alert>

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="newPassword"
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading || success}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
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
                    label="Confirm New Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading || success}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
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

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading || success}
                    sx={{
                      mt: 2,
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
                    {loading ? 'Resetting...' : success ? 'Password Reset!' : 'Reset Password'}
                  </Button>
                </>
              )}

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
                Back to Login
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default ResetPassword;

