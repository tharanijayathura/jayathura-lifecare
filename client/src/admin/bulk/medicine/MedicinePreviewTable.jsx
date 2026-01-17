import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip } from '@mui/material';
import { Delete } from '@mui/icons-material';

const MedicinePreviewTable = ({ medicines, onRemove }) => {
  if (!medicines || medicines.length === 0) return null;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Preview ({medicines.length})</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Brand</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Base Unit</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Packaging</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Qty/Pack</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Stock Packs</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Min Stock</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rx</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicines.map((m, index) => (
                <TableRow key={index} hover>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.brand}</TableCell>
                  <TableCell>{m.category}</TableCell>
                  <TableCell>{m.baseUnit}</TableCell>
                  <TableCell>{m.packaging?.type}</TableCell>
                  <TableCell>{m.packaging?.qtyPerPack}</TableCell>
                  <TableCell>{m.price?.perPack}</TableCell>
                  <TableCell>{m.stock?.packs}</TableCell>
                  <TableCell>{m.minStockUnits}</TableCell>
                  <TableCell>{m.requiresPrescription ? 'Yes' : 'No'}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Remove">
                      <IconButton size="small" onClick={() => onRemove(index)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default MedicinePreviewTable;
