import React from 'react';
import { Typography, Box, Divider, Stack, Paper, List, ListItem, ListItemText } from '@mui/material';

const COLORS = {
  blue2: '#7AA8B0',
  text: '#2C3E50',
  subtext: '#546E7A',
  border: 'rgba(147, 191, 199, 0.35)',
};

const ReviewSummary = ({ prescriptionItems, otcItems, groceryItems, totalAmount }) => {
  return (
    <Paper variant="outlined" sx={{ p: 4, borderRadius: 5, border: `1px solid ${COLORS.border}` }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 4, color: COLORS.text, textAlign: 'center' }}>Order Review</Typography>
      
      <Stack spacing={4}>
        {prescriptionItems.length > 0 && (
          <Box>
            <Typography variant="overline" sx={{ fontWeight: 800, color: COLORS.blue2 }}>Prescription Items</Typography>
            <List disablePadding>
              {prescriptionItems.map((item, idx) => (
                <ListItem key={idx} sx={{ px: 0, py: 1 }}>
                  <ListItemText 
                    primary={<Typography variant="body1" sx={{ fontWeight: 700 }}>{item.name}</Typography>}
                    secondary={<Typography variant="body2" color="text.secondary">Quantity: {item.quantity}</Typography>}
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Rs. {(item.price * item.quantity).toFixed(2)}</Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {otcItems.length > 0 && (
          <Box>
            <Typography variant="overline" sx={{ fontWeight: 800, color: COLORS.blue2 }}>Essential Items</Typography>
            <List disablePadding>
              {otcItems.map((item, idx) => (
                <ListItem key={idx} sx={{ px: 0, py: 1 }}>
                  <ListItemText 
                    primary={<Typography variant="body1" sx={{ fontWeight: 700 }}>{item.name}</Typography>}
                    secondary={<Typography variant="body2" color="text.secondary">Quantity: {item.quantity}</Typography>}
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Rs. {(item.price * item.quantity).toFixed(2)}</Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {groceryItems.length > 0 && (
          <Box>
            <Typography variant="overline" sx={{ fontWeight: 800, color: COLORS.blue2 }}>Groceries & Wellness</Typography>
            <List disablePadding>
              {groceryItems.map((item, idx) => (
                <ListItem key={idx} sx={{ px: 0, py: 1 }}>
                  <ListItemText 
                    primary={<Typography variant="body1" sx={{ fontWeight: 700 }}>{item.name}</Typography>}
                    secondary={<Typography variant="body2" color="text.secondary">Quantity: {item.quantity}</Typography>}
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Rs. {(item.price * item.quantity).toFixed(2)}</Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Divider sx={{ borderStyle: 'dashed' }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Total Order Value:</Typography>
          <Typography variant="h5" sx={{ fontWeight: 900, color: COLORS.blue2 }}>Rs. {totalAmount.toFixed(2)}</Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default ReviewSummary;
