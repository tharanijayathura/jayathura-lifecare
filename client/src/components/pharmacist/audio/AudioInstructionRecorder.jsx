import React, { useState, useRef, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Stack, 
  Button, 
  IconButton, 
  LinearProgress, 
  Alert, 
  Chip,
  Divider,
  CircularProgress
} from '@mui/material';
import { 
  VolumeUp, 
  Mic, 
  Stop, 
  PlayArrow, 
  Pause, 
  Upload, 
  CheckCircle,
  Delete,
  Replay,
  MedicationLiquid
} from '@mui/icons-material';
import { pharmacistAPI, getPublicFileUrl } from '../../../services/api';

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

const AudioInstructionRecorder = ({ order, onUploadSuccess }) => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const chunksRef = useRef([]);

  const hasExistingAudio = !!order?.audioInstructions?.url;
  const wasRequested = !!order?.audioInstructions?.requested;

  useEffect(() => {
    // If the order already has an audio URL, set it
    if (order?.audioInstructions?.url) {
      setAudioUrl(getPublicFileUrl(order.audioInstructions.url));
      setSuccessMsg('Audio instructions guide has already been uploaded.');
    } else {
      setAudioUrl(null);
      setSuccessMsg('');
    }
    setAudioBlob(null);
    setSelectedFile(null);
    setErrorMsg('');
  }, [order]);

  const startRecording = async () => {
    try {
      setErrorMsg('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
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
      setErrorMsg('Error accessing microphone. Please check permissions.');
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
      setErrorMsg('');
      setSuccessMsg('');
    } else {
      setErrorMsg('Please select a valid audio file');
    }
  };

  const handleUploadClick = async () => {
    if (!order) return;
    let fileToUpload = null;
    if (audioBlob instanceof File) {
      fileToUpload = audioBlob;
    } else if (audioBlob instanceof Blob) {
      fileToUpload = new File([audioBlob], 'audio-recording.webm', { type: 'audio/webm' });
    } else {
      setErrorMsg('Please record or select an audio file first');
      return;
    }

    setUploading(true);
    setErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('audioFile', fileToUpload);
      const response = await pharmacistAPI.provideAudioInstructions(order._id, formData);
      setSuccessMsg('Audio instructions uploaded successfully!');
      setSelectedFile(null);
      setAudioBlob(null);
      if (onUploadSuccess) {
        onUploadSuccess(response.data.order || response.data);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setErrorMsg('Failed to upload audio file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAudio = async () => {
    if (!order) return;
    setDeleting(true);
    setErrorMsg('');
    try {
      const response = await pharmacistAPI.deleteAudioInstructions(order._id);
      setAudioUrl(null);
      setAudioBlob(null);
      setSelectedFile(null);
      setSuccessMsg('');
      setIsPlaying(false);
      if (onUploadSuccess) {
        onUploadSuccess(response.data.order || response.data);
      }
    } catch (error) {
      console.error('Delete failed:', error);
      setErrorMsg('Failed to delete audio. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleClear = () => {
    setAudioBlob(null);
    setAudioUrl(order?.audioInstructions?.url ? getPublicFileUrl(order.audioInstructions.url) : null);
    setSelectedFile(null);
    setErrorMsg('');
    if (!order?.audioInstructions?.url) {
      setSuccessMsg('');
    }
  };

  // Determine the status chip
  const getStatusChip = () => {
    if (hasExistingAudio) {
      return { label: 'GUIDE UPLOADED', bgcolor: COLORS.green1, color: '#059669' };
    }
    if (wasRequested) {
      return { label: 'PATIENT REQUESTED', bgcolor: '#fff7ed', color: '#ea580c' };
    }
    return { label: 'NOT YET PROVIDED', bgcolor: '#f1f5f9', color: COLORS.subtext };
  };

  const statusChip = getStatusChip();

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: 6, 
        border: wasRequested && !hasExistingAudio 
          ? '1.5px solid rgba(234, 88, 12, 0.25)' 
          : `1px solid ${COLORS.border}`, 
        bgcolor: 'white',
        boxShadow: '0 4px 16px rgba(0,0,0,0.015)'
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: COLORS.blue2, textTransform: 'uppercase', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <VolumeUp fontSize="small" /> Voice Guide
        </Typography>
        <Chip 
          label={statusChip.label} 
          size="small" 
          sx={{ 
            bgcolor: statusChip.bgcolor, 
            color: statusChip.color, 
            fontWeight: 800, 
            borderRadius: 2,
            fontSize: '0.62rem'
          }} 
        />
      </Stack>

      {/* Medicine items context — so pharmacist knows what to talk about */}
      {order?.items?.length > 0 && !hasExistingAudio && (
        <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fafc', border: '1px solid #f1f5f9', mb: 2.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.blue2, display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            <MedicationLiquid sx={{ fontSize: 14 }} /> Items to cover
          </Typography>
          <Stack spacing={0.5}>
            {order.items.map((item, idx) => (
              <Typography key={idx} variant="caption" sx={{ color: COLORS.text, fontWeight: 600, lineHeight: 1.6 }}>
                {idx + 1}. {item.medicineName} (x{item.quantity}){item.dosage ? ` — ${item.dosage}` : ''}{item.frequency ? `, ${item.frequency}` : ''}
              </Typography>
            ))}
          </Stack>
        </Box>
      )}

      <Typography variant="body2" sx={{ color: COLORS.subtext, mb: 2.5, fontSize: '0.8rem' }}>
        {wasRequested 
          ? 'The patient has requested voice guidance. Record or upload instructions for dosage and schedules.' 
          : 'You can proactively provide voice guidance to help this patient understand their medication.'}
      </Typography>

      {errorMsg && <Alert severity="error" sx={{ mb: 2, borderRadius: 3, py: 0.5 }}>{errorMsg}</Alert>}
      {successMsg && <Alert severity="success" sx={{ mb: 2, borderRadius: 3, py: 0.5 }}>{successMsg}</Alert>}

      {/* If audio already uploaded — show player + delete/re-record */}
      {hasExistingAudio && !audioBlob && !selectedFile && (
        <Stack spacing={2}>
          <Box sx={{ p: 2, borderRadius: 4, border: `1px solid ${COLORS.border}`, bgcolor: '#f8fafc' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.text, display: 'block', mb: 1 }}>
              Current Guide
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <audio 
                ref={audioRef} 
                src={audioUrl} 
                onEnded={() => setIsPlaying(false)} 
                style={{ display: 'none' }} 
              />
              <IconButton 
                onClick={isPlaying ? pauseAudio : playAudio} 
                color="primary"
                sx={{ bgcolor: 'white', border: `1px solid ${COLORS.border}`, p: 1 }}
              >
                {isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
                  Uploaded Guide
                </Typography>
                <Typography variant="caption" sx={{ color: COLORS.subtext }}>
                  {isPlaying ? 'Playing...' : 'Click play to review'}
                  {order.audioInstructions?.providedAt && ` • ${new Date(order.audioInstructions.providedAt).toLocaleString()}`}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <Delete />}
              onClick={handleDeleteAudio}
              disabled={deleting || uploading}
              fullWidth
              sx={{ 
                borderRadius: 3, py: 1, 
                borderColor: '#f43f5e', color: '#f43f5e', 
                textTransform: 'none', fontWeight: 700,
                '&:hover': { bgcolor: '#fff1f2', borderColor: '#f43f5e' }
              }}
            >
              {deleting ? 'Deleting...' : 'Delete Guide'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Replay />}
              onClick={() => {
                // Clear existing audio to show recording UI
                setAudioUrl(null);
                setSuccessMsg('');
              }}
              disabled={deleting || uploading}
              fullWidth
              sx={{ 
                borderRadius: 3, py: 1, 
                borderColor: COLORS.blue2, color: COLORS.blue2, 
                textTransform: 'none', fontWeight: 700 
              }}
            >
              Re-record
            </Button>
          </Stack>
        </Stack>
      )}

      {/* Recording / Upload UI — shown when no existing audio OR re-recording */}
      {(!hasExistingAudio || audioBlob || selectedFile || (!audioUrl && !audioBlob)) && (
        <Stack spacing={2.5}>
          {/* Record Option */}
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.text, display: 'block', mb: 1 }}>
              Option 1: Record Voice Instructions
            </Typography>
            {!recording ? (
              <Button 
                variant="outlined" 
                startIcon={<Mic />} 
                onClick={startRecording}
                disabled={uploading}
                sx={{ borderRadius: 3, py: 1, borderColor: COLORS.blue2, color: COLORS.blue2, textTransform: 'none', fontWeight: 700 }}
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
                sx={{ borderRadius: 3, py: 1, textTransform: 'none', fontWeight: 800 }}
                fullWidth
              >
                Stop & Save Recording
              </Button>
            )}
          </Box>

          {recording && (
            <Box sx={{ width: '100%', mt: 1 }}>
              <LinearProgress color="error" sx={{ borderRadius: 2, height: 6 }} />
              <Typography variant="caption" color="error" align="center" sx={{ display: 'block', mt: 0.5, fontWeight: 700 }}>
                Recording live microphone input...
              </Typography>
            </Box>
          )}

          {/* Upload Option */}
          {!recording && (
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.text, display: 'block', mb: 1 }}>
                Option 2: Select Audio File
              </Typography>
              <Button 
                variant="outlined" 
                component="label" 
                startIcon={<Upload />} 
                disabled={uploading}
                sx={{ borderRadius: 3, py: 1, borderColor: COLORS.blue2, color: COLORS.blue2, textTransform: 'none', fontWeight: 700 }}
                fullWidth
              >
                Browse Audio File
                <input type="file" hidden accept="audio/*" onChange={handleFileSelect} />
              </Button>
              {selectedFile && (
                <Chip 
                  label={`Attached: ${selectedFile.name}`} 
                  onDelete={handleClear}
                  sx={{ mt: 1, fontWeight: 600, bgcolor: COLORS.green1, color: COLORS.text }} 
                />
              )}
            </Box>
          )}

          {/* Preview Player for new recording/file */}
          {audioUrl && !recording && (audioBlob || selectedFile) && (
            <Box sx={{ p: 2, borderRadius: 4, border: `1px solid ${COLORS.border}`, bgcolor: '#f8fafc' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.text, display: 'block', mb: 1 }}>
                Playback Preview
              </Typography>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <audio 
                  ref={audioRef} 
                  src={audioUrl} 
                  onEnded={() => setIsPlaying(false)} 
                  style={{ display: 'none' }} 
                />
                <IconButton 
                  onClick={isPlaying ? pauseAudio : playAudio} 
                  color="primary"
                  sx={{ bgcolor: 'white', border: `1px solid ${COLORS.border}`, p: 1 }}
                >
                  {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
                    {selectedFile ? selectedFile.name : 'Recording Preview.webm'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: COLORS.subtext }}>
                    {isPlaying ? 'Playing...' : 'Click play to review before uploading'}
                  </Typography>
                </Box>
                <IconButton 
                  onClick={handleClear}
                  color="error"
                  size="small"
                  sx={{ bgcolor: 'white', border: `1px solid ${COLORS.border}` }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Stack>
            </Box>
          )}

          {/* Upload Trigger */}
          {(audioBlob || selectedFile) && !recording && (
            <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
              <Button 
                variant="contained" 
                startIcon={uploading ? null : <CheckCircle />}
                onClick={handleUploadClick}
                disabled={uploading}
                fullWidth
                sx={{ 
                  borderRadius: 4, 
                  py: 1.5, 
                  bgcolor: COLORS.text, 
                  color: 'white', 
                  fontWeight: 900,
                  '&:hover': { bgcolor: '#000' }
                }}
              >
                {uploading ? 'Uploading Audio...' : 'Save & Publish Guide'}
              </Button>
              <Button 
                variant="outlined" 
                onClick={handleClear}
                disabled={uploading}
                sx={{ borderRadius: 4, py: 1.5, borderColor: COLORS.blue2, color: COLORS.blue2, fontWeight: 700 }}
              >
                Reset
              </Button>
            </Stack>
          )}
        </Stack>
      )}
    </Paper>
  );
};

export default AudioInstructionRecorder;
