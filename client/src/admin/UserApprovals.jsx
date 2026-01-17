import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent, Stack, Button, CircularProgress } from '@mui/material';
import { adminAPI } from '../services/api';

const UserApprovals = () => {
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
      alert('User approved successfully!');
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user. Please try again.');
    }
  };

  const handleRejectUser = async (userId) => {
    if (!window.confirm('Reject this user?')) return;
    try {
      await adminAPI.rejectUser(userId);
      await fetchPendingUsers();
      alert('User rejected successfully!');
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Failed to reject user. Please try again.');
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
