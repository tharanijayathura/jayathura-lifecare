import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Stack, Divider, TextField, Button, CircularProgress, Avatar, IconButton, Paper, Alert, Snackbar, Chip } from '@mui/material';
import { PhotoCamera, Person, Email, Phone, LocationOn, Save, Edit, AccountCircle, History, ReceiptLong, LocalHospital } from '@mui/icons-material';
import { useAuth } from '../../../contexts/useAuth';
import { patientAPI } from '../../../services/api';

const PatientProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '', address: {}, image: '' });
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const COLORS = {
    green1: '#ECF4E8',
    green2: '#CBF3BB',
    green3: '#ABE7B2',
    blue1: '#93BFC7',
    blue2: '#7AA8B0',
    text: '#1e293b',
    subtext: '#64748b',
    border: 'rgba(147, 191, 199, 0.25)',
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await patientAPI.getDetailedProfile();
        
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
        console.error('PatientProfile error:', err);
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
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: COLORS.blue2 }} />
        <Typography sx={{ mt: 2, color: COLORS.subtext, fontWeight: 600 }}>Syncing profile data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 0 } }}>
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: COLORS.text, mb: 1 }}>
            Personal Health Profile
          </Typography>
          <Typography sx={{ color: COLORS.subtext, fontWeight: 500 }}>
            Manage your personal information, delivery addresses, and health records
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={editing ? <Save /> : <Edit />}
          onClick={editing ? handleUpdate : () => setEditing(true)}
          sx={{ 
            borderRadius: 4, 
            px: 4, 
            py: 1.5,
            fontWeight: 800,
            bgcolor: editing ? COLORS.green3 : COLORS.blue2,
            color: editing ? COLORS.text : 'white',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
            '&:hover': { bgcolor: editing ? COLORS.green2 : COLORS.blue1 }
          }}
        >
          {editing ? 'Save Profile' : 'Edit Information'}
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 4, fontWeight: 600 }}>
          {error}
        </Alert>
      )}

      {profile && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Paper elevation={0} sx={{ p: 5, borderRadius: 8, textAlign: 'center', bgcolor: COLORS.green1, border: `1px solid ${COLORS.border}`, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: -30, left: -30, width: 120, height: 120, bgcolor: COLORS.green2, borderRadius: '50%', opacity: 0.2 }} />
                <Box sx={{ position: 'relative', width: 160, height: 160, mx: 'auto', mb: 4 }}>
                  <Avatar src={imagePreview} sx={{ width: 160, height: 160, border: '8px solid white', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', bgcolor: COLORS.blue2, fontSize: '4rem', fontWeight: 900 }}>
                    {formData.firstName[0]}
                  </Avatar>
                  {editing && (
                    <Box sx={{ position: 'absolute', bottom: 10, right: 10 }}>
                      <input id="profile-image-upload" hidden accept="image/*" type="file" onChange={handleImageChange} />
                      <label htmlFor="profile-image-upload">
                        <IconButton component="span" sx={{ bgcolor: COLORS.text, color: 'white', p: 1.5, boxShadow: '0 4px 12px rgba(0,0,0,0.2)', border: '3px solid white', '&:hover': { bgcolor: '#000' } }}>
                          <PhotoCamera fontSize="small" />
                        </IconButton>
                      </label>
                    </Box>
                  )}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: COLORS.text, mb: 0.5 }}>{formData.firstName} {formData.lastName}</Typography>
                <Typography variant="body2" sx={{ color: COLORS.subtext, fontWeight: 500, mb: 3 }}>
                  Patient Account • Since {profile.user?.createdAt ? new Date(profile.user.createdAt).getFullYear() : '2024'}
                </Typography>
                <Chip label="VERIFIED ACCOUNT" size="small" sx={{ bgcolor: COLORS.text, color: 'white', fontWeight: 900, borderRadius: 2, fontSize: '0.65rem' }} />
              </Paper>

              <Card elevation={0} sx={{ borderRadius: 8, border: `1px solid ${COLORS.border}`, bgcolor: 'white' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: COLORS.blue2, mb: 3, textTransform: 'uppercase', letterSpacing: 1 }}>Health Activity Summary</Typography>
                  <Stack spacing={3}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: COLORS.green1, color: COLORS.blue2 }}><History fontSize="small" /></Box>
                        <Typography variant="body2" sx={{ color: COLORS.text, fontWeight: 700 }}>Orders Placed</Typography>
                      </Stack>
                      <Typography variant="h6" sx={{ fontWeight: 900 }}>{profile.stats?.totalOrders || 0}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: COLORS.green1, color: COLORS.blue2 }}><ReceiptLong fontSize="small" /></Box>
                        <Typography variant="body2" sx={{ color: COLORS.text, fontWeight: 700 }}>Prescriptions</Typography>
                      </Stack>
                      <Typography variant="h6" sx={{ fontWeight: 900 }}>{profile.stats?.totalPrescriptions || 0}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: COLORS.green1, color: COLORS.blue2 }}><LocalHospital fontSize="small" /></Box>
                        <Typography variant="body2" sx={{ color: COLORS.text, fontWeight: 700 }}>Active Refills</Typography>
                      </Stack>
                      <Typography variant="h6" sx={{ fontWeight: 900 }}>{profile.stats?.activeRefillPlans || 0}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 5, borderRadius: 8, border: `1px solid ${COLORS.border}`, bgcolor: 'white' }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 5, color: COLORS.text, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Person sx={{ color: COLORS.blue2 }} /> Identity & Contact
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.5}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: COLORS.subtext, textTransform: 'uppercase', letterSpacing: 1 }}>First Name</Typography>
                    <TextField 
                      fullWidth 
                      value={formData.firstName} 
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
                      disabled={!editing} 
                      variant="outlined"
                      InputProps={{ sx: { borderRadius: 4, bgcolor: editing ? 'white' : '#f8fafc', fontWeight: 700 } }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.5}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: COLORS.subtext, textTransform: 'uppercase', letterSpacing: 1 }}>Last Name</Typography>
                    <TextField 
                      fullWidth 
                      value={formData.lastName} 
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} 
                      disabled={!editing} 
                      variant="outlined"
                      InputProps={{ sx: { borderRadius: 4, bgcolor: editing ? 'white' : '#f8fafc', fontWeight: 700 } }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.5}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: COLORS.subtext, textTransform: 'uppercase', letterSpacing: 1 }}>Email Address</Typography>
                    <TextField 
                      fullWidth 
                      value={profile.user?.email || ''} 
                      disabled 
                      variant="outlined"
                      InputProps={{ 
                        sx: { borderRadius: 4, bgcolor: '#f8fafc', fontWeight: 600, color: '#94a3b8' },
                        startAdornment: <Email sx={{ mr: 1, fontSize: 20, color: '#cbd5e1' }} />
                      }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.5}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: COLORS.subtext, textTransform: 'uppercase', letterSpacing: 1 }}>Mobile Number</Typography>
                    <TextField 
                      fullWidth 
                      value={formData.phone} 
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                      disabled={!editing} 
                      variant="outlined"
                      InputProps={{ 
                        sx: { borderRadius: 4, bgcolor: editing ? 'white' : '#f8fafc', fontWeight: 700 },
                        startAdornment: <Phone sx={{ mr: 1, fontSize: 20, color: editing ? COLORS.blue2 : '#cbd5e1' }} />
                      }}
                    />
                  </Stack>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ mt: 5, mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: COLORS.text, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <LocationOn sx={{ color: COLORS.blue2 }} /> Delivery Address
                    </Typography>
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Stack spacing={1.5}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: COLORS.subtext, textTransform: 'uppercase', letterSpacing: 1 }}>Street / Landmark</Typography>
                    <TextField 
                      fullWidth 
                      value={formData.address?.street || ''} 
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })} 
                      disabled={!editing} 
                      variant="outlined"
                      multiline
                      rows={2}
                      InputProps={{ sx: { borderRadius: 4, bgcolor: editing ? 'white' : '#f8fafc', fontWeight: 700 } }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.5}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: COLORS.subtext, textTransform: 'uppercase', letterSpacing: 1 }}>City</Typography>
                    <TextField 
                      fullWidth 
                      value={formData.address?.city || ''} 
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })} 
                      disabled={!editing} 
                      variant="outlined"
                      InputProps={{ sx: { borderRadius: 4, bgcolor: editing ? 'white' : '#f8fafc', fontWeight: 700 } }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.5}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: COLORS.subtext, textTransform: 'uppercase', letterSpacing: 1 }}>Postal Code</Typography>
                    <TextField 
                      fullWidth 
                      value={formData.address?.postalCode || ''} 
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, postalCode: e.target.value } })} 
                      disabled={!editing} 
                      variant="outlined"
                      InputProps={{ sx: { borderRadius: 4, bgcolor: editing ? 'white' : '#f8fafc', fontWeight: 700 } }}
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
