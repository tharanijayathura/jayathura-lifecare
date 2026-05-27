// client/src/admin/AdminProfile.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Stack, TextField, Button, CircularProgress,
  Avatar, Paper, Chip, Card, CardContent, Divider, Snackbar, Alert
} from '@mui/material';
import { Person, Email, Phone, Save, Edit, AdminPanelSettings, Shield, Badge } from '@mui/icons-material';
import { useAuth } from '../contexts/useAuth';
import { adminAPI } from '../services/api';

const COLORS = {
  amber: '#f59e0b',
  amberLight: '#fef3c7',
  amberDark: '#d97706',
  text: '#1e293b',
  subtext: '#64748b',
  border: 'rgba(245, 158, 11, 0.2)',
};

const AdminProfile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await adminAPI.getProfile();
        setProfile(response.data);
        setFormData({
          name: response.data.name || '',
          phone: response.data.phone || '',
        });
      } catch (error) {
        console.error('Error fetching admin profile:', error);
        // fallback to auth context data
        if (user) {
          setProfile(user);
          setFormData({ name: user.name || '', phone: user.phone || '' });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      setSaving(true);
      const response = await adminAPI.updateProfile(formData);
      setEditing(false);
      const updatedUser = response.data?.user || response.data;
      if (updatedUser) {
        setProfile(updatedUser);
        updateUser({ name: updatedUser.name, phone: updatedUser.phone });
      }
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({ open: true, message: 'Failed to save changes. Please try again.', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: COLORS.amber }} />
        <Typography sx={{ mt: 2, color: COLORS.subtext, fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
          Loading profile…
        </Typography>
      </Box>
    );
  }

  const displayName = formData.name || profile?.name || 'Admin';

  return (
    <Box sx={{ p: { xs: 1, md: 0 } }}>
      {/* Header row */}
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 900, color: COLORS.text, mb: 1, fontFamily: "'Inter', sans-serif" }}
          >
            Admin Profile
          </Typography>
          <Typography sx={{ color: COLORS.subtext, fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
            Manage your administrator credentials and system access details
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : editing ? <Save /> : <Edit />}
          onClick={editing ? handleUpdate : () => setEditing(true)}
          disabled={saving}
          sx={{
            borderRadius: 4, px: 4, py: 1.5, fontWeight: 800,
            fontFamily: "'Inter', sans-serif",
            bgcolor: editing ? COLORS.amber : COLORS.text,
            color: 'white',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
            '&:hover': { bgcolor: editing ? COLORS.amberDark : '#334155' },
          }}
        >
          {saving ? 'Saving…' : editing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Left column — avatar card */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Avatar Card */}
            <Paper
              elevation={0}
              sx={{
                p: 5, borderRadius: 8, textAlign: 'center',
                bgcolor: COLORS.amberLight,
                border: `1px solid ${COLORS.border}`,
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Decorative circles */}
              <Box sx={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, bgcolor: COLORS.amber, borderRadius: '50%', opacity: 0.12 }} />
              <Box sx={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, bgcolor: COLORS.amberDark, borderRadius: '50%', opacity: 0.08 }} />

              <Box sx={{ width: 160, height: 160, mx: 'auto', mb: 4, position: 'relative' }}>
                <Avatar
                  sx={{
                    width: 160, height: 160,
                    border: '8px solid white',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                    bgcolor: COLORS.amber,
                    fontSize: '4rem', fontWeight: 900, color: 'white',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {displayName[0]?.toUpperCase()}
                </Avatar>
                <Box
                  sx={{
                    position: 'absolute', bottom: 10, right: 10,
                    bgcolor: COLORS.amberDark, color: 'white',
                    p: 1, borderRadius: '50%', border: '4px solid white',
                    display: 'flex',
                  }}
                >
                  <Shield fontSize="small" />
                </Box>
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 900, color: COLORS.text, mb: 0.5, fontFamily: "'Inter', sans-serif" }}>
                {displayName}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: COLORS.amberDark, fontWeight: 800, mb: 3, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.7rem', fontFamily: "'Inter', sans-serif" }}
              >
                System Administrator
              </Typography>
              <Chip
                label="FULL ACCESS"
                size="small"
                sx={{ bgcolor: COLORS.text, color: 'white', fontWeight: 900, borderRadius: 2, fontSize: '0.65rem', px: 1, fontFamily: "'Inter', sans-serif" }}
              />
            </Paper>

            {/* Security card */}
            <Card elevation={0} sx={{ borderRadius: 6, border: `1px solid ${COLORS.border}`, bgcolor: 'white' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  sx={{ fontWeight: 800, fontSize: '0.75rem', color: COLORS.subtext, mb: 2, textTransform: 'uppercase', letterSpacing: 1, fontFamily: "'Inter', sans-serif" }}
                >
                  Access Level
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <AdminPanelSettings sx={{ color: COLORS.amber }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>Super Admin Access</Typography>
                      <Typography variant="caption" sx={{ color: COLORS.subtext, fontFamily: "'Inter', sans-serif" }}>Full system control</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Badge sx={{ color: COLORS.amber }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>Staff ID: #AD-0001</Typography>
                      <Typography variant="caption" sx={{ color: COLORS.subtext, fontFamily: "'Inter', sans-serif" }}>Jayathura LifeCare Admin</Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Right column — form */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{ p: 5, borderRadius: 8, border: `1px solid ${COLORS.border}`, bgcolor: 'white' }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 900, mb: 5, color: COLORS.text, display: 'flex', alignItems: 'center', gap: 1.5, fontFamily: "'Inter', sans-serif" }}
            >
              <Person sx={{ color: COLORS.amber }} />
              Account Information
            </Typography>

            <Grid container spacing={4}>
              {/* Full Name */}
              <Grid item xs={12}>
                <Stack spacing={1.5}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: COLORS.subtext, textTransform: 'uppercase', letterSpacing: 1, fontFamily: "'Inter', sans-serif" }}>
                    Full Name
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!editing}
                    variant="outlined"
                    placeholder="Enter your full name"
                    InputProps={{
                      sx: {
                        borderRadius: 4,
                        bgcolor: editing ? 'white' : '#f8fafc',
                        fontWeight: 700,
                        fontFamily: "'Inter', sans-serif",
                        transition: 'all 0.2s',
                      },
                    }}
                  />
                </Stack>
              </Grid>

              {/* Email (read-only) */}
              <Grid item xs={12} sm={6}>
                <Stack spacing={1.5}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: COLORS.subtext, textTransform: 'uppercase', letterSpacing: 1, fontFamily: "'Inter', sans-serif" }}>
                    Email Address
                  </Typography>
                  <TextField
                    fullWidth
                    value={profile?.email || ''}
                    disabled
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 4, bgcolor: '#f8fafc', fontWeight: 600, color: '#94a3b8', fontFamily: "'Inter', sans-serif" },
                      startAdornment: <Email sx={{ mr: 1, fontSize: 20, color: '#cbd5e1' }} />,
                    }}
                  />
                </Stack>
              </Grid>

              {/* Phone */}
              <Grid item xs={12} sm={6}>
                <Stack spacing={1.5}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: COLORS.subtext, textTransform: 'uppercase', letterSpacing: 1, fontFamily: "'Inter', sans-serif" }}>
                    Phone Number
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!editing}
                    variant="outlined"
                    placeholder="07X XXX XXXX"
                    InputProps={{
                      sx: { borderRadius: 4, bgcolor: editing ? 'white' : '#f8fafc', fontWeight: 700, fontFamily: "'Inter', sans-serif" },
                      startAdornment: <Phone sx={{ mr: 1, fontSize: 20, color: editing ? COLORS.amber : '#cbd5e1' }} />,
                    }}
                  />
                </Stack>
              </Grid>

              {/* Role info */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1.5}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: COLORS.subtext, textTransform: 'uppercase', letterSpacing: 1, fontFamily: "'Inter', sans-serif" }}>
                    Role
                  </Typography>
                  <TextField
                    fullWidth
                    value="Administrator"
                    disabled
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 4, bgcolor: '#f8fafc', fontWeight: 700, color: COLORS.amberDark, fontFamily: "'Inter', sans-serif" },
                      startAdornment: <Shield sx={{ mr: 1, fontSize: 20, color: COLORS.amber }} />,
                    }}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: COLORS.subtext, textAlign: 'center', fontStyle: 'italic', fontFamily: "'Inter', sans-serif" }}>
                  Your email address and role cannot be changed from this panel.
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminProfile;
