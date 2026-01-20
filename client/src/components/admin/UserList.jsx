import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent, Stack, Button, CircularProgress, Alert } from '@mui/material';
import { adminAPI } from '../../services/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Error fetching users.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this user?')) return;
    setLoading(true);
    setError('');
    try {
      await adminAPI.removeUser(userId);
      await fetchUsers();
      alert('User removed successfully!');
    } catch (err) {
      setError('Failed to remove user.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">All Users</Typography>
        {loading && <CircularProgress size={20} />}
      </Paper>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={2}>
        {users.map((u) => (
          <Grid item xs={12} md={6} lg={4} key={u._id}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">{u.name} ({u.email})</Typography>
                <Typography variant="body2" color="text.secondary">Role: {u.role}</Typography>
                <Typography variant="body2" color="text.secondary">Status: {u.status}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button size="small" color="error" variant="outlined" onClick={() => handleRemoveUser(u._id)}>Remove</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {users.length === 0 && !loading && (
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
              <Typography>No users found.</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default UserList;
