import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Grid, Chip, CircularProgress, Stack } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { pharmacistAPI, medicineAPI } from '../../services/api';
import PrescriptionImage from './prescription/PrescriptionImage';
import MedicineAddForm from './prescription/MedicineAddForm';
import OrderItems from './prescription/OrderItems';

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

  useEffect(() => {
    fetchMedicines();
  }, [searchTerm]);

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
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth scroll="body">
      <DialogTitle sx={{ bgcolor: COLORS.green1, pb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.text }}>
              Prescription Order Placement
            </Typography>
            <Typography variant="body2" sx={{ color: COLORS.subtext }}>
              Patient: {prescription.patientId?.name} | {new Date(prescription.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          <Chip 
            label={prescription.status.toUpperCase()} 
            color={prescription.status === 'verified' ? 'success' : 'warning'}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          />
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={4}>
          {/* Sticky Prescription View */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'sticky', top: 20 }}>
              <PrescriptionImage prescription={prescription} />
            </Box>
          </Grid>

          {/* Action and Items Panel */}
          <Grid item xs={12} md={7}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" sx={{ color: COLORS.blue2, fontWeight: 800, mb: 2, textTransform: 'uppercase' }}>
                  1. Identify & Add Medicines
                </Typography>
                <MedicineAddForm
                  medicines={medicines}
                  selectedMedicine={selectedMedicine}
                  setSelectedMedicine={setSelectedMedicine}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  dosage={dosage}
                  setDosage={setDosage}
                  frequency={frequency}
                  setFrequency={setFrequency}
                  instructions={instructions}
                  setInstructions={setInstructions}
                  loading={loading}
                  onAdd={handleAddMedicine}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: COLORS.blue2, fontWeight: 800, mb: 2, textTransform: 'uppercase' }}>
                  2. Review Order Summary
                </Typography>
                {order ? (
                  <OrderItems order={order} loading={loading} handleRemoveItem={handleRemoveItem} />
                ) : (
                  <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 4, border: `2px dashed ${COLORS.border}` }}>
                    <Typography sx={{ color: COLORS.subtext }}>No items added to this order yet.</Typography>
                  </Paper>
                )}
              </Box>
              
              {loading && (
                <Box display="flex" justifyContent="center" p={2}>
                  <CircularProgress size={32} sx={{ color: COLORS.blue2 }} />
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 3, bgcolor: '#fcfdfc' }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>Close</Button>
        <Box sx={{ flex: 1 }} />
        {order && order.items.length > 0 && !order.finalAmount && (
          <Button
            variant="contained"
            onClick={handleGenerateBill}
            disabled={loading}
            sx={{ bgcolor: COLORS.blue2, borderRadius: 2, px: 4, '&:hover': { bgcolor: COLORS.blue1 } }}
          >
            Calculate & Generate Bill
          </Button>
        )}
        {order && order.finalAmount && (
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            onClick={handleVerify}
            disabled={loading}
            sx={{ bgcolor: COLORS.green3, color: COLORS.text, fontWeight: 700, borderRadius: 2, px: 4, '&:hover': { bgcolor: COLORS.green2 } }}
          >
            Approve & Send to Patient (Rs. {order.finalAmount?.toFixed(2)})
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PrescriptionDetail;
