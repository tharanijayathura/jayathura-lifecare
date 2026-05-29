import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Stack, Chip, Button, Alert, Link, Divider, Paper, Tabs, Tab } from '@mui/material';
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
  onCancel,
}) => {
  const actionRequiredOrders = orders.filter(o => o.status === 'pending' && o.finalAmount > 0);
  const awaitingReviewOrders = orders.filter(o => o.status === 'draft' || (o.status === 'pending' && !o.finalAmount));

  // Determine initial tab index: default to Awaiting Actions if any exist
  const [subTab, setSubTab] = React.useState(() => {
    if (actionRequiredOrders.length === 0 && awaitingReviewOrders.length > 0) {
      return 1;
    }
    return 0;
  });

  const displayedOrders = subTab === 0 ? actionRequiredOrders : awaitingReviewOrders;
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
        <Typography variant="h5" sx={{ fontWeight: 700, color: COLORS.text }}>Prescriptions & Bills</Typography>
        <Typography variant="body2" color="text.secondary">Review and confirm prescription pricing from the pharmacist.</Typography>
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
          <Typography variant="h6" color="text.secondary" gutterBottom>No prescriptions found</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Upload a prescription in the "Upload Prescription" tab to get started.
          </Typography>
        </Paper>
      ) : (
        <Box>
          <Tabs 
            value={subTab} 
            onChange={(e, val) => setSubTab(val)} 
            sx={{ 
              mb: 4, 
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 750, fontSize: '0.9rem' } 
            }}
          >
            <Tab 
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Action Required (Bills Ready)</span>
                  {actionRequiredOrders.length > 0 && (
                    <Chip label={actionRequiredOrders.length} size="small" color="error" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800 }} />
                  )}
                </Stack>
              } 
            />
            <Tab 
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Awaiting Pharmacist Review</span>
                  {awaitingReviewOrders.length > 0 && (
                    <Chip label={awaitingReviewOrders.length} size="small" color="info" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800, bgcolor: 'rgba(122, 168, 176, 0.1)', color: COLORS.blue2 }} />
                  )}
                </Stack>
              } 
            />
          </Tabs>

          {displayedOrders.length === 0 ? (
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
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {subTab === 0 ? 'No bills ready for payment' : 'No prescriptions in review'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {subTab === 0 
                  ? 'Your bills awaiting review, payment and delivery confirmation will appear here.' 
                  : 'Prescriptions you upload will appear here while our pharmacists verify them.'}
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {displayedOrders.map((order) => {
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
                                Order #{order.orderId}{order.patientId?.name ? ` - ${order.patientId.name}` : ''}
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

                            <Grid 
                              item 
                              xs={12} 
                              md={4} 
                              sx={{ 
                                borderLeft: { md: `1px solid ${COLORS.border}` }, 
                                pl: { md: 4 },
                                borderTop: { xs: `1px solid ${COLORS.border}`, md: 'none' },
                                pt: { xs: 3, md: 0 },
                                mt: { xs: 1, md: 0 }
                              }}
                            >
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
                                  {['pending', 'draft'].includes(order.status) && (
                                    <Button 
                                      variant="outlined" 
                                      color="error"
                                      fullWidth
                                      onClick={() => onCancel(order._id || order.orderId)}
                                      sx={{ borderRadius: 3, fontWeight: 700, mt: 1 }}
                                    >
                                      Cancel & Remove
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
      )}
    </Box>
  );
};

export default PrescriptionOrders;
