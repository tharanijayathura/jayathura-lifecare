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
  InputAdornment,
  IconButton,
  Stack,
  Fade,
  CircularProgress
} from '@mui/material';
import { 
  ArrowBack, 
  EmailOutlined, 
  KeyOutlined,
  ChevronRight,
  MarkEmailReadOutlined
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Brand from '../../shared/components/Brand';
import axios from 'axios';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const COLORS = {
    primary: '#1e293b',
    secondary: '#93BFC7',
    accent: '#ABE7B2',
    bg: '#f8fafc',
    text: '#1e293b',
    subtext: '#64748b',
    border: 'rgba(147, 191, 199, 0.25)',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth/forgot-password`, {
        email
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failure.');
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
      fontSize: '0.9rem',
      color: COLORS.subtext,
      '&.Mui-focused': { color: COLORS.secondary }
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(circle at 10% 20%, ${COLORS.accent}10 0%, transparent 40%), 
                    radial-gradient(circle at 90% 80%, ${COLORS.secondary}10 0%, transparent 40%),
                    ${COLORS.bg}`,
        p: 3
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 6,
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 30px 80px rgba(30, 41, 59, 0.08)',
            bgcolor: 'white',
            textAlign: 'center'
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
            <IconButton 
              size="small"
              onClick={() => navigate('/login')}
              sx={{ bgcolor: '#f1f5f9', '&:hover': { bgcolor: COLORS.secondary, color: 'white' } }}
            >
              <ArrowBack fontSize="small" />
            </IconButton>
            <Brand size={22} textVariant="subtitle1" />
          </Stack>

          <Box sx={{ mb: 4 }}>
            <Box sx={{ p: 1.5, borderRadius: '20px', bgcolor: '#ECF4E8', color: COLORS.secondary, display: 'inline-flex', mb: 2 }}>
              <KeyOutlined sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: COLORS.primary, mb: 0.5 }}>
              Recover Access
            </Typography>
            <Typography variant="body2" sx={{ color: COLORS.subtext, fontWeight: 500 }}>
              Enter your email for a secure verification code.
            </Typography>
          </Box>

          <Fade in={!!error || !!success}>
            <Box>
              {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3, fontSize: '0.8rem' }}>{error}</Alert>}
              {success && <Alert icon={<MarkEmailReadOutlined />} severity="success" sx={{ mb: 3, borderRadius: 3, fontSize: '0.8rem' }}>Code sent! Transferring...</Alert>}
            </Box>
          </Fade>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth required label="Registered Email" size="small"
              value={email} onChange={(e) => setEmail(e.target.value)}
              disabled={loading || success} sx={FIELD_SX}
              InputProps={{ startAdornment: (<InputAdornment position="start"><EmailOutlined sx={{ color: COLORS.subtext, fontSize: 18, ml: 1, mr: 1 }} /></InputAdornment>) }}
            />

            <Button
              type="submit" fullWidth variant="contained" disabled={loading || success}
              endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ChevronRight />}
              sx={{
                mt: 3, py: 1.5, borderRadius: 4, bgcolor: COLORS.primary, color: 'white', fontWeight: 800, textTransform: 'none',
                boxShadow: '0 10px 30px rgba(30, 41, 59, 0.15)', '&:hover': { bgcolor: '#000', transform: 'translateY(-1px)' }
              }}
            >
              {loading ? 'Transmitting...' : 'Request Reset Code'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
