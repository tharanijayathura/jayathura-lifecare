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
  TextField
} from '@mui/material';
import { Check, Close, Visibility } from '@mui/icons-material';
import { prescriptionAPI } from '../../services/api';

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
      const response = await prescriptionAPI.getAll();
      const pending = response.data.filter(p => p.status === 'pending');
      setPrescriptions(pending);
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error);
    }
  };

  // Function 30: markPrescriptionVerified
  const handleVerify = async (prescriptionId) => {
    try {
      await prescriptionAPI.verify(prescriptionId, 'verified');
      fetchPendingPrescriptions(); // Refresh list
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  // Function 31: markPrescriptionRejected
  const handleReject = async () => {
    if (!selectedPrescription || !rejectionReason) return;

    try {
      await prescriptionAPI.verify(selectedPrescription._id, 'rejected', rejectionReason);
      setRejectDialogOpen(false);
      setRejectionReason('');
      fetchPendingPrescriptions();
    } catch (error) {
      console.error('Rejection failed:', error);
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

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Prescription Verification
      </Typography>

      <Grid container spacing={3}>
        {prescriptions.map((prescription) => (
          <Grid item xs={12} md={6} key={prescription._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography variant="h6">
                    Prescription #{prescription._id.slice(-6)}
                  </Typography>
                  <Chip 
                    label="Pending" 
                    color="warning" 
                    size="small" 
                  />
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
                    startIcon={<Check />}
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={() => handleVerify(prescription._id)}
                  >
                    Verify
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

      {/* View Prescription Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Prescription Details</DialogTitle>
        <DialogContent>
          {selectedPrescription && (
            <Box>
              <img 
                src={selectedPrescription.imageUrl} 
                alt="Prescription" 
                style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

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