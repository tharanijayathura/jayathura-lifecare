import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip } from '@mui/material';
import { Delete } from '@mui/icons-material';

const GroceryPreviewTable = ({ groceries, onRemove }) => {
  if (!groceries || groceries.length === 0) return null;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Preview ({groceries.length})</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Unit</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Min Stock</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groceries.map((g, index) => (
                <TableRow key={index} hover>
                  <TableCell>{g.name}</TableCell>
                  <TableCell>{g.description}</TableCell>
                  <TableCell>{g.price}</TableCell>
                  <TableCell>{g.unit}</TableCell>
                  <TableCell>{g.stock}</TableCell>
                  <TableCell>{g.minStock}</TableCell>
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

export default GroceryPreviewTable;
