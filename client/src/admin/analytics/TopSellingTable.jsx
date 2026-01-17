import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';

const TopSellingTable = ({ items, formatCurrency }) => {
  if (!items || items.length === 0) return null;
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Top Selling Products</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Quantity</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Revenue</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Chip label={`#${index + 1}`} size="small" color={index === 0 ? 'primary' : index === 1 ? 'success' : 'default'} sx={{ mr: 1 }} />
                    {item.name}
                  </TableCell>
                  <TableCell align="right">{item.quantity.toLocaleString()}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: 'success.main' }}>
                    {formatCurrency ? formatCurrency(item.revenue) : item.revenue}
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

export default TopSellingTable;
