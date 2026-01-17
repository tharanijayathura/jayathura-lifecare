import React, { useState, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton, Stack, Box, Alert, Button, LinearProgress, Divider } from '@mui/material';
import { Close, RecordVoiceOver, Stop, PlayArrow, Pause, Upload, CheckCircle } from '@mui/icons-material';

const AudioUploadDialog = ({ open, order, onClose, onUpload }) => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploading, setUploading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => { if (event.data.size > 0) chunksRef.current.push(event.data); };
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

  const stopRecording = () => { if (mediaRecorderRef.current && recording) { mediaRecorderRef.current.stop(); setRecording(false); } };
  const playAudio = () => { if (audioRef.current) { audioRef.current.play(); setIsPlaying(true); } };
  const pauseAudio = () => { if (audioRef.current) { audioRef.current.pause(); setIsPlaying(false); } };

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

  const handleUploadClick = async () => {
    if (!order) return;
    let fileToUpload = null;
    if (audioBlob instanceof File) fileToUpload = audioBlob;
    else if (audioBlob instanceof Blob) fileToUpload = new File([audioBlob], 'audio-recording.webm', { type: 'audio/webm' });
    else { alert('Please record or select an audio file'); return; }
    setUploading(true);
    try {
      await onUpload(fileToUpload);
    } finally {
      setUploading(false);
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Provide Audio Instructions</Typography>
          <IconButton onClick={onClose}><Close /></IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>Order #{order.orderId} - {order.patientId?.name}</Alert>
        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, mb: 1 }}>Option 1: Record Audio</Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          {!recording ? (
            <Button variant="outlined" startIcon={<RecordVoiceOver />} onClick={startRecording} fullWidth>Start Recording</Button>
          ) : (
            <Button variant="contained" color="error" startIcon={<Stop />} onClick={stopRecording} fullWidth>Stop Recording</Button>
          )}
        </Stack>
        {recording && <Alert severity="warning" icon={<RecordVoiceOver />}>Recording in progress...</Alert>}
        {audioUrl && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Preview Audio:</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} style={{ width: '100%' }} />
              <IconButton onClick={isPlaying ? pauseAudio : playAudio} color="primary">{isPlaying ? <Pause /> : <PlayArrow />}</IconButton>
            </Stack>
          </Box>
        )}
        <Divider sx={{ my: 2 }}>OR</Divider>
        <Typography variant="subtitle2" gutterBottom sx={{ mb: 1 }}>Option 2: Upload Audio File</Typography>
        <Button variant="outlined" component="label" startIcon={<Upload />} fullWidth sx={{ mb: 2 }}>
          Select Audio File
          <input type="file" hidden accept="audio/*" onChange={handleFileSelect} />
        </Button>
        {selectedFile && <Alert severity="success" sx={{ mb: 2 }}>Selected: {selectedFile.name}</Alert>}
        {uploading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress />
            <Typography variant="body2" align="center" sx={{ mt: 1 }}>Uploading audio...</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={uploading}>Cancel</Button>
        <Button variant="contained" startIcon={<CheckCircle />} onClick={handleUploadClick} disabled={!audioBlob || uploading}>
          {uploading ? 'Uploading...' : 'Upload Audio'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AudioUploadDialog;
