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
  Chip, 
  CircularProgress, 
  Stack, 
  Paper, 
  IconButton, 
  Divider 
} from '@mui/material';
import { CheckCircle, Close, Assignment, Assessment } from '@mui/icons-material';
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
      if (response.data?.order) {
        setOrder(response.data.order);
      } else {
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
    if (!selectedMedicine || !quantity) return;

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
      const response = await pharmacistAPI.getPrescriptionDetails(prescription._id);
      setOrder(response.data.order);
      onUpdate?.();
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBill = async () => {
    if (!order || order.items.length === 0) {
      alert('Please add medicines first');
      return;
    }
    try {
      setLoading(true);
      await pharmacistAPI.generateAutoBill(order._id);
      onUpdate?.();
      onClose();
    } catch (error) {
      console.error('Error generating bill:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      await pharmacistAPI.markPrescriptionVerified(prescription._id);
      onUpdate?.();
      onClose();
    } catch (error) {
      console.error('Error verifying prescription:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!prescription) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xl" 
      fullWidth 
      scroll="body"
      PaperProps={{
        sx: { borderRadius: 8, bgcolor: '#f8fafc', backgroundImage: 'none' }
      }}
    >
      <DialogTitle sx={{ p: 4, bgcolor: 'white', borderBottom: `1px solid ${COLORS.border}` }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: COLORS.green1, color: COLORS.blue2, display: 'flex' }}>
                <Assignment />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 900, color: COLORS.text }}>
                Prescription Verification
              </Typography>
            </Stack>
            <Typography sx={{ color: COLORS.subtext, fontWeight: 500, fontSize: '0.9rem' }}>
              Order #{prescription._id?.slice(-6).toUpperCase()} • Patient: {prescription.patientId?.name}
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ bgcolor: '#f1f5f9' }}><Close /></IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, md: 4 } }}>
        <Grid container spacing={4}>
          {/* Prescription View */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'sticky', top: 0 }}>
              <PrescriptionImage prescription={prescription} />
            </Box>
          </Grid>

          {/* Pharmacist Actions */}
          <Grid item xs={12} md={7}>
            <Stack spacing={4}>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: COLORS.blue2, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Verification Form
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
                <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: COLORS.blue2, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Consolidated Order List
                </Typography>
                {order && order.items?.length > 0 ? (
                  <OrderItems order={order} loading={loading} handleRemoveItem={handleRemoveItem} />
                ) : (
                  <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 6, border: `2px dashed ${COLORS.border}`, bgcolor: 'white' }}>
                    <Assessment sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
                    <Typography sx={{ color: COLORS.subtext, fontWeight: 600 }}>Ready to verify medicines.</Typography>
                  </Paper>
                )}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 4, bgcolor: 'white', borderTop: `1px solid ${COLORS.border}`, gap: 2 }}>
        <Button 
          onClick={onClose} 
          sx={{ borderRadius: 4, px: 3, fontWeight: 700, color: COLORS.subtext }}
        >
          Cancel Process
        </Button>
        <Box sx={{ flex: 1 }} />
        
        {order && order.items?.length > 0 && !order.finalAmount && (
          <Button
            variant="contained"
            onClick={handleGenerateBill}
            disabled={loading}
            sx={{ 
              borderRadius: 4, 
              px: 4, 
              py: 1.5,
              bgcolor: COLORS.blue2, 
              fontWeight: 800,
              boxShadow: '0 8px 20px rgba(122, 168, 176, 0.2)',
              '&:hover': { bgcolor: COLORS.blue1 }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Finalize & Calculate Bill'}
          </Button>
        )}

        {order && order.finalAmount && (
          <Button
            variant="contained"
            startIcon={<CheckCircle />}
            onClick={handleVerify}
            disabled={loading}
            sx={{ 
              borderRadius: 4, 
              px: 4, 
              py: 1.5,
              bgcolor: COLORS.text, 
              color: 'white',
              fontWeight: 900,
              '&:hover': { bgcolor: '#000' }
            }}
          >
            Confirm Approval (Rs. {order.finalAmount?.toFixed(2)})
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PrescriptionDetail;
