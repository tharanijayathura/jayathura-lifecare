import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Stack, Button, CircularProgress } from '@mui/material';
import { Refresh, MicNone } from '@mui/icons-material';
import { pharmacistAPI } from '../../services/api';
import AudioRequestsList from './audio/AudioRequestsList.jsx';
import AudioUploadDialog from './audio/AudioUploadDialog.jsx';

const AudioInstructions = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

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
    fetchAudioRequests();
  }, []);

  const fetchAudioRequests = async () => {
    try {
      setLoading(true);
      const response = await pharmacistAPI.getAudioRequests();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching audio requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (fileToUpload) => {
    if (!selectedOrder) return;
    try {
      const formData = new FormData();
      formData.append('audioFile', fileToUpload);
      await pharmacistAPI.provideAudioInstructions(selectedOrder._id, formData);
      setUploadDialogOpen(false);
      setSelectedOrder(null);
      fetchAudioRequests();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const openUploadDialog = (order) => {
    setSelectedOrder(order);
    setUploadDialogOpen(true);
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="400px">
      <CircularProgress sx={{ color: COLORS.blue2 }} />
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 1, md: 0 } }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: COLORS.text, mb: 1 }}>
            Audio Assistance
          </Typography>
          <Typography sx={{ color: COLORS.subtext, fontWeight: 500 }}>
            {orders.length} patients awaiting personalized audio guidance for their prescriptions
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<Refresh />} 
          onClick={fetchAudioRequests}
          sx={{ borderRadius: 3, fontWeight: 700, color: COLORS.blue2, borderColor: COLORS.blue2 }}
        >
          Check Requests
        </Button>
      </Box>

      {orders.length === 0 ? (
        <Paper elevation={0} sx={{ py: 12, textAlign: 'center', borderRadius: 8, border: `2px dashed ${COLORS.border}`, bgcolor: 'white' }}>
          <Box sx={{ p: 3, borderRadius: '50%', bgcolor: COLORS.green1, display: 'inline-flex', mb: 3 }}>
            <MicNone sx={{ fontSize: 48, color: COLORS.blue2 }} />
          </Box>
          <Typography variant="h6" sx={{ color: COLORS.text, fontWeight: 800 }}>No Pending Audio Requests</Typography>
          <Typography sx={{ color: COLORS.subtext, maxWidth: 400, mx: 'auto', mt: 1 }}>
            When patients request audio instructions during checkout, they will appear here for you to record.
          </Typography>
        </Paper>
      ) : (
        <AudioRequestsList orders={orders} onProvide={openUploadDialog} />
      )}

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
