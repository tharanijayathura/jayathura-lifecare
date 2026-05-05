import React from 'react';
import { Grid, Paper, Typography, Stack, Box, Chip, Button, Avatar } from '@mui/material';
import { RecordVoiceOver, Person, AccessTime } from '@mui/icons-material';

const AudioRequestsList = ({ orders, onProvide }) => {
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

  return (
    <Grid container spacing={3}>
      {orders.map((order) => (
        <Grid item xs={12} md={6} key={order._id}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 6,
              border: `1px solid ${COLORS.border}`,
              bgcolor: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.04)',
                borderColor: COLORS.blue2
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Chip 
                label={`ORD-${order.orderId || order._id.slice(-6).toUpperCase()}`} 
                size="small" 
                sx={{ bgcolor: COLORS.green1, color: COLORS.blue2, fontWeight: 800, borderRadius: 2 }} 
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: COLORS.subtext }}>
                <AccessTime sx={{ fontSize: 14 }} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {new Date(order.audioInstructions?.requestedAt || order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: COLORS.blue1, width: 40, height: 40 }}>
                <Person />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.text, mb: 0 }}>
                  {order.patientId?.name || 'Valued Patient'}
                </Typography>
                <Typography variant="body2" sx={{ color: COLORS.subtext }}>
                  Includes {order.items?.length || 0} Prescribed Items
                </Typography>
              </Box>
            </Box>

            <Button 
              fullWidth
              variant="contained" 
              startIcon={<RecordVoiceOver />} 
              onClick={() => onProvide(order)}
              sx={{ 
                borderRadius: 4, 
                py: 1.5, 
                bgcolor: COLORS.blue2, 
                fontWeight: 800,
                boxShadow: '0 8px 20px rgba(122, 168, 176, 0.2)',
                '&:hover': { bgcolor: COLORS.blue1 }
              }}
            >
              Record Instructions
            </Button>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default AudioRequestsList;
