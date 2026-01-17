import React from 'react';
import { Card, CardContent, Typography, Box, Alert } from '@mui/material';

const PrescriptionImage = ({ prescription }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>Prescription Image</Typography>
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <img
          src={prescription.imageUrl}
          alt="Prescription"
          style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', border: '1px solid #ddd', borderRadius: '8px' }}
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
);

export default PrescriptionImage;
