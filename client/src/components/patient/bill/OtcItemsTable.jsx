import React from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box, CircularProgress } from '@mui/material';
import { Delete } from '@mui/icons-material';

const COLORS = {
  border: 'rgba(147, 191, 199, 0.35)',
  text: '#2C3E50',
  subtext: '#546E7A',
};

const OtcItemsTable = ({ items, onRemoveItem, removingId }) => {
  if (!items || items.length === 0) return (
    <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 2 }}>
      No additional items added.
    </Typography>
  );

  return (
    <TableContainer sx={{ border: `1px solid ${COLORS.border}`, borderRadius: 3, overflow: 'hidden' }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: 'action.hover' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Item Name</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Qty</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>Price</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700 }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item._id} hover>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.medicineName || item.medicineId?.name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{item.quantity}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" sx={{ color: COLORS.subtext }}>Rs. {(item.price || 0).toFixed(2)}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Rs. {((item.price || 0) * item.quantity).toFixed(2)}</Typography>
              </TableCell>
              <TableCell align="center">
                <IconButton 
                  size="small" 
                  color="error" 
                  onClick={() => onRemoveItem(item._id)} 
                  disabled={removingId === item._id}
                  sx={{ '&:hover': { bgcolor: 'error.lighter' } }}
                >
                  {removingId === item._id ? <CircularProgress size={18} color="inherit" /> : <Delete fontSize="small" />}
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OtcItemsTable;
