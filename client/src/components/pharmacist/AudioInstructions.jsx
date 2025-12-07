import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Alert,
  CircularProgress,
  IconButton,
  LinearProgress,
  Divider
} from '@mui/material';
import { 
  RecordVoiceOver, 
  Stop, 
  PlayArrow, 
  Pause, 
  Upload,
  CheckCircle,
  Close
} from '@mui/icons-material';
import { pharmacistAPI } from '../../services/api';

const AudioInstructions = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const chunksRef = useRef([]);

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setAudioBlob(file);
    } else {
      alert('Please select an audio file');
    }
  };

  const handleUpload = async () => {
    if (!selectedOrder) return;

    let fileToUpload = null;

    if (audioBlob instanceof File) {
      fileToUpload = audioBlob;
    } else if (audioBlob instanceof Blob) {
      // Convert Blob to File
      fileToUpload = new File([audioBlob], 'audio-recording.webm', { type: 'audio/webm' });
    } else {
      alert('Please record or select an audio file');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('audioFile', fileToUpload);

      await pharmacistAPI.provideAudioInstructions(selectedOrder._id, formData);
      
      alert('Audio instructions uploaded successfully!');
      setUploadDialogOpen(false);
      setSelectedOrder(null);
      setAudioBlob(null);
      setAudioUrl(null);
      setSelectedFile(null);
      fetchAudioRequests();
    } catch (error) {
      console.error('Error uploading audio:', error);
      alert('Failed to upload audio instructions');
    } finally {
      setUploading(false);
    }
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

      {orders.length === 0 ? (
        <Alert severity="info">No pending audio instruction requests</Alert>
      ) : (
        <Grid container spacing={2}>
          {orders.map((order) => (
            <Grid item xs={12} md={6} key={order._id}>
              <Card>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="start" sx={{ mb: 2 }}>
                    <Box>
                      <Typography variant="h6">Order #{order.orderId}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Patient: {order.patientId?.name || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Requested: {new Date(order.audioInstructions?.requestedAt).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Items: {order.items.length} medicines
                      </Typography>
                    </Box>
                    <Chip label="Audio Requested" color="warning" />
                  </Stack>
                  
                  <Button
                    variant="contained"
                    startIcon={<RecordVoiceOver />}
                    onClick={() => openUploadDialog(order)}
                    fullWidth
                  >
                    Provide Audio Instructions
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Upload Audio Dialog */}
      <Dialog 
        open={uploadDialogOpen} 
        onClose={() => setUploadDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Provide Audio Instructions</Typography>
            <IconButton onClick={() => setUploadDialogOpen(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                Order #{selectedOrder.orderId} - {selectedOrder.patientId?.name}
              </Alert>

              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, mb: 1 }}>
                Option 1: Record Audio
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                {!recording ? (
                  <Button
                    variant="outlined"
                    startIcon={<RecordVoiceOver />}
                    onClick={startRecording}
                    fullWidth
                  >
                    Start Recording
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Stop />}
                    onClick={stopRecording}
                    fullWidth
                  >
                    Stop Recording
                  </Button>
                )}
              </Stack>

              {recording && (
                <Box sx={{ mb: 2 }}>
                  <Alert severity="warning" icon={<RecordVoiceOver />}>
                    Recording in progress...
                  </Alert>
                </Box>
              )}

              {audioUrl && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Preview Audio:
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <audio
                      ref={audioRef}
                      src={audioUrl}
                      onEnded={() => setIsPlaying(false)}
                      style={{ width: '100%' }}
                    />
                    <IconButton
                      onClick={isPlaying ? pauseAudio : playAudio}
                      color="primary"
                    >
                      {isPlaying ? <Pause /> : <PlayArrow />}
                    </IconButton>
                  </Stack>
                </Box>
              )}

              <Divider sx={{ my: 2 }}>OR</Divider>

              <Typography variant="subtitle2" gutterBottom sx={{ mb: 1 }}>
                Option 2: Upload Audio File
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<Upload />}
                fullWidth
                sx={{ mb: 2 }}
              >
                Select Audio File
                <input
                  type="file"
                  hidden
                  accept="audio/*"
                  onChange={handleFileSelect}
                />
              </Button>

              {selectedFile && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Selected: {selectedFile.name}
                </Alert>
              )}

              {uploading && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress />
                  <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                    Uploading audio...
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)} disabled={uploading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<CheckCircle />}
            onClick={handleUpload}
            disabled={!audioBlob || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Audio'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AudioInstructions;

