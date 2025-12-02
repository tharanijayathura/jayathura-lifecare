// client/src/components/auth/ForgotPassword.jsx
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Paper,
  Container,
} from '@mui/material';
import { LocalPharmacy, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import axios from 'axios';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth/forgot-password`, {
        email
      });

      // Do not display the verification code in the UI. In development the server logs it to the server console.
      if (response.data.code) {
        console.log('🔑 Verification Code (Development):', response.data.code);
      }

      setSuccess(true);
      // Navigate to reset password page after 2 seconds
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 2000);
    } catch (err) {
      console.error('Forgot password error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send verification code. Please try again.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container component="main" maxWidth="sm">
        <PageHeader title="Forgot Password" subtitle="Enter your email to receive a verification code" showBack={true} backPath="/login" />
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
                Reset Password
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: '#546E7A', mb: 3, textAlign: 'center' }}>
              Enter your email address and we'll send you a verification code to reset your password.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2, backgroundColor: '#ECF4E8' }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ width: '100%', mb: 2, backgroundColor: '#ECF4E8' }}>
                Verification code sent! Redirecting to reset password page...
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
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || success}
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
                {loading ? 'Sending...' : success ? 'Code Sent!' : 'Send Verification Code'}
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
                Back to Login
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default ForgotPassword;

