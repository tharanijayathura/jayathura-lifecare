import React from 'react';
import { Card, CardContent, Typography, Chip, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert, Stack, Divider } from '@mui/material';
import { Delete } from '@mui/icons-material';

const COLORS = {
  green1: '#ECF4E8',
  green2: '#CBF3BB',
  green3: '#ABE7B2',
  blue1: '#93BFC7',
  blue2: '#7AA8B0',
  text: '#2C3E50',
  subtext: '#546E7A',
  border: 'rgba(147, 191, 199, 0.35)',
};

const OrderItems = ({ order, loading, handleRemoveItem }) => (
  <Paper sx={{ p: 3, borderRadius: 4, border: `1px solid ${COLORS.border}` }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.text }}>Current Order Summary</Typography>
      {order.items.length > 0 && (
        <Stack direction="row" spacing={1}>
          <Chip label={`${order.items.filter(i => i.isPrescription).length} Prescribed`} size="small" sx={{ bgcolor: COLORS.blue1, color: 'white', fontWeight: 700 }} />
          <Chip label={`${order.items.filter(i => !i.isPrescription).length} OTC`} size="small" sx={{ bgcolor: COLORS.green2, color: COLORS.text, fontWeight: 700 }} />
        </Stack>
      )}
    </Box>

    {order.items.length === 0 ? (
      <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 3 }}>
        <Typography color="text.secondary">No items added to the order summary yet.</Typography>
      </Box>
    ) : (
      <>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Item Description</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Qty</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Dosage/Freq</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Unit Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items.map((item, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.medicineName}</Typography>
                      <Chip 
                        label={item.isPrescription ? 'Prescribed' : 'OTC'} 
                        size="small" 
                        sx={{ 
                          height: 16, 
                          fontSize: '0.6rem', 
                          bgcolor: item.isPrescription ? COLORS.blue1 : COLORS.green2,
                          color: item.isPrescription ? 'white' : COLORS.text
                        }} 
                      />
                    </Box>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <Typography variant="caption" display="block">{item.dosage || '-'}</Typography>
                    <Typography variant="caption" color="text.secondary">{item.frequency || '-'}</Typography>
                  </TableCell>
                  <TableCell align="right">Rs. {item.price?.toFixed(2)}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Rs. {(item.price * item.quantity).toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="error" onClick={() => handleRemoveItem(item._id)} disabled={loading}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 4, p: 2, bgcolor: COLORS.green1, borderRadius: 3 }}>
          <Stack spacing={1}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">Subtotal</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Rs. {(order.totalAmount || 0).toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">Estimated Delivery Fee</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Rs. {(order.deliveryFee || 0).toFixed(2)}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Total Payable</Typography>
              <Typography variant="h6" sx={{ color: COLORS.blue2, fontWeight: 800 }}>Rs. {(order.finalAmount || order.totalAmount || 0).toFixed(2)}</Typography>
            </Box>
          </Stack>
        </Box>
      </>
    )}
  </Paper>
);

export default OrderItems;
