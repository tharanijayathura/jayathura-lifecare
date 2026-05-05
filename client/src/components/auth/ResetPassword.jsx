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
  Stack,
  Fade,
  CircularProgress,
  Divider
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  ArrowBack, 
  LockResetOutlined, 
  EmailOutlined, 
  VerifiedUserOutlined,
  LockOutlined,
  ChevronRight,
  CheckCircleOutline
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
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

  const COLORS = {
    primary: '#1e293b',
    secondary: '#93BFC7',
    accent: '#ABE7B2',
    bg: '#f8fafc',
    text: '#1e293b',
    subtext: '#64748b',
    border: 'rgba(147, 191, 199, 0.25)',
  };

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) {
      setError('Identity error: Please enter a valid 6-digit verification code.');
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
      setError(err.response?.data?.message || 'Verification failed. The code provided is invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!codeVerified) {
      setError('Authorization error: Verification code must be validated first.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Security policy: Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Identity error: Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth/reset-password`, {
        email,
        code,
        newPassword
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { state: { message: 'Security update successful. Please re-authenticate.' } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'System error: Unable to update credentials.');
      setLoading(false);
    }
  };

  const FIELD_SX = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 4,
      backgroundColor: '#f1f5f9',
      '& fieldset': { border: 'none' },
      '&:hover': { backgroundColor: '#e2e8f0' },
      '&.Mui-focused': { 
        backgroundColor: '#fff',
        boxShadow: `0 0 0 2px ${COLORS.secondary}`,
      },
    },
    '& .MuiInputLabel-root': {
      fontWeight: 600,
      color: COLORS.subtext,
      '&.Mui-focused': { color: COLORS.secondary }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(circle at 10% 20%, ${COLORS.accent}15 0%, transparent 40%), 
                    radial-gradient(circle at 90% 80%, ${COLORS.secondary}15 0%, transparent 40%),
                    ${COLORS.bg}`,
        p: 3
      }}
    >
      <Container maxWidth="sm">
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Stack direction="row" spacing={1}>
            <IconButton 
              onClick={() => navigate('/forgot-password')}
              sx={{ bgcolor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', '&:hover': { bgcolor: COLORS.secondary, color: 'white' } }}
            >
              <ArrowBack />
            </IconButton>
          </Stack>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: COLORS.secondary, textTransform: 'uppercase', letterSpacing: 1 }}>
              Credential Reset
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: COLORS.primary }}>
              Finalize Security
            </Typography>
          </Box>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 8,
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 40px 100px rgba(30, 41, 59, 0.08)',
            bgcolor: 'white',
            textAlign: 'center'
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Box sx={{ p: 2, borderRadius: '50%', bgcolor: '#ECF4E8', color: COLORS.secondary, display: 'inline-flex', mb: 3 }}>
              <LockResetOutlined sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: COLORS.primary, mb: 1 }}>
              Set New Credentials
            </Typography>
            <Typography sx={{ color: COLORS.subtext, fontWeight: 500 }}>
              Verify your identity and define your new high-security access code.
            </Typography>
          </Box>

          <Fade in={!!error || !!success}>
            <Box>
              {error && (
                <Alert severity="error" variant="filled" sx={{ mb: 4, borderRadius: 4, bgcolor: '#ef4444' }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert icon={<CheckCircleOutline />} severity="success" variant="filled" sx={{ mb: 4, borderRadius: 4, bgcolor: '#10b981' }}>
                  Update complete! Initializing login portal...
                </Alert>
              )}
            </Box>
          </Fade>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Verified Target"
              value={email}
              disabled
              sx={{ ...FIELD_SX, mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined sx={{ color: COLORS.subtext, ml: 1, mr: 1 }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              required
              label="6-Digit Code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              disabled={loading || codeVerified || success}
              sx={{ ...FIELD_SX, mb: 3 }}
              inputProps={{ 
                maxLength: 6, 
                style: { textAlign: 'center', letterSpacing: '8px', fontSize: '24px', fontWeight: 900, color: COLORS.primary } 
              }}
            />

            {!codeVerified ? (
              <Button
                fullWidth
                variant="contained"
                onClick={handleVerifyCode}
                disabled={loading || code.length !== 6}
                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <VerifiedUserOutlined />}
                sx={{
                  py: 1.8,
                  borderRadius: 5,
                  backgroundColor: COLORS.secondary,
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '1rem',
                  '&:hover': { backgroundColor: COLORS.primary, transform: 'translateY(-2px)' },
                }}
              >
                {loading ? 'Verifying...' : 'Validate Code'}
              </Button>
            ) : (
              <Fade in={codeVerified}>
                <Stack spacing={3}>
                  <Alert severity="success" sx={{ borderRadius: 4, textAlign: 'left', bgcolor: '#ECF4E8', color: COLORS.primary, fontWeight: 700 }}>
                    Verification successful.
                  </Alert>
                  
                  <TextField
                    fullWidth
                    required
                    label="New Access Code"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading || success}
                    sx={FIELD_SX}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined sx={{ color: COLORS.subtext, ml: 1, mr: 1 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ mr: 1 }}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    required
                    label="Confirm Access Code"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading || success}
                    sx={FIELD_SX}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" sx={{ mr: 1 }}>
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading || success}
                    endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ChevronRight />}
                    sx={{
                      py: 2,
                      borderRadius: 5,
                      backgroundColor: COLORS.primary,
                      color: 'white',
                      fontWeight: 800,
                      fontSize: '1rem',
                      boxShadow: '0 20px 40px rgba(30, 41, 59, 0.2)',
                      '&:hover': { backgroundColor: '#000', transform: 'translateY(-2px)' },
                    }}
                  >
                    {loading ? 'Updating Credentials...' : 'Finalize Password Update'}
                  </Button>
                </Stack>
              </Fade>
            )}

            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/login')}
              sx={{
                mt: 2,
                color: COLORS.subtext,
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': { bgcolor: 'transparent', color: COLORS.secondary },
              }}
            >
              Back to login portal
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword;
