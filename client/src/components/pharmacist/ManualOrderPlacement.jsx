import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  TextField, 
  Autocomplete, 
  Button, 
  Stack, 
  IconButton, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Add, 
  Delete, 
  ShoppingCart, 
  Person, 
  Search, 
  CheckCircle,
  PointOfSale
} from '@mui/icons-material';
import { pharmacistAPI, medicineAPI } from '../../services/api';

const COLORS = {
  green1: '#ECF4E8',
  green2: '#CBF3BB',
  green3: '#ABE7B2',
  blue1: '#93BFC7',
  blue2: '#7AA8B0',
  text: '#2C3E50',
  subtext: '#546E7A',
  border: 'rgba(147, 191, 199, 0.35)',
};

const ManualOrderPlacement = () => {
  const [patients, setPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [patientsRes, medicinesRes] = await Promise.all([
        pharmacistAPI.getPatients(),
        medicineAPI.getAllPharmacist({ limit: 100 })
      ]);
      setPatients(patientsRes.data || []);
      setMedicines(medicinesRes.data || []);
    } catch (err) {
      console.error('Error fetching initial data:', err);
      setError('Failed to load system data');
    }
  };

  const handleAddItem = () => {
    if (!selectedMedicine || !quantity) return;
    
    const existingItem = orderItems.find(i => i.medicineId === (selectedMedicine._id || selectedMedicine.id));
    if (existingItem) {
      setOrderItems(orderItems.map(i => 
        i.medicineId === (selectedMedicine._id || selectedMedicine.id) 
          ? { ...i, quantity: i.quantity + quantity } 
          : i
      ));
    } else {
      setOrderItems([...orderItems, {
        medicineId: selectedMedicine._id || selectedMedicine.id,
        medicineName: selectedMedicine.name,
        quantity,
        price: selectedMedicine.price,
        isPrescription: false
      }]);
    }
    
    setSelectedMedicine(null);
    setQuantity(1);
  };

  const handleRemoveItem = (medicineId) => {
    setOrderItems(orderItems.filter(i => i.medicineId !== medicineId));
  };

  const handlePlaceOrder = async () => {
    if (!selectedPatient || orderItems.length === 0) return;
    
    try {
      setLoading(true);
      setError('');
      await pharmacistAPI.createManualOrder({
        patientId: selectedPatient._id,
        items: orderItems,
        paymentMethod: 'cod' // Assuming COD for manual for now
      });
      setSuccess('Order placed successfully!');
      setOrderItems([]);
      setSelectedPatient(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.text, mb: 3, display: 'flex', alignItems: 'center' }}>
        <PointOfSale sx={{ mr: 1, color: COLORS.blue2 }} /> Manual Order Placement
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3}>
        {/* Left Side: Configuration */}
        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            {/* Patient Selection */}
            <Paper sx={{ p: 3, borderRadius: 4, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.blue2, fontWeight: 800, mb: 2, textTransform: 'uppercase' }}>1. Select Patient</Typography>
              <Autocomplete
                options={patients}
                getOptionLabel={(option) => `${option.name} (${option.phone || 'No phone'})`}
                value={selectedPatient}
                onChange={(e, newValue) => setSelectedPatient(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Search Patient" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box>
                      <Typography variant="body2" fontWeight={700}>{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{option.email} | {option.phone}</Typography>
                    </Box>
                  </li>
                )}
              />
              {selectedPatient && (
                <Box sx={{ mt: 2, p: 2, bgcolor: COLORS.green1, borderRadius: 3, display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1, color: COLORS.blue2 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedPatient.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{selectedPatient.address?.city}</Typography>
                  </Box>
                </Box>
              )}
            </Paper>

            {/* Medicine Selection */}
            <Paper sx={{ p: 3, borderRadius: 4, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.blue2, fontWeight: 800, mb: 2, textTransform: 'uppercase' }}>2. Add Items</Typography>
              <Stack spacing={2}>
                <Autocomplete
                  options={medicines}
                  getOptionLabel={(option) => `${option.name} (${option.brand}) - Rs. ${option.price}`}
                  value={selectedMedicine}
                  onChange={(e, newValue) => setSelectedMedicine(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Search Inventory" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                  )}
                />
                <Box display="flex" gap={2}>
                  <TextField 
                    label="Qty" 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    sx={{ width: 100, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                  <Button 
                    fullWidth 
                    variant="contained" 
                    startIcon={<Add />}
                    onClick={handleAddItem}
                    disabled={!selectedMedicine}
                    sx={{ borderRadius: 3, bgcolor: COLORS.blue2, fontWeight: 700 }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Grid>

        {/* Right Side: Cart Summary */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 4, border: `1px solid ${COLORS.border}`, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Order Cart</Typography>
              <Chip label={`${orderItems.length} items`} sx={{ bgcolor: COLORS.green2, fontWeight: 700 }} />
            </Box>

            <TableContainer sx={{ minHeight: 300 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Item</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Qty</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                        <ShoppingCart sx={{ fontSize: 48, color: 'rgba(0,0,0,0.1)', mb: 2 }} />
                        <Typography color="text.secondary">Cart is empty. Add items to proceed.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    orderItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontWeight: 600 }}>{item.medicineName}</TableCell>
                        <TableCell>Rs. {item.price}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Rs. {(item.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell>
                          <IconButton size="small" color="error" onClick={() => handleRemoveItem(item.medicineId)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 4, p: 3, bgcolor: COLORS.green1, borderRadius: 4 }}>
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Order Total</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>Rs. {totalAmount.toFixed(2)}</Typography>
                </Box>
                <Button 
                  fullWidth 
                  variant="contained" 
                  size="large"
                  startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <CheckCircle />}
                  disabled={!selectedPatient || orderItems.length === 0 || loading}
                  onClick={handlePlaceOrder}
                  sx={{ 
                    mt: 2, 
                    borderRadius: 3, 
                    bgcolor: COLORS.blue2, 
                    fontWeight: 800,
                    py: 1.5,
                    '&:hover': { bgcolor: COLORS.blue1 }
                  }}
                >
                  Place Order Now
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManualOrderPlacement;
