import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import { Check, Close, Visibility, Refresh } from '@mui/icons-material';
import { pharmacistAPI } from '../../services/api';
import PrescriptionDetail from './PrescriptionDetail';

const PrescriptionVerification = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Function 27: getPendingPrescriptions
  useEffect(() => {
    fetchPendingPrescriptions();
  }, []);

  const fetchPendingPrescriptions = async () => {
    try {
      const response = await pharmacistAPI.getPendingPrescriptions();
      console.log('Fetched prescriptions:', response.data);
      setPrescriptions(response.data || []);
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  // Function 31: markPrescriptionRejected
  const handleReject = async () => {
    if (!selectedPrescription || !rejectionReason) return;

    try {
      await pharmacistAPI.markPrescriptionRejected(selectedPrescription._id, rejectionReason);
      setRejectDialogOpen(false);
      setRejectionReason('');
      setSelectedPrescription(null);
      fetchPendingPrescriptions();
      alert('Prescription rejected successfully');
    } catch (error) {
      console.error('Rejection failed:', error);
      alert('Failed to reject prescription');
    }
  };

  const openRejectDialog = (prescription) => {
    setSelectedPrescription(prescription);
    setRejectDialogOpen(true);
  };

  const openViewDialog = (prescription) => {
    setSelectedPrescription(prescription);
    setViewDialogOpen(true);
  };

  const handlePrescriptionUpdate = () => {
    fetchPendingPrescriptions();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Prescription Verification
        </Typography>
        <Button
          startIcon={<Refresh />}
          variant="outlined"
          onClick={fetchPendingPrescriptions}
        >
          Refresh
        </Button>
      </Box>

      {prescriptions.length === 0 ? (
        <Alert severity="info">
          No pending prescriptions at the moment. Prescriptions will appear here once patients upload them.
        </Alert>
      ) : (
        <Grid container spacing={3}>
        {prescriptions.map((prescription) => (
          <Grid item xs={12} md={6} key={prescription._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography variant="h6">
                    Prescription #{prescription._id.slice(-6)}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip 
                      label="Pending" 
                      color="warning" 
                      size="small" 
                    />
                    {prescription.orderStatus && (
                      <Chip 
                        label={prescription.orderStatus === 'draft' ? 'New Upload' : 'Sent by Patient'} 
                        color={prescription.orderStatus === 'draft' ? 'info' : 'primary'} 
                        size="small" 
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Patient: {prescription.patientId?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Submitted: {new Date(prescription.createdAt).toLocaleDateString()}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    startIcon={<Visibility />}
                    variant="outlined"
                    size="small"
                    onClick={() => openViewDialog(prescription)}
                  >
                    View
                  </Button>
                  <Button
                    startIcon={<Visibility />}
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => openViewDialog(prescription)}
                  >
                    View & Add Medicines
                  </Button>
                  <Button
                    startIcon={<Close />}
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => openRejectDialog(prescription)}
                  >
                    Reject
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        </Grid>
      )}

      {/* Prescription Detail Dialog with Medicine Selection */}
      {selectedPrescription && (
        <PrescriptionDetail
          prescription={selectedPrescription}
          open={viewDialogOpen}
          onClose={() => {
            setViewDialogOpen(false);
            setSelectedPrescription(null);
          }}
          onUpdate={handlePrescriptionUpdate}
        />
      )}

      {/* Reject Prescription Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
        <DialogTitle>Reject Prescription</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Rejection Reason"
            fullWidth
            multiline
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleReject} color="error">Reject</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PrescriptionVerification;