import React from 'react';
import { Card, CardContent, Typography, Chip, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert, Stack, Divider } from '@mui/material';
import { Delete } from '@mui/icons-material';

const OrderItems = ({ order, loading, handleRemoveItem }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Order Items
        {order.items.length > 0 && (
          <Chip label={`${order.items.filter(i => i.isPrescription).length} Prescription, ${order.items.filter(i => !i.isPrescription).length} OTC`} size="small" sx={{ ml: 2 }} color="info" />
        )}
      </Typography>

      {order.items.length === 0 ? (
        <Alert severity="info">No items in order yet. Add prescription medicines or wait for patient to add OTC items.</Alert>
      ) : (
        <>
          {order.items.filter(i => i.isPrescription).length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
                Prescription Medicines (Added by Pharmacist)
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Medicine</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Dosage</TableCell>
                      <TableCell>Frequency</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.filter(i => i.isPrescription).map((item, index) => (
                      <TableRow key={`rx-${index}`}>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography>{item.medicineName || item.medicineId?.name}</Typography>
                            <Chip label="Rx" size="small" color="primary" />
                          </Stack>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.dosage || '-'}</TableCell>
                        <TableCell>{item.frequency || '-'}</TableCell>
                        <TableCell align="right">Rs. {item.price?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell align="right">Rs. {((item.price || 0) * item.quantity).toFixed(2)}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" color="error" onClick={() => handleRemoveItem(item._id)} disabled={loading}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {order.items.filter(i => !i.isPrescription).length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="secondary" gutterBottom sx={{ fontWeight: 600 }}>
                OTC Items (Added by Patient)
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Medicine</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.filter(i => !i.isPrescription).map((item, index) => (
                      <TableRow key={`otc-${index}`}>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography>{item.medicineName || item.medicineId?.name}</Typography>
                            <Chip label="OTC" size="small" color="secondary" />
                          </Stack>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell align="right">Rs. {item.price?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell align="right">Rs. {((item.price || 0) * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </>
      )}

      {order.finalAmount && (
        <Box sx={{ mt: 2 }}>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Subtotal:</Typography>
              <Typography>Rs. {(order.totalAmount || 0).toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Delivery Fee:</Typography>
              <Typography>Rs. {(order.deliveryFee || 0).toFixed(2)}</Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="primary">Rs. {(order.finalAmount || 0).toFixed(2)}</Typography>
            </Box>
          </Stack>
        </Box>
      )}
    </CardContent>
  </Card>
);

export default OrderItems;
