import React from 'react';
import { 
  Paper, 
  Typography, 
  Chip, 
  Box, 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  IconButton, 
  Stack, 
  Divider 
} from '@mui/material';
import { Delete, ShoppingBasket, LocalHospital } from '@mui/icons-material';

const OrderItems = ({ order, loading, handleRemoveItem }) => {
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
    <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: `1px solid ${COLORS.border}`, bgcolor: 'white' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 900, color: COLORS.text }}>Verified Items</Typography>
        <Stack direction="row" spacing={1}>
          <Chip 
            icon={<LocalHospital sx={{ fontSize: '1rem !important' }} />} 
            label={`${order.items?.filter(i => i.isPrescription).length || 0} Rx`} 
            size="small" 
            sx={{ bgcolor: '#f1f5f9', fontWeight: 800, color: COLORS.blue2 }} 
          />
          <Chip 
            icon={<ShoppingBasket sx={{ fontSize: '1rem !important' }} />} 
            label={`${order.items?.filter(i => !i.isPrescription).length || 0} OTC`} 
            size="small" 
            sx={{ bgcolor: COLORS.green1, fontWeight: 800, color: '#059669' }} 
          />
        </Stack>
      </Box>

      {order.items?.length === 0 ? (
        <Box sx={{ p: 6, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: 4, border: '1px solid #f1f5f9' }}>
          <Typography sx={{ color: COLORS.subtext, fontWeight: 500 }}>The order summary is currently empty.</Typography>
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& th': { borderBottom: '2px solid #f1f5f9', color: COLORS.subtext, fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' } }}>
                  <TableCell>Medicine</TableCell>
                  <TableCell align="center">Qty</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow key={index} sx={{ '& td': { borderBottom: '1px solid #f1f5f9', py: 2 } }}>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, color: COLORS.text, fontSize: '0.9rem' }}>{item.medicineName}</Typography>
                      <Typography variant="caption" sx={{ color: COLORS.subtext }}>
                        {item.dosage} {item.frequency ? `• ${item.frequency}` : ''}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={`x${item.quantity}`} size="small" sx={{ fontWeight: 800, bgcolor: '#f1f5f9', height: 24 }} />
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 800, fontSize: '0.9rem' }}>Rs. {(item.price * item.quantity).toFixed(2)}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" sx={{ color: '#f43f5e', '&:hover': { bgcolor: '#fff1f2' } }} onClick={() => handleRemoveItem(item._id)} disabled={loading}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 4, p: 3, borderRadius: 5, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: COLORS.subtext, fontWeight: 600, fontSize: '0.85rem' }}>Subtotal</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Rs. {(order.totalAmount || 0).toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: COLORS.subtext, fontWeight: 600, fontSize: '0.85rem' }}>Delivery (Est.)</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Rs. {(order.deliveryFee || 0).toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ borderStyle: 'dashed', my: 0.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 800, color: COLORS.text }}>Total Balance</Typography>
                <Typography sx={{ fontWeight: 900, color: COLORS.blue2, fontSize: '1.25rem' }}>
                  Rs. {(order.finalAmount || order.totalAmount || 0).toFixed(2)}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default OrderItems;
