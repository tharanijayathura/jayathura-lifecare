import React from 'react';
import { Paper, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

const MedicinePreviewTable = ({ medicines, onRemove }) => {
  if (!medicines || medicines.length === 0) return null;

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Preview ({medicines.length} medicines)
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Brand</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Packaging</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Price</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Stock</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medicines.map((medicine, index) => (
              <TableRow key={index} hover>
                <TableCell>{medicine.name}</TableCell>
                <TableCell>{medicine.brand || '-'}</TableCell>
                <TableCell>
                  <Chip label={medicine.category} size="small" color="primary" />
                </TableCell>
                <TableCell>
                  {medicine.packaging.qtyPerPack} {medicine.baseUnit}s per {medicine.packaging.type}
                </TableCell>
                <TableCell align="right">Rs. {medicine.price.perPack.toFixed(2)}</TableCell>
                <TableCell align="right">{medicine.stock.packs} packs</TableCell>
                <TableCell>
                  <IconButton size="small" color="error" onClick={() => onRemove(index)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default MedicinePreviewTable;
