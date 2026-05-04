import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Stack, Divider, TextField, Button, CircularProgress, Avatar, IconButton, Paper, Alert, Snackbar } from '@mui/material';
import { PhotoCamera, Person, Email, Phone, LocationOn, Save, Edit, AccountCircle } from '@mui/icons-material';
import { useAuth } from '../../../contexts/useAuth';
import { patientAPI } from '../../../services/api';

const COLORS = {
  green1: '#ECF4E8',
  green2: '#CBF3BB',
  green3: '#ABE7B2',
  blue1: '#93BFC7',
  blue2: '#7AA8B0',
  text: '#2C3E50',
  subtext: '#546E7A',
  border: 'rgba(147, 191, 199, 0.35)',
};

const PatientProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '', address: {}, image: '' });
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('DEBUG: PatientProfile fetching data...');
        const response = await patientAPI.getDetailedProfile();
        console.log('DEBUG: PatientProfile data received:', response.data);
        
        if (!response.data || !response.data.user) {
          throw new Error('Profile data was not returned by the server');
        }
        
        const userData = response.data.user;
        setProfile(response.data);
        
        let firstName = '', lastName = '';
        if (userData.name) {
          const nameParts = userData.name.split(' ');
          firstName = nameParts[0] || '';
          lastName = nameParts.slice(1).join(' ') || '';
        }

        setFormData({
          firstName,
          lastName,
          phone: userData.phone || '',
          address: userData.address || {},
          image: userData.image || ''
        });
        setImagePreview(userData.image || '');
      } catch (err) {
        console.error('DEBUG: PatientProfile error:', err);
        setError(err.message || 'Failed to connect to the server');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const dataToSend = { ...formData };
      if (formData.image && typeof formData.image !== 'string') {
        const form = new FormData();
        Object.entries(dataToSend).forEach(([key, value]) => {
          if (key === 'address') {
            form.append('address', JSON.stringify(value));
          } else {
            form.append(key, value);
          }
        });
        await patientAPI.updateProfile(form);
      } else {
        await patientAPI.updateProfile(dataToSend);
      }
      setEditing(false);
      const response = await patientAPI.getDetailedProfile();
      setProfile(response.data);
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to save profile changes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: COLORS.text }}>My Profile</Typography>
          <Typography variant="body2" sx={{ color: COLORS.subtext }}>View and manage your account information</Typography>
        </Box>
        <Button 
          variant={editing ? "contained" : "outlined"}
          startIcon={editing ? <Save /> : <Edit />}
          onClick={editing ? handleUpdate : () => setEditing(true)}
          sx={{ borderRadius: 3 }}
        >
          {editing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      {profile && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Paper sx={{ p: 4, borderRadius: 6, textAlign: 'center', bgcolor: COLORS.green1, border: `1px solid ${COLORS.border}` }}>
                <Box sx={{ position: 'relative', width: 140, height: 140, mx: 'auto', mb: 3 }}>
                  <Avatar src={imagePreview} sx={{ width: 140, height: 140, border: '6px solid white', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                    <AccountCircle sx={{ fontSize: 100 }} />
                  </Avatar>
                  {editing && (
                    <Box sx={{ position: 'absolute', bottom: 5, right: 5 }}>
                      <input id="profile-image-upload" hidden accept="image/*" type="file" onChange={handleImageChange} />
                      <label htmlFor="profile-image-upload">
                        <IconButton component="span" sx={{ bgcolor: COLORS.blue2, color: 'white', p: 1, boxShadow: 3, '&:hover': { bgcolor: COLORS.blue1 } }}>
                          <PhotoCamera />
                        </IconButton>
                      </label>
                    </Box>
                  )}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.text }}>{formData.firstName} {formData.lastName}</Typography>
                <Typography variant="body2" sx={{ color: COLORS.subtext, mb: 3 }}>
                  Member since {profile.user?.createdAt ? new Date(profile.user.createdAt).getFullYear() : new Date().getFullYear()}
                </Typography>
                <Chip label="Patient" sx={{ bgcolor: COLORS.text, color: 'white', fontWeight: 700, borderRadius: 2 }} />
              </Paper>

              <Paper sx={{ p: 4, borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: COLORS.text }}>Activity</Typography>
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: COLORS.subtext, fontWeight: 600 }}>Total Orders</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>{profile.stats?.totalOrders || 0}</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: COLORS.subtext, fontWeight: 600 }}>Prescriptions</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>{profile.stats?.totalPrescriptions || 0}</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: COLORS.subtext, fontWeight: 600 }}>Active Refills</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>{profile.stats?.activeRefillPlans || 0}</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 4, color: COLORS.text }}>Personal Details</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.blue2, textTransform: 'uppercase' }}>First Name</Typography>
                    <TextField 
                      fullWidth 
                      value={formData.firstName} 
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
                      disabled={!editing} 
                      variant="outlined"
                      InputProps={{ sx: { borderRadius: 3, bgcolor: editing ? 'transparent' : 'rgba(0,0,0,0.02)' } }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.blue2, textTransform: 'uppercase' }}>Last Name</Typography>
                    <TextField 
                      fullWidth 
                      value={formData.lastName} 
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} 
                      disabled={!editing} 
                      variant="outlined"
                      InputProps={{ sx: { borderRadius: 3, bgcolor: editing ? 'transparent' : 'rgba(0,0,0,0.02)' } }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.blue2, textTransform: 'uppercase' }}>Email Address</Typography>
                    <TextField 
                      fullWidth 
                      value={profile.user?.email || ''} 
                      disabled 
                      variant="outlined"
                      InputProps={{ sx: { borderRadius: 3, bgcolor: 'rgba(0,0,0,0.02)' } }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.blue2, textTransform: 'uppercase' }}>Phone Number</Typography>
                    <TextField 
                      fullWidth 
                      value={formData.phone} 
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                      disabled={!editing} 
                      variant="outlined"
                      InputProps={{ sx: { borderRadius: 3, bgcolor: editing ? 'transparent' : 'rgba(0,0,0,0.02)' } }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: COLORS.text }}>Address Details</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.blue2, textTransform: 'uppercase' }}>Street Address</Typography>
                    <TextField 
                      fullWidth 
                      value={formData.address?.street || ''} 
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })} 
                      disabled={!editing} 
                      variant="outlined"
                      multiline
                      rows={2}
                      InputProps={{ sx: { borderRadius: 3, bgcolor: editing ? 'transparent' : 'rgba(0,0,0,0.02)' } }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.blue2, textTransform: 'uppercase' }}>City</Typography>
                    <TextField 
                      fullWidth 
                      value={formData.address?.city || ''} 
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })} 
                      disabled={!editing} 
                      variant="outlined"
                      InputProps={{ sx: { borderRadius: 3, bgcolor: editing ? 'transparent' : 'rgba(0,0,0,0.02)' } }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.blue2, textTransform: 'uppercase' }}>Postal Code</Typography>
                    <TextField 
                      fullWidth 
                      value={formData.address?.postalCode || ''} 
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, postalCode: e.target.value } })} 
                      disabled={!editing} 
                      variant="outlined"
                      InputProps={{ sx: { borderRadius: 3, bgcolor: editing ? 'transparent' : 'rgba(0,0,0,0.02)' } }}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default PatientProfile;
