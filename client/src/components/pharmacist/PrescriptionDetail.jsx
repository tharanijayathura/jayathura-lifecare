import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  TextField,
  Autocomplete,
  Card,
  CardContent,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Stack,
  Divider
} from '@mui/material';
import { Add, Delete, CheckCircle, Close } from '@mui/icons-material';
import { pharmacistAPI, medicineAPI } from '../../services/api';

const PrescriptionDetail = ({ prescription, open, onClose, onUpdate }) => {
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [instructions, setInstructions] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (open && prescription) {
      fetchPrescriptionDetails();
      fetchMedicines();
    }
  }, [open, prescription]);

  const fetchPrescriptionDetails = async () => {
    try {
      setLoading(true);
      const response = await pharmacistAPI.getPrescriptionDetails(prescription._id);
      // Response now includes both prescription and order
      if (response.data?.order) {
        setOrder(response.data.order);
      } else {
        // If no order exists yet, create one or find it
        // The order should have been created when prescription was uploaded
        setOrder(null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching prescription details:', error);
      setLoading(false);
    }
  };

  const fetchMedicines = async () => {
    try {
      const response = await medicineAPI.getAllPharmacist({ search: searchTerm });
      setMedicines(response.data || []);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  const handleAddMedicine = async () => {
    if (!selectedMedicine || !quantity) {
      return;
    }

    try {
      setLoading(true);
      const response = await pharmacistAPI.addPrescriptionItemToOrder(
        prescription._id,
        selectedMedicine.id || selectedMedicine._id,
        quantity,
        dosage,
        frequency,
        instructions
      );
      
      if (response.data?.order) {
        setOrder(response.data.order);
      }
      setSelectedMedicine(null);
      setQuantity(1);
      setDosage('');
      setFrequency('');
      setInstructions('');
      // Refresh order data
      await fetchPrescriptionDetails();
      onUpdate?.();
    } catch (error) {
      console.error('Error adding medicine:', error);
      alert(error.response?.data?.message || 'Failed to add medicine');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!order) return;
    
    try {
      setLoading(true);
      await pharmacistAPI.removePrescriptionItem(order._id, itemId);
      // Refresh order
      const response = await pharmacistAPI.getPrescriptionDetails(prescription._id);
      setOrder(response.data.order);
      onUpdate?.();
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBill = async () => {
    if (!order || order.items.length === 0) {
      alert('Please add medicines to the order first');
      return;
    }

    try {
      setLoading(true);
      await pharmacistAPI.generateAutoBill(order._id);
      alert('Bill generated successfully! Patient can now review and confirm.');
      onUpdate?.();
      onClose();
    } catch (error) {
      console.error('Error generating bill:', error);
      alert('Failed to generate bill');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      await pharmacistAPI.markPrescriptionVerified(prescription._id);
      alert('Prescription verified and bill sent to patient!');
      onUpdate?.();
      onClose();
    } catch (error) {
      console.error('Error verifying prescription:', error);
      alert('Failed to verify prescription');
    } finally {
      setLoading(false);
    }
  };

  if (!prescription) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Prescription Verification</Typography>
          <Chip 
            label={prescription.status.toUpperCase()} 
            color={prescription.status === 'verified' ? 'success' : 'warning'}
          />
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Prescription Image */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Prescription Image</Typography>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <img 
                    src={prescription.imageUrl} 
                    alt="Prescription" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '400px', 
                      objectFit: 'contain',
                      border: '1px solid #ddd',
                      borderRadius: '8px'
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Patient: {prescription.patientId?.name || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Submitted: {new Date(prescription.createdAt).toLocaleString()}
                </Typography>
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    View the prescription image and manually select medicines. The patient can also add OTC items to this order.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>

          {/* Add Medicines */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Add Medicines from Prescription</Typography>
                
                <Autocomplete
                  options={medicines}
                  getOptionLabel={(option) => `${option.name}${option.brand ? ` (${option.brand})` : ''} - Rs. ${option.price}`}
                  value={selectedMedicine}
                  onChange={(e, newValue) => setSelectedMedicine(newValue)}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      label="Search Medicine" 
                      variant="outlined"
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                  )}
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Dosage (e.g., 500mg)"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                      placeholder="500mg"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Frequency (e.g., Twice daily)"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      placeholder="Twice daily"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Instructions"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="After meals"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Add />}
                      onClick={handleAddMedicine}
                      disabled={!selectedMedicine || loading}
                    >
                      Add to Order
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Items - Shows both prescription medicines and OTC items */}
          {order && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Items
                    {order.items.length > 0 && (
                      <Chip 
                        label={`${order.items.filter(i => i.isPrescription).length} Prescription, ${order.items.filter(i => !i.isPrescription).length} OTC`}
                        size="small"
                        sx={{ ml: 2 }}
                        color="info"
                      />
                    )}
                  </Typography>
                  
                  {order.items.length === 0 ? (
                    <Alert severity="info">
                      No items in order yet. Add prescription medicines or wait for patient to add OTC items.
                    </Alert>
                  ) : (
                    <>
                      {/* Prescription Medicines Section */}
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
                                    <TableCell align="right">
                                      Rs. {((item.price || 0) * item.quantity).toFixed(2)}
                                    </TableCell>
                                    <TableCell align="right">
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleRemoveItem(item._id)}
                                        disabled={loading}
                                      >
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

                      {/* OTC Items Section */}
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
                                    <TableCell align="right">
                                      Rs. {((item.price || 0) * item.quantity).toFixed(2)}
                                    </TableCell>
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
                          <Typography variant="h6" color="primary">
                            Rs. {(order.finalAmount || 0).toFixed(2)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}

          {loading && (
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress />
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {order && order.items.length > 0 && !order.finalAmount && (
          <Button
            variant="contained"
            onClick={handleGenerateBill}
            disabled={loading}
          >
            Generate Bill ({order.items.length} items)
          </Button>
        )}
        {order && order.finalAmount && (
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            onClick={handleVerify}
            disabled={loading}
          >
            Send Bill to Patient (Rs. {order.finalAmount?.toFixed(2)})
          </Button>
        )}
        {(!order || order.items.length === 0) && (
          <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
            Add prescription medicines from the image above. Patient can also add OTC items to this order.
          </Typography>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PrescriptionDetail;
