import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Stack, Chip, Button, Alert } from '@mui/material';

const PrescriptionOrders = ({
  orders = [],
  onViewBill,
  onAddItems,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>My Prescription Orders</Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        View your prescription orders. You can add non prescription items to pending orders and review bills before confirming.
      </Alert>
      {orders.length === 0 ? (
        <Alert severity="info">No prescription orders yet. Upload a prescription to get started.</Alert>
      ) : (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {orders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Card>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="start">
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6">Order #{order.orderId}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Prescription Status: {order.prescriptionId?.status || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Items: {order.items.length} | {order.items.filter(i => i.isPrescription).length} Prescription, {order.items.filter(i => !i.isPrescription).length} Non Prescription
                      </Typography>
                      {order.finalAmount && (
                        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                          Total: Rs. {order.finalAmount.toFixed(2)}
                        </Typography>
                      )}
                      {order.status === 'pending' && !order.finalAmount && (
                        <Alert severity="warning" sx={{ mt: 1 }}>
                          Waiting for pharmacist to add medicines and generate bill
                        </Alert>
                      )}
                    </Box>
                    <Stack spacing={1}>
                      <Chip label={order.status} color={order.status === 'confirmed' ? 'success' : order.status === 'pending' ? 'warning' : 'default'} />
                      {order.status === 'pending' && order.finalAmount && (
                        <Button variant="contained" onClick={() => onViewBill(order)}>
                          Review Bill
                        </Button>
                      )}
                      {order.status === 'pending' && (
                        <Button variant="outlined" onClick={() => onAddItems(order)}>
                          Add Non Prescription Items
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PrescriptionOrders;
