import React from 'react';
import { Paper, Typography, Alert, Stack, Box, Divider, List, ListItem, ListItemText } from '@mui/material';

const COLORS = {
  green1: '#ECF4E8',
  blue2: '#7AA8B0',
  text: '#2C3E50',
  subtext: '#546E7A',
  border: 'rgba(147, 191, 199, 0.35)',
};

const CartSummary = ({ cartItems, prescriptionItems, otcItems, groceryItems, totalAmount }) => {
  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(236, 244, 232, 0.2)', borderColor: COLORS.border }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, color: COLORS.text }}>Current Order Items</Typography>
      
      {cartItems.length === 0 ? (
        <Typography variant="body2" sx={{ color: COLORS.subtext, fontStyle: 'italic' }}>
          No additional items selected yet.
        </Typography>
      ) : (
        <Stack spacing={2}>
          <List dense disablePadding>
            {prescriptionItems.length > 0 && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.blue2, textTransform: 'uppercase' }}>Prescription</Typography>
                {prescriptionItems.map((item, idx) => (
                  <ListItem key={idx} sx={{ py: 0.5, px: 1 }}>
                    <ListItemText 
                      primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>{item.name}</Typography>}
                      secondary={`Qty: ${item.quantity}`}
                    />
                  </ListItem>
                ))}
              </Box>
            )}
            
            {otcItems.length > 0 && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.blue2, textTransform: 'uppercase' }}>Essentials</Typography>
                {otcItems.map((item, idx) => (
                  <ListItem key={idx} sx={{ py: 0.5, px: 1 }}>
                    <ListItemText 
                      primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>{item.name}</Typography>}
                      secondary={`Qty: ${item.quantity} • Rs. ${(item.price * item.quantity).toFixed(2)}`}
                    />
                  </ListItem>
                ))}
              </Box>
            )}

            {groceryItems.length > 0 && (
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.blue2, textTransform: 'uppercase' }}>Groceries</Typography>
                {groceryItems.map((item, idx) => (
                  <ListItem key={idx} sx={{ py: 0.5, px: 1 }}>
                    <ListItemText 
                      primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>{item.name}</Typography>}
                      secondary={`Qty: ${item.quantity} • Rs. ${(item.price * item.quantity).toFixed(2)}`}
                    />
                  </ListItem>
                ))}
              </Box>
            )}
          </List>

          <Divider sx={{ borderStyle: 'dashed' }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Estimated Total:</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.blue2 }}>Rs. {totalAmount.toFixed(2)}</Typography>
          </Box>
        </Stack>
      )}
    </Paper>
  );
};

export default CartSummary;
