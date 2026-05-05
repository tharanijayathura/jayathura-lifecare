import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Stack, Divider, TextField, Button, CircularProgress, Avatar, Paper, Chip, Card, CardContent } from '@mui/material';
import { Person, Email, Phone, Save, Edit, AccountCircle, VerifiedUser, Security, Badge } from '@mui/icons-material';
import { useAuth } from '../../contexts/useAuth';
import { pharmacistAPI } from '../../services/api';

const PharmacistProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });

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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: COLORS.blue2 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 0 } }}>
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: COLORS.text, mb: 1 }}>
            Staff Identity
          </Typography>
          <Typography sx={{ color: COLORS.subtext, fontWeight: 500 }}>
            Manage your professional credentials and secure portal information
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
          {editing ? 'Save Changes' : 'Edit Credentials'}
        </Button>
      </Box>

      {profile && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Paper elevation={0} sx={{ p: 5, borderRadius: 8, textAlign: 'center', bgcolor: COLORS.green1, border: `1px solid ${COLORS.border}`, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, bgcolor: COLORS.green2, borderRadius: '50%', opacity: 0.3 }} />
                <Box sx={{ width: 160, height: 160, mx: 'auto', mb: 4, position: 'relative' }}>
                  <Avatar sx={{ width: 160, height: 160, border: '8px solid white', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', bgcolor: COLORS.blue2, fontSize: '4rem', fontWeight: 900 }}>
                    {profile.name[0]}
                  </Avatar>
                  <Box sx={{ position: 'absolute', bottom: 10, right: 10, bgcolor: '#059669', color: 'white', p: 1, borderRadius: '50%', border: '4px solid white', display: 'flex' }}>
                    <VerifiedUser fontSize="small" />
                  </Box>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: COLORS.text, mb: 0.5 }}>{profile.name}</Typography>
                <Typography variant="body2" sx={{ color: COLORS.blue2, fontWeight: 800, mb: 3, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.7rem' }}>Licensed Pharmacist</Typography>
                <Chip 
                  label="PORTAL ACCESS ACTIVE" 
                  size="small" 
                  sx={{ bgcolor: COLORS.text, color: 'white', fontWeight: 900, borderRadius: 2, fontSize: '0.65rem', px: 1 }} 
                />
              </Paper>

              <Card elevation={0} sx={{ borderRadius: 6, border: `1px solid ${COLORS.border}`, bgcolor: 'white' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: COLORS.subtext, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>Security</Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Security sx={{ color: COLORS.blue2 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>2FA Enabled</Typography>
                        <Typography variant="caption" sx={{ color: COLORS.subtext }}>Secure access active</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Badge sx={{ color: COLORS.blue2 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>Staff ID: #PH-9921</Typography>
                        <Typography variant="caption" sx={{ color: COLORS.subtext }}>Jayathura LifeCare Staff</Typography>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 5, borderRadius: 8, border: `1px solid ${COLORS.border}`, bgcolor: 'white' }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 5, color: COLORS.text, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Person sx={{ color: COLORS.blue2 }} /> Information Workbench
              </Typography>
              
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Stack spacing={1.5}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: COLORS.subtext, textTransform: 'uppercase', letterSpacing: 1 }}>Full Legal Name</Typography>
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
                          transition: 'all 0.2s'
                        } 
                      }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.5}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: COLORS.subtext, textTransform: 'uppercase', letterSpacing: 1 }}>Work Email</Typography>
                    <TextField 
                      fullWidth 
                      value={profile.email} 
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
                    <Typography variant="caption" sx={{ fontWeight: 800, color: COLORS.subtext, textTransform: 'uppercase', letterSpacing: 1 }}>Direct Contact</Typography>
                    <TextField 
                      fullWidth 
                      value={formData.phone} 
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                      disabled={!editing} 
                      variant="outlined"
                      placeholder="07X XXX XXXX"
                      InputProps={{ 
                        sx: { borderRadius: 4, bgcolor: editing ? 'white' : '#f8fafc', fontWeight: 700 },
                        startAdornment: <Phone sx={{ mr: 1, fontSize: 20, color: editing ? COLORS.blue2 : '#cbd5e1' }} />
                      }}
                    />
                  </Stack>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
                </Grid>

                <Grid item xs={12}>
                   <Typography variant="body2" sx={{ color: COLORS.subtext, textAlign: 'center', fontStyle: 'italic' }}>
                      Profile changes may require administrator approval for security reasons.
                   </Typography>
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
