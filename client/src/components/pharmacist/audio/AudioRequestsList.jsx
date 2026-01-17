import React from 'react';
import { Grid, Card, CardContent, Typography, Stack, Box, Chip, Button, Alert } from '@mui/material';
import { RecordVoiceOver } from '@mui/icons-material';

const AudioRequestsList = ({ orders, onProvide }) => {
  if (!orders || orders.length === 0) {
    return <Alert severity="info">No pending audio instruction requests</Alert>;
  }
  return (
    <Grid container spacing={2}>
      {orders.map((order) => (
        <Grid item xs={12} md={6} key={order._id}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="start" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="h6">Order #{order.orderId}</Typography>
                  <Typography variant="body2" color="text.secondary">Patient: {order.patientId?.name || 'N/A'}</Typography>
                  <Typography variant="body2" color="text.secondary">Requested: {new Date(order.audioInstructions?.requestedAt).toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary">Items: {order.items.length} medicines</Typography>
                </Box>
                <Chip label="Audio Requested" color="warning" />
              </Stack>
              <Button variant="contained" startIcon={<RecordVoiceOver />} onClick={() => onProvide(order)} fullWidth>
                Provide Audio Instructions
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AudioRequestsList;
