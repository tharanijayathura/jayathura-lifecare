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

  const COLORS = {
    green1: '#ECF4E8',
    green2: '#CBF3BB',
    green3: '#ABE7B2',
    blue1: '#93BFC7',
    blue2: '#7AA8B0',
    text: '#1e293b',
    subtext: '#64748b',
    border: 'rgba(147, 191, 199, 0.25)',
  };

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
        paymentMethod: 'cod'
      });
      setSuccess('Order placed successfully! ✨');
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
    <Box sx={{ p: { xs: 1, md: 0 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: COLORS.text, mb: 1 }}>
          Create New Order
        </Typography>
        <Typography sx={{ color: COLORS.subtext, fontWeight: 500 }}>
          Process walk-in or phone orders with manual inventory deduction
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 4 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 4 }}>{success}</Alert>}

      <Grid container spacing={4}>
        {/* Step 1 & 2: Input */}
        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            {/* Patient Search */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: `1px solid ${COLORS.border}`, bgcolor: 'white' }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: COLORS.green1, color: COLORS.blue2, display: 'flex' }}>
                  <Person />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Search Patient</Typography>
              </Stack>
              
              <Autocomplete
                options={patients}
                getOptionLabel={(option) => `${option.name} (${option.phone || 'N/A'})`}
                value={selectedPatient}
                onChange={(e, newValue) => setSelectedPatient(newValue)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: '#f8fafc' } }}
                renderInput={(params) => <TextField {...params} placeholder="Name or phone number..." variant="outlined" />}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box sx={{ py: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{option.name}</Typography>
                      <Typography variant="caption" sx={{ color: COLORS.subtext }}>{option.phone} • {option.email}</Typography>
                    </Box>
                  </li>
                )}
              />
              
              {selectedPatient && (
                <Box sx={{ mt: 3, p: 2.5, bgcolor: COLORS.green1, borderRadius: 4, border: `1px solid ${COLORS.green3}`, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'white' }}><CheckCircle sx={{ color: COLORS.blue2 }} /></Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: COLORS.text }}>{selectedPatient.name}</Typography>
                    <Typography variant="caption" sx={{ color: COLORS.subtext }}>Active Profile Selected</Typography>
                  </Box>
                </Box>
              )}
            </Paper>

            {/* Medicine Add */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: `1px solid ${COLORS.border}`, bgcolor: 'white' }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: COLORS.blue1 + '20', color: COLORS.blue2, display: 'flex' }}>
                  <Add />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Add Medicines</Typography>
              </Stack>

              <Stack spacing={2.5}>
                <Autocomplete
                  options={medicines}
                  getOptionLabel={(option) => `${option.name} (${option.brand})`}
                  value={selectedMedicine}
                  onChange={(e, newValue) => setSelectedMedicine(newValue)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: '#f8fafc' } }}
                  renderInput={(params) => <TextField {...params} placeholder="Search inventory..." variant="outlined" />}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField 
                    label="Quantity" 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    sx={{ width: 140, '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: '#f8fafc' } }}
                  />
                  <Button 
                    fullWidth 
                    variant="contained" 
                    startIcon={<Add />}
                    onClick={handleAddItem}
                    disabled={!selectedMedicine}
                    sx={{ 
                      borderRadius: 4, 
                      bgcolor: COLORS.blue2, 
                      fontWeight: 800,
                      boxShadow: '0 8px 20px rgba(122, 168, 176, 0.25)',
                      '&:hover': { bgcolor: COLORS.blue1 }
                    }}
                  >
                    Add Item
                  </Button>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Grid>

        {/* Summary & Checkout */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: `1px solid ${COLORS.border}`, bgcolor: 'white', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>Checkout Cart</Typography>
              <Chip label={`${orderItems.length} Products`} sx={{ bgcolor: COLORS.green2, fontWeight: 800, color: COLORS.text }} />
            </Box>

            <TableContainer sx={{ flex: 1 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& th': { borderBottom: '2px solid #f1f5f9', color: COLORS.subtext, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' } }}>
                    <TableCell>Product Details</TableCell>
                    <TableCell align="center">Qty</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ border: 0 }}>
                        <Box sx={{ py: 10, textAlign: 'center' }}>
                          <ShoppingCart sx={{ fontSize: 64, color: '#e2e8f0', mb: 2 }} />
                          <Typography sx={{ color: COLORS.subtext, fontWeight: 600 }}>Your cart is empty</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    orderItems.map((item, index) => (
                      <TableRow key={index} sx={{ '& td': { borderBottom: '1px solid #f1f5f9', py: 2.5 } }}>
                        <TableCell>
                          <Typography sx={{ fontWeight: 700, color: COLORS.text }}>{item.medicineName}</Typography>
                          <Typography variant="caption" sx={{ color: COLORS.subtext }}>Rs. {item.price} per unit</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={item.quantity} size="small" sx={{ fontWeight: 800, bgcolor: '#f1f5f9' }} />
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontWeight: 800 }}>Rs. {(item.price * item.quantity).toFixed(2)}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" sx={{ color: '#f43f5e', '&:hover': { bgcolor: '#fff1f2' } }} onClick={() => handleRemoveItem(item.medicineId)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 4, p: 4, borderRadius: 6, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ color: COLORS.subtext, fontWeight: 600 }}>Payable Amount</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: COLORS.blue2 }}>
                    Rs. {totalAmount.toFixed(2)}
                  </Typography>
                </Box>
                <Button 
                  fullWidth 
                  variant="contained" 
                  size="large"
                  disabled={!selectedPatient || orderItems.length === 0 || loading}
                  onClick={handlePlaceOrder}
                  sx={{ 
                    borderRadius: 4, 
                    bgcolor: COLORS.text, 
                    color: 'white',
                    fontWeight: 900,
                    py: 2,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#000' },
                    '&.Mui-disabled': { bgcolor: '#e2e8f0' }
                  }}
                >
                  {loading ? <CircularProgress size={28} color="inherit" /> : 'Confirm and Place Order'}
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
