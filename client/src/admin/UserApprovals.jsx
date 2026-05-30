import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent, Stack, Button, CircularProgress } from '@mui/material';
import { useNotification } from '../contexts/NotificationContext';
import { adminAPI } from '../services/api';

const UserApprovals = () => {
  const { showNotification, confirmAction } = useNotification();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getPendingUsers();
      setPendingUsers(response.data);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPendingUsers(); }, []);

  const handleApproveUser = async (userId) => {
    try {
      await adminAPI.approveUser(userId);
      await fetchPendingUsers();
      showNotification('User approved successfully!', { type: 'success' });
    } catch (error) {
      console.error('Error approving user:', error);
      showNotification('Failed to approve user. Please try again.', { type: 'error' });
    }
  };

  const handleRejectUser = async (userId) => {
    const confirmed = await confirmAction('Are you sure you want to reject this user registration?', {
      title: 'Reject User Registration',
      danger: true
    });
    if (!confirmed) return;
    try {
      await adminAPI.rejectUser(userId);
      await fetchPendingUsers();
      showNotification('User rejected successfully!', { type: 'warning' });
    } catch (error) {
      console.error('Error rejecting user:', error);
      showNotification('Failed to reject user. Please try again.', { type: 'error' });
    }
  };

  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Pending Users</Typography>
        {loading && <CircularProgress size={20} />}
      </Paper>
      <Grid container spacing={2}>
        {pendingUsers.map((u) => (
          <Grid item xs={12} md={6} lg={4} key={u._id}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">{u.name} ({u.email})</Typography>
                <Typography variant="body2" color="text.secondary">Role: {u.role}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button size="small" variant="contained" onClick={() => handleApproveUser(u._id)}>Approve</Button>
                  <Button size="small" variant="outlined" color="error" onClick={() => handleRejectUser(u._id)}>Reject</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {pendingUsers.length === 0 && !loading && (
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
              <Typography>No pending approvals.</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default UserApprovals;
