import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  LinearProgress,
  Stack,
  Chip,
  Paper,
  IconButton
} from '@mui/material';
import { CloudUpload, CheckCircle, Image as ImageIcon, PictureAsPdf, Close, UploadFile } from '@mui/icons-material';
import { prescriptionAPI } from '../../services/api';

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

const PrescriptionUpload = ({ onUploaded }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files?.[0] || null);
    setMessage('');
  };

  const isPdf = selectedFile?.type === 'application/pdf' || selectedFile?.name?.toLowerCase().endsWith('.pdf');

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('imageFile', selectedFile);

    try {
      const response = await prescriptionAPI.upload(formData);
      const payload = response.data?.prescription || response.data || {};
      const orderData = response.data?.order || {};
      const meta = {
        id: payload._id || payload.id || `rx-${Date.now()}`,
        fileName: selectedFile.name,
        originalName: selectedFile.name,
        mimeType: payload.mimeType || selectedFile.type,
        status: payload.status || 'pending',
        uploadedAt: new Date().toISOString(),
        orderId: orderData._id || orderData.id,
        order: orderData
      };
      onUploaded?.(meta);
      setMessage('success:Prescription uploaded successfully!');
      setSelectedFile(null);
      if (document.getElementById('prescription-upload')) {
        document.getElementById('prescription-upload').value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('error:Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: COLORS.text, mb: 1 }}>Upload Prescription</Typography>
        <Typography variant="body1" sx={{ color: COLORS.subtext }}>Our pharmacists will review it and prepare your medicines.</Typography>
      </Box>

      <Card sx={{ borderRadius: 4, border: `1px solid ${COLORS.border}`, boxShadow: '0 8px 32px rgba(44,62,80,0.06)' }}>
        <CardContent sx={{ p: 4 }}>
          {message && (
            <Alert 
              severity={message.startsWith('success') ? 'success' : 'error'} 
              sx={{ mb: 3, borderRadius: 3, fontWeight: 500 }}
              icon={message.startsWith('success') ? <CheckCircle /> : undefined}
              onClose={() => setMessage('')}
            >
              {message.split(':')[1]}
            </Alert>
          )}

          <Paper 
            variant="outlined" 
            sx={{ 
              p: 6, 
              textAlign: 'center',
              border: '2px dashed',
              borderRadius: 4,
              borderColor: selectedFile ? COLORS.blue2 : COLORS.border,
              bgcolor: selectedFile ? COLORS.green1 : 'rgba(236, 244, 232, 0.2)',
              transition: 'all 0.3s ease',
              mb: 3,
              position: 'relative'
            }}
          >
            {selectedFile ? (
              <Stack spacing={2} alignItems="center">
                <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                  <IconButton size="small" onClick={() => setSelectedFile(null)} sx={{ color: COLORS.subtext }}>
                    <Close />
                  </IconButton>
                </Box>
                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex' }}>
                  {isPdf ? <PictureAsPdf sx={{ fontSize: 48, color: '#f44336' }} /> : <ImageIcon sx={{ fontSize: 48, color: COLORS.blue2 }} />}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.text }}>{selectedFile.name}</Typography>
                  <Typography variant="caption" sx={{ color: COLORS.subtext }}>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </Box>
                <Chip 
                  label={isPdf ? 'PDF' : 'IMAGE'} 
                  size="small" 
                  sx={{ bgcolor: COLORS.blue2, color: 'white', fontWeight: 800, px: 1 }} 
                />
              </Stack>
            ) : (
              <label htmlFor="prescription-upload" style={{ cursor: 'pointer' }}>
                <Stack spacing={2} alignItems="center">
                  <Box sx={{ p: 3, bgcolor: 'white', borderRadius: '50%', boxShadow: '0 8px 24px rgba(122, 168, 176, 0.15)', display: 'flex', color: COLORS.blue2 }}>
                    <UploadFile sx={{ fontSize: 48 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.text }}>Select Prescription</Typography>
                    <Typography variant="body2" sx={{ color: COLORS.subtext }}>Drag & drop or click to browse</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ mt: 2, color: COLORS.subtext, opacity: 0.8 }}>
                    Supported formats: JPG, PNG, PDF (Max 10MB)
                  </Typography>
                </Stack>
                <input
                  id="prescription-upload"
                  type="file"
                  hidden
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                />
              </label>
            )}
          </Paper>

          <Stack spacing={2}>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              size="large"
              sx={{ 
                borderRadius: 3, 
                py: 1.8, 
                fontWeight: 800, 
                textTransform: 'none', 
                fontSize: '1.1rem',
                bgcolor: COLORS.green3,
                color: COLORS.text,
                boxShadow: '0 4px 14px rgba(171, 231, 178, 0.4)',
                '&:hover': { bgcolor: COLORS.green2 },
                '&.Mui-disabled': { bgcolor: '#f5f5f5', color: '#bdbdbd' }
              }}
            >
              {uploading ? 'Processing Upload...' : 'Upload Prescription Now'}
            </Button>
            
            {uploading && (
              <Box sx={{ width: '100%', mt: 1 }}>
                <LinearProgress sx={{ borderRadius: 2, height: 8, bgcolor: COLORS.green1, '& .MuiLinearProgress-bar': { bgcolor: COLORS.green3 } }} />
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ mt: 4 }}>
        <Alert 
          severity="info" 
          variant="outlined" 
          sx={{ borderRadius: 4, borderColor: COLORS.blue1, bgcolor: 'rgba(147, 191, 199, 0.05)' }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>Quick Instructions:</Typography>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li><Typography variant="caption">Ensure the doctor's name and signature are visible.</Typography></li>
            <li><Typography variant="caption">Date of prescription should be within the last 6 months.</Typography></li>
            <li><Typography variant="caption">Patient name should match your profile name.</Typography></li>
          </ul>
        </Alert>
      </Box>
    </Box>
  );
};

export default PrescriptionUpload;