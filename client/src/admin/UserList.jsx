// client/src/admin/UserList.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Stack, 
  Button, 
  CircularProgress, 
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Avatar,
  Divider,
  Tooltip
} from '@mui/material';
import { 
  Search, 
  Clear, 
  Delete, 
  CheckCircle, 
  Cancel, 
  Phone, 
  Mail, 
  CalendarMonth,
  AdminPanelSettings,
  LocalPharmacy,
  LocalShipping,
  Person,
  VerifiedUser,
  ReportProblem,
  LocationOn
} from '@mui/icons-material';
import { adminAPI } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

const UserList = () => {
  const { showNotification, confirmAction } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState(0); // 0: All, 1: Patients, 2: Pharmacists, 3: Delivery, 4: Admins, 5: Pending Approval

  const COLORS = {
    bg1: '#ECF4E8',
    bg2: '#CBF3BB',
    border: 'rgba(147, 191, 199, 0.35)',
    admin: '#1E293B',
    pharmacist: '#8B5CF6',
    delivery: '#F97316',
    patient: '#0D9488',
    text: '#2C3E50',
    subtext: '#546E7A',
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Unable to load users registry.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchUsers(); 
  }, []);

  const handleRemoveUser = async (userId, userName) => {
    const confirmed = await confirmAction(
      `Are you sure you want to remove user "${userName}"? This action cannot be undone.`,
      { title: 'Remove User Account', danger: true }
    );
    if (!confirmed) return;
    setLoading(true);
    try {
      await adminAPI.removeUser(userId);
      showNotification(`User "${userName}" has been successfully removed.`, { type: 'success' });
      await fetchUsers();
    } catch (err) {
      console.error('Remove user error:', err);
      showNotification(err.response?.data?.message || 'Failed to remove user account.', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId, userName) => {
    try {
      setLoading(true);
      await adminAPI.approveUser(userId);
      showNotification(`Account "${userName}" approved successfully!`, { type: 'success' });
      await fetchUsers();
    } catch (err) {
      console.error('Approve user error:', err);
      showNotification('Failed to approve user.', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectUser = async (userId, userName) => {
    const confirmed = await confirmAction(
      `Are you sure you want to reject and delete request for "${userName}"?`,
      { title: 'Reject Signup Request', danger: true }
    );
    if (!confirmed) return;
    try {
      setLoading(true);
      await adminAPI.rejectUser(userId);
      showNotification(`Account request for "${userName}" has been rejected and removed.`, { type: 'warning' });
      await fetchUsers();
    } catch (err) {
      console.error('Reject user error:', err);
      showNotification('Failed to reject user request.', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Filter & Search computation
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = 
        (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.phone && u.phone.includes(searchQuery));

      let matchesTab = true;
      if (selectedTab === 1) matchesTab = u.role === 'patient';
      else if (selectedTab === 2) matchesTab = u.role === 'pharmacist';
      else if (selectedTab === 3) matchesTab = u.role === 'delivery';
      else if (selectedTab === 4) matchesTab = u.role === 'admin';
      else if (selectedTab === 5) matchesTab = u.isApproved === false;

      return matchesSearch && matchesTab;
    });
  }, [users, searchQuery, selectedTab]);

  const getRoleTheme = (role) => {
    switch (role) {
      case 'admin': return { bg: '#F1F5F9', color: COLORS.admin, icon: <AdminPanelSettings fontSize="small" />, label: 'Administrator' };
      case 'pharmacist': return { bg: '#F3E8FF', color: COLORS.pharmacist, icon: <LocalPharmacy fontSize="small" />, label: 'Pharmacist' };
      case 'delivery': return { bg: '#FFEDD5', color: COLORS.delivery, icon: <LocalShipping fontSize="small" />, label: 'Delivery Courier' };
      case 'patient':
      default: return { bg: '#CCFBF1', color: COLORS.patient, icon: <Person fontSize="small" />, label: 'Patient' };
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const pendingApprovalsCount = useMemo(() => {
    return users.filter(u => !u.isApproved).length;
  }, [users]);

  return (
    <Box sx={{ p: { xs: 1, md: 0 } }}>
      {/* Title Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, color: COLORS.text }}>
          User Registry & Access Management
        </Typography>
        <Typography variant="body2" sx={{ color: COLORS.subtext, fontWeight: 500 }}>
          Manage user profiles, authenticate permissions, and clear pharmacist/delivery personnel approvals
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}

      {/* Control bar */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: 3, 
          border: `1px solid ${COLORS.border}`,
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          alignItems: { xs: 'stretch', md: 'center' }, 
          justifyContent: 'space-between',
          gap: 2,
          bgcolor: 'white'
        }}
      >
        <TextField
          placeholder="Search by name, email or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          fullWidth
          sx={{ maxWidth: { md: 450 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: COLORS.subtext }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery('')}>
                  <Clear fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            sx: { borderRadius: 3 }
          }}
        />

        <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="flex-end">
          {loading && <CircularProgress size={20} sx={{ color: COLORS.teal }} />}
          <Chip label={`Registered: ${users.length}`} color="primary" variant="outlined" size="small" sx={{ fontWeight: 700, borderRadius: 2 }} />
          {pendingApprovalsCount > 0 && (
            <Chip label={`${pendingApprovalsCount} Awaiting Approval`} color="warning" size="small" sx={{ fontWeight: 800, borderRadius: 2 }} />
          )}
        </Stack>
      </Paper>

      {/* Category Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={(e, val) => setSelectedTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{ sx: { bgcolor: '#10b981' } }}
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': { 
              textTransform: 'none', 
              fontWeight: 800, 
              color: COLORS.subtext, 
              fontSize: '0.85rem',
              '&.Mui-selected': { color: '#10b981' }
            } 
          }}
        >
          <Tab label="All Users" />
          <Tab label="Patients" />
          <Tab label="Pharmacists" />
          <Tab label="Delivery Couriers" />
          <Tab label="Admins" />
          <Tab 
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <span>Pending Approvals</span>
                {pendingApprovalsCount > 0 && (
                  <Box sx={{ bgcolor: 'error.main', color: 'white', px: 0.8, py: 0.2, borderRadius: 1.5, fontSize: '0.65rem', fontWeight: 900 }}>
                    {pendingApprovalsCount}
                  </Box>
                )}
              </Stack>
            } 
          />
        </Tabs>
      </Box>

      {/* User count label */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ color: COLORS.subtext, fontWeight: 700 }}>
          SHOWING {filteredUsers.length} OF {users.length} REGISTERED ACCOUNTS
        </Typography>
      </Box>

      {/* User cards grid */}
      <Grid container spacing={2.5}>
        {filteredUsers.map((u) => {
          const roleTheme = getRoleTheme(u.role);
          const isPending = !u.isApproved;
          
          return (
            <Grid item xs={12} md={6} lg={4} key={u._id}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 4, 
                  border: `1px solid ${isPending ? 'rgba(245, 158, 11, 0.4)' : COLORS.border}`,
                  bgcolor: 'white',
                  boxShadow: isPending ? '0 8px 24px rgba(245, 158, 11, 0.05)' : '0 10px 30px rgba(44, 62, 80, 0.02)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: isPending ? '#f59e0b' : '#10b981',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 36px rgba(0,0,0,0.04)'
                  }
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  {/* Top user header row */}
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: roleTheme.color, 
                        color: 'white', 
                        fontWeight: 900, 
                        fontSize: '1rem',
                        width: 44,
                        height: 44,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.06)'
                      }}
                    >
                      {getInitials(u.name)}
                    </Avatar>
                    
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 800, 
                          color: COLORS.text, 
                          lineHeight: 1.2, 
                          mb: 0.5,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                        title={u.name}
                      >
                        {u.name}
                      </Typography>
                      
                      <Chip 
                        icon={roleTheme.icon}
                        label={roleTheme.label} 
                        size="small" 
                        sx={{ 
                          bgcolor: roleTheme.bg, 
                          color: roleTheme.color, 
                          fontWeight: 800, 
                          fontSize: '0.68rem',
                          height: 20,
                          '& .MuiChip-icon': { color: 'inherit' }
                        }} 
                      />
                    </Box>
                  </Stack>

                  <Divider sx={{ mb: 2, borderColor: '#f1f5f9' }} />

                  {/* Profile data list */}
                  <Stack spacing={1.5} sx={{ mb: 2.5 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Mail sx={{ color: COLORS.subtext, fontSize: 18 }} />
                      <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem', wordBreak: 'break-all' }}>
                        {u.email}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Phone sx={{ color: COLORS.subtext, fontSize: 18 }} />
                      <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem' }}>
                        {u.phone || 'No phone recorded'}
                      </Typography>
                    </Stack>

                    {/* Address Detail */}
                    {u.address && (u.address.street || u.address.city) && (
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <LocationOn sx={{ color: COLORS.subtext, fontSize: 18, mt: 0.2 }} />
                        <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem' }}>
                          Address: {u.address.street || ''}{u.address.city ? `, ${u.address.city}` : ''}{u.address.postalCode ? ` (${u.address.postalCode})` : ''}
                        </Typography>
                      </Stack>
                    )}

                    {/* Medical / Chronic conditions detail */}
                    {u.role === 'patient' && (
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <LocalPharmacy sx={{ color: COLORS.subtext, fontSize: 18, mt: 0.2 }} />
                        <Box>
                          <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem', fontWeight: u.flaggedAsChronic ? 800 : 500 }}>
                            Chronic Check: {u.flaggedAsChronic ? 'Flagged as Chronic' : 'Standard Patient'}
                          </Typography>
                          {u.chronicConditions && u.chronicConditions.length > 0 && (
                            <Typography variant="caption" sx={{ color: COLORS.subtext, display: 'block', mt: 0.3 }}>
                              Conditions: {u.chronicConditions.join(', ')}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    )}

                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <CalendarMonth sx={{ color: COLORS.subtext, fontSize: 18 }} />
                      <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem' }}>
                        Registered: {new Date(u.createdAt).toLocaleDateString()}
                      </Typography>
                    </Stack>

                    {/* Account Active State */}
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <VerifiedUser sx={{ color: u.isActive ? '#059669' : '#ef4444', fontSize: 18 }} />
                      <Typography variant="body2" sx={{ color: u.isActive ? '#059669' : '#ef4444', fontSize: '0.82rem', fontWeight: 800 }}>
                        Account State: {u.isActive ? 'Active & Enabled' : 'Deactivated / Suspended'}
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* Status chip & Quick Actions row */}
                  <Stack 
                    direction="row" 
                    justifyContent="space-between" 
                    alignItems="center"
                    sx={{ pt: 1.5, borderTop: '1px solid #f8fafc' }}
                  >
                    <Box>
                      {isPending ? (
                        <Tooltip title="Requires Administrator approval to access their portal dashboard">
                          <Chip 
                            icon={<ReportProblem />}
                            label="Pending review" 
                            color="warning"
                            size="small"
                            sx={{ fontWeight: 800, fontSize: '0.65rem', height: 20 }}
                          />
                        </Tooltip>
                      ) : (
                        <Chip 
                          icon={<VerifiedUser />}
                          label="Approved access" 
                          color="success"
                          variant="outlined"
                          size="small"
                          sx={{ fontWeight: 800, fontSize: '0.65rem', height: 20 }}
                        />
                      )}
                    </Box>

                    <Stack direction="row" spacing={1}>
                      {isPending ? (
                        <>
                          <Button 
                            size="small" 
                            variant="contained" 
                            color="success"
                            onClick={() => handleApproveUser(u._id, u.name)}
                            startIcon={<CheckCircle />}
                            sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 700, px: 1.5 }}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="error"
                            onClick={() => handleRejectUser(u._id, u.name)}
                            startIcon={<Cancel />}
                            sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 700, px: 1.5 }}
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Button 
                          size="small" 
                          color="error" 
                          variant="outlined"
                          startIcon={<Delete />}
                          onClick={() => handleRemoveUser(u._id, u.name)}
                          sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 700 }}
                        >
                          Remove
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}

        {filteredUsers.length === 0 && !loading && (
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 8, 
                textAlign: 'center', 
                borderRadius: 5, 
                border: `2px dashed ${COLORS.border}`,
                bgcolor: 'white' 
              }}
            >
              <Person sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" sx={{ color: COLORS.text, fontWeight: 800 }} gutterBottom>
                No users matched criteria
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.subtext, maxWidth: 350, mx: 'auto' }}>
                Try adjusting the search spelling or selecting a different role category tab.
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default UserList;
