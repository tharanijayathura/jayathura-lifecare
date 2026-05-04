import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Stack, Chip, Button, Alert, Link, Divider, Paper } from '@mui/material';
import { Description, History, Visibility, AddCircleOutline, ReceiptLong, CheckCircleOutline } from '@mui/icons-material';
import { getPublicFileUrl } from '../../../services/api';

const COLORS = {
  green1: '#ECF4E8',
  green2: '#CBF3BB',
  green3: '#ABE7B2',
  blue1: '#93BFC7',
  blue2: '#7AA8B0',
  text: '#2C3E50',
  subtext: '#546E7A',
  border: 'rgba(147, 191, 199, 0.35)',
  paper: 'rgba(255,255,255,0.9)',
};

const PrescriptionOrders = ({
  orders = [],
  onViewBill,
  onAddItems,
}) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'confirmed': return { color: 'success', label: 'CONFIRMED', icon: <CheckCircleOutline /> };
      case 'pending': return { color: 'warning', label: 'PENDING', icon: <History /> };
      case 'ready': return { color: 'info', label: 'READY', icon: <Visibility /> };
      default: return { color: 'default', label: status.toUpperCase(), icon: <Description /> };
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: COLORS.text }}>Prescription Orders</Typography>
        <Typography variant="body2" color="text.secondary">Track and manage your uploaded prescriptions and bills.</Typography>
      </Box>

      {orders.length === 0 ? (
        <Paper 
          sx={{ 
            p: 6, 
            textAlign: 'center', 
            borderRadius: 4, 
            bgcolor: COLORS.green1, 
            border: `1px dashed ${COLORS.blue1}` 
          }}
        >
          <Description sx={{ fontSize: 64, color: COLORS.blue2, mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>No prescription orders found</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Upload a prescription to start your order.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            return (
              <Grid item xs={12} key={order._id}>
                <Card 
                  sx={{ 
                    borderRadius: 4, 
                    border: `1px solid ${COLORS.border}`,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    overflow: 'hidden'
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ p: 2.5, bgcolor: 'action.hover', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'white', color: COLORS.blue2, display: 'flex' }}>
                          <ReceiptLong />
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: COLORS.text }}>
                            Order #{order.orderId}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Stack>
                      <Chip 
                        label={statusConfig.label} 
                        color={statusConfig.color} 
                        size="small" 
                        icon={statusConfig.icon}
                        sx={{ fontWeight: 700, px: 1 }}
                      />
                    </Box>

                    <Box sx={{ p: 3 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                          <Typography variant="overline" sx={{ color: COLORS.subtext, fontWeight: 700 }}>Prescription Details</Typography>
                          <Stack spacing={1} sx={{ mt: 1 }}>
                            {order.prescriptionId?.originalName && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Description fontSize="small" sx={{ color: COLORS.blue2 }} />
                                <Typography variant="body2">{order.prescriptionId.originalName}</Typography>
                                <Link 
                                  href={getPublicFileUrl(order.prescriptionId.imageUrl)} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  sx={{ ml: 1, fontWeight: 600, fontSize: '0.75rem', color: COLORS.blue2 }}
                                >
                                  View File
                                </Link>
                              </Box>
                            )}
                            <Typography variant="body2" color="text.secondary">
                              <strong>Items:</strong> {order.items.length} total ({order.items.filter(i => i.isPrescription).length} Rx, {order.items.filter(i => !i.isPrescription).length} Other)
                            </Typography>
                            {order.prescriptionId?.activities?.length > 0 && (
                              <Typography variant="caption" sx={{ p: 1, bgcolor: COLORS.green1, borderRadius: 1, display: 'inline-block', width: 'fit-content' }}>
                                <strong>Status:</strong> {order.prescriptionId.activities[order.prescriptionId.activities.length - 1].type.replace(/-/g, ' ')}
                              </Typography>
                            )}
                          </Stack>
                        </Grid>

                        <Grid item xs={12} md={4} sx={{ borderLeft: { md: `1px solid ${COLORS.border}` }, pl: { md: 4 } }}>
                          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            {order.finalAmount ? (
                              <Box sx={{ textAlign: { md: 'right' }, mb: 2 }}>
                                <Typography variant="caption" color="text.secondary">Total Amount</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.text }}>
                                  Rs. {order.finalAmount.toFixed(2)}
                                </Typography>
                              </Box>
                            ) : (
                              <Alert severity="info" variant="outlined" sx={{ mb: 2, py: 0 }}>
                                Pharmacist is reviewing...
                              </Alert>
                            )}

                            <Stack spacing={1.5}>
                              {order.status === 'pending' && order.finalAmount && (
                                <Button 
                                  variant="contained" 
                                  fullWidth
                                  onClick={() => onViewBill(order)}
                                  sx={{ bgcolor: COLORS.green3, color: COLORS.text, fontWeight: 700, '&:hover': { bgcolor: COLORS.green2 } }}
                                >
                                  Review & Confirm Bill
                                </Button>
                              )}
                              {order.status === 'pending' && (
                                <Button 
                                  variant="outlined" 
                                  fullWidth
                                  startIcon={<AddCircleOutline />}
                                  onClick={() => onAddItems(order)}
                                  sx={{ borderColor: COLORS.blue1, color: COLORS.text, fontWeight: 600 }}
                                >
                                  Add Other Items
                                </Button>
                              )}
                            </Stack>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default PrescriptionOrders;
