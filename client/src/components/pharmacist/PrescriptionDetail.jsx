import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Chip,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  ArrowBack,
  ZoomIn,
  Edit,
  Delete,
  Add,
  CheckCircle,
  Cancel,
  Phone,
} from '@mui/icons-material';

const PrescriptionDetail = ({ prescription, onBack }) => {
  const [medicines, setMedicines] = useState([
    { id: 1, name: 'Metformin 500mg', dosage: '1-0-1', qty: 30, stock: 45, status: 'available' },
    { id: 2, name: 'Losartan 50mg', dosage: '0-0-1', qty: 30, stock: 12, status: 'low' },
    { id: 3, name: 'Atorvastatin 20mg', dosage: '0-0-1', qty: 30, stock: 68, status: 'available' },
  ]);
  const [pharmacyNotes, setPharmacyNotes] = useState('');
  const [rejectionDialog, setRejectionDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = () => {
    alert('Prescription approved and added to order!');
    onBack();
  };

  const handleReject = () => {
    if (rejectionReason) {
      alert('Prescription rejected. Patient will be notified.');
      onBack();
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={onBack}>
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h5">
            PRESCRIPTION #{prescription.id} | Patient: {prescription.patient}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Chip label="Pending" color="warning" size="small" />
            <Chip label={prescription.priority} color={prescription.priority === 'High' ? 'error' : 'default'} size="small" />
            <Typography variant="body2" color="text.secondary">
              Upload: {prescription.time}
            </Typography>
          </Stack>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Prescription Image */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              PRESCRIPTION IMAGE
            </Typography>
            <Box
              sx={{
                width: '100%',
                height: 400,
                bgcolor: 'grey.200',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
                mb: 2,
              }}
            >
              <Typography color="text.secondary">Prescription Image Preview</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button size="small" startIcon={<ZoomIn />}>Zoom In</Button>
              <Button size="small">Enhance</Button>
              <Button size="small">Rotate</Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Patient Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              PATIENT INFORMATION
            </Typography>
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="body2" color="text.secondary">Name</Typography>
                <Typography variant="body1" fontWeight="bold">Kumar Perera</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Age | Gender</Typography>
                <Typography variant="body1">52 | Male</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Contact</Typography>
                <Typography variant="body1">077-123-4567</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Allergies</Typography>
                <Typography variant="body1" color="error">Penicillin</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Chronic Conditions</Typography>
                <Typography variant="body1">Diabetes, Hypertension</Typography>
              </Box>
              <Button variant="outlined" size="small" startIcon={<Phone />} sx={{ mt: 1 }}>
                Call Patient
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Medicines List */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              EXTRACT MEDICINES FROM PRESCRIPTION
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Medicine Name</TableCell>
                    <TableCell>Dosage</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {medicines.map((med) => (
                    <TableRow key={med.id}>
                      <TableCell>{med.id}</TableCell>
                      <TableCell>{med.name}</TableCell>
                      <TableCell>{med.dosage}</TableCell>
                      <TableCell>{med.qty} tabs</TableCell>
                      <TableCell>
                        <Chip
                          label={med.stock}
                          size="small"
                          color={med.status === 'low' ? 'warning' : 'success'}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton size="small">
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small">
                            <Delete fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button startIcon={<Add />} sx={{ mt: 2 }}>
              Add Medicine
            </Button>
          </Paper>
        </Grid>

        {/* Pharmacy Notes */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              ADDITIONAL NOTES
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Pharmacy Notes..."
              value={pharmacyNotes}
              onChange={(e) => setPharmacyNotes(e.target.value)}
            />
          </Paper>
        </Grid>

        {/* Verification Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              VERIFICATION ACTIONS
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={handleApprove}
              >
                Approve & Add to Order
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<Cancel />}
                onClick={() => setRejectionDialog(true)}
              >
                Reject Prescription
              </Button>
              <Button variant="outlined">Request Clarification</Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Rejection Dialog */}
      <Dialog open={rejectionDialog} onClose={() => setRejectionDialog(false)}>
        <DialogTitle>Reject Prescription</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Rejection Reason</InputLabel>
            <Select
              value={rejectionReason}
              label="Rejection Reason"
              onChange={(e) => setRejectionReason(e.target.value)}
            >
              <MenuItem value="illegible">Illegible Prescription</MenuItem>
              <MenuItem value="expired">Expired Prescription</MenuItem>
              <MenuItem value="invalid">Invalid Doctor Signature</MenuItem>
              <MenuItem value="missing">Missing Information</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectionDialog(false)}>Cancel</Button>
          <Button onClick={handleReject} variant="contained" color="error" disabled={!rejectionReason}>
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PrescriptionDetail;

