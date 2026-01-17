import React from 'react';
import { Paper, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

const GroceryPreviewTable = ({ groceries, onRemove }) => {
  if (!groceries || groceries.length === 0) return null;

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Preview ({groceries.length} items)
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Unit</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Stock</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groceries.map((grocery, index) => (
              <TableRow key={index} hover>
                <TableCell>{grocery.name}</TableCell>
                <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {grocery.description || '-'}
                </TableCell>
                <TableCell align="right">Rs. {grocery.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip label={grocery.unit} size="small" color="primary" />
                </TableCell>
                <TableCell align="right">{grocery.stock}</TableCell>
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

export default GroceryPreviewTable;
