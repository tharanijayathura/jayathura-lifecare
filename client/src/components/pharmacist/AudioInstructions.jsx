import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { pharmacistAPI } from '../../services/api';
import AudioRequestsList from './audio/AudioRequestsList.jsx';
import AudioUploadDialog from './audio/AudioUploadDialog.jsx';

const AudioInstructions = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  useEffect(() => {
    fetchAudioRequests();
  }, []);

  const fetchAudioRequests = async () => {
    try {
      const response = await pharmacistAPI.getAudioRequests();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching audio requests:', error);
    }
  };

  const handleUpload = async (fileToUpload) => {
    if (!selectedOrder) return;
    const formData = new FormData();
    formData.append('audioFile', fileToUpload);
    await pharmacistAPI.provideAudioInstructions(selectedOrder._id, formData);
    alert('Audio instructions uploaded successfully!');
    setUploadDialogOpen(false);
    setSelectedOrder(null);
    fetchAudioRequests();
  };

  const openUploadDialog = (order) => {
    setSelectedOrder(order);
    setUploadDialogOpen(true);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Audio Instruction Requests
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Patients have requested audio instructions for these orders. Record or upload audio instructions.
      </Typography>

      <AudioRequestsList orders={orders} onProvide={openUploadDialog} />

      {/* Upload Audio Dialog */}
      <AudioUploadDialog
        open={uploadDialogOpen}
        order={selectedOrder}
        onClose={() => setUploadDialogOpen(false)}
        onUpload={handleUpload}
      />
    </Box>
  );
};

export default AudioInstructions;

