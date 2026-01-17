import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Stack, Divider, TextField, Button, CircularProgress } from '@mui/material';
import { useAuth } from '../../../contexts/useAuth';
import { patientAPI } from '../../../services/api';

const PatientProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: {} });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await patientAPI.getDetailedProfile();
        setProfile(response.data);
        if (response.data && response.data.user) {
          setFormData({ name: response.data.user.name || '', phone: response.data.user.phone || '', address: response.data.user.address || {} });
        } else if (response.data && response.data.profile) {
          setFormData({ name: response.data.profile.name || '', phone: response.data.profile.phone || '', address: response.data.profile.address || {} });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      await patientAPI.updateProfile(formData);
      setEditing(false);
      const response = await patientAPI.getDetailedProfile();
      setProfile(response.data);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Your Profile</Typography>
        <Button variant={editing ? 'contained' : 'outlined'} onClick={editing ? handleUpdate : () => setEditing(true)}>
          {editing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </Box>

      {profile && profile.user && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>Personal Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={!editing} variant="outlined" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Email Address" value={profile.user.email || ''} disabled variant="outlined" helperText="Email cannot be changed" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} disabled={!editing} variant="outlined" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Street Address" value={formData.address.street || ''} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })} disabled={!editing} placeholder="Enter your street address" variant="outlined" multiline rows={2} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="City" value={formData.address.city || ''} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })} disabled={!editing} variant="outlined" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Postal Code" value={formData.address.postalCode || ''} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, postalCode: e.target.value } })} disabled={!editing} variant="outlined" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>Account Statistics</Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Orders</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>{profile.stats?.totalOrders || 0}</Typography>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Prescriptions</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>{profile.stats?.totalPrescriptions || 0}</Typography>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Active Refills</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>{profile.stats?.activeRefillPlans || 0}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default PatientProfile;
