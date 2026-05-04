import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Stack, Divider, TextField, Button, CircularProgress, Avatar, Paper, Chip } from '@mui/material';
import { Person, Email, Phone, Save, Edit, AccountCircle } from '@mui/icons-material';
import { useAuth } from '../../contexts/useAuth';
import { pharmacistAPI } from '../../services/api';

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

const PharmacistProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await pharmacistAPI.getProfile();
        setProfile(response.data);
        setFormData({
          name: response.data.name || '',
          phone: response.data.phone || ''
        });
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
      await pharmacistAPI.updateProfile(formData);
      setEditing(false);
      const response = await pharmacistAPI.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
        <CircularProgress sx={{ color: COLORS.blue2 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: COLORS.text }}>Pharmacist Account</Typography>
          <Typography variant="body1" sx={{ color: COLORS.subtext }}>Manage your professional information.</Typography>
        </Box>
        <Button 
          variant={editing ? 'contained' : 'outlined'} 
          startIcon={editing ? <Save /> : <Edit />}
          onClick={editing ? handleUpdate : () => setEditing(true)}
          sx={{ 
            borderRadius: 2.5, 
            px: 3, 
            fontWeight: 700,
            bgcolor: editing ? COLORS.green3 : 'transparent',
            color: editing ? COLORS.text : COLORS.blue2,
            borderColor: editing ? 'transparent' : COLORS.blue2,
            '&:hover': { bgcolor: editing ? COLORS.green2 : 'rgba(122, 168, 176, 0.05)' }
          }}
        >
          {editing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </Box>

      {profile && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, borderRadius: 6, textAlign: 'center', bgcolor: COLORS.green1, border: `1px solid ${COLORS.border}` }}>
              <Box sx={{ width: 140, height: 140, mx: 'auto', mb: 3 }}>
                <Avatar sx={{ width: 140, height: 140, border: '6px solid white', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', bgcolor: COLORS.blue2 }}>
                  <AccountCircle sx={{ fontSize: 100 }} />
                </Avatar>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.text }}>{profile.name}</Typography>
              <Typography variant="body2" sx={{ color: COLORS.subtext, mb: 3 }}>Official Pharmacist</Typography>
              <Chip label={profile.role.toUpperCase()} sx={{ bgcolor: COLORS.text, color: 'white', fontWeight: 700, borderRadius: 2 }} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 4, color: COLORS.text }}>Staff Details</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.blue2, textTransform: 'uppercase' }}>Full Name</Typography>
                    <TextField 
                      fullWidth 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
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
                      value={profile.email} 
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
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default PharmacistProfile;
