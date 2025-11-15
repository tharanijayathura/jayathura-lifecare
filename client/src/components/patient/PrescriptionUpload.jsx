import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  LinearProgress
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { prescriptionAPI } from '../../services/api';

const PrescriptionUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('prescription', selectedFile);

    try {
      const response = await prescriptionAPI.upload(formData);
      setMessage('Prescription uploaded successfully! It will be verified by our pharmacist.');
      setSelectedFile(null);
      // Reset file input
      document.getElementById('prescription-upload').value = '';
    } catch (error) {
      setMessage(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Upload Prescription (Function 4)
        </Typography>
        
        {message && (
          <Alert severity={message.includes('success') ? 'success' : 'error'} sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUpload />}
            disabled={uploading}
          >
            Select File
            <input
              id="prescription-upload"
              type="file"
              hidden
              accept="image/*,.pdf"
              onChange={handleFileSelect}
            />
          </Button>
          
          {selectedFile && (
            <Typography variant="body2">
              Selected: {selectedFile.name}
            </Typography>
          )}
          
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Prescription'}
          </Button>
        </Box>

        {uploading && <LinearProgress sx={{ mt: 2 }} />}

        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          Supported formats: JPG, PNG, PDF. Max size: 5MB
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PrescriptionUpload;