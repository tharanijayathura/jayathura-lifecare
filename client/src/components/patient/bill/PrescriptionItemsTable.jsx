import React from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Stack, Box } from '@mui/material';

const COLORS = {
  border: 'rgba(147, 191, 199, 0.35)',
  text: '#2C3E50',
  subtext: '#546E7A',
};

const PrescriptionItemsTable = ({ items }) => {
  if (!items || items.length === 0) return (
    <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 2 }}>
      No prescription medicines added yet.
    </Typography>
  );

  return (
    <TableContainer sx={{ border: `1px solid ${COLORS.border}`, borderRadius: 3, overflow: 'hidden' }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: 'action.hover' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Medicine</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Qty</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Dosage</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Frequency</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item._id} hover>
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.medicineName || item.medicineId?.name}</Typography>
                  <Chip label="Rx" size="small" color="error" variant="outlined" sx={{ height: 16, fontSize: '0.6rem', fontWeight: 800 }} />
                </Stack>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{item.quantity}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption" sx={{ color: COLORS.subtext }}>{item.dosage || '-'}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption" sx={{ color: COLORS.subtext }}>{item.frequency || '-'}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Rs. {((item.price || 0) * item.quantity).toFixed(2)}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PrescriptionItemsTable;
