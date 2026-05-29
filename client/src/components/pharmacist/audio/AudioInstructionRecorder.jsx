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
  Divider
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
  Replay
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const chunksRef = useRef([]);

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

  const handleClear = () => {
    setAudioBlob(null);
    setAudioUrl(order?.audioInstructions?.url ? getPublicFileUrl(order.audioInstructions.url) : null);
    setSelectedFile(null);
    setErrorMsg('');
    if (!order?.audioInstructions?.url) {
      setSuccessMsg('');
    }
  };

  if (!order?.audioInstructions?.requested) {
    return null;
  }

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: 6, 
        border: `1px solid ${COLORS.border}`, 
        bgcolor: 'white',
        boxShadow: '0 4px 16px rgba(0,0,0,0.015)'
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: COLORS.blue2, textTransform: 'uppercase', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <VolumeUp fontSize="small" /> Patient Audio Assistance
        </Typography>
        <Chip 
          label={order?.audioInstructions?.url ? "GUIDE UPLOADED" : "AWAITING RECORDING"} 
          size="small" 
          sx={{ 
            bgcolor: order?.audioInstructions?.url ? COLORS.green1 : '#fffbeb', 
            color: order?.audioInstructions?.url ? '#059669' : '#d97706', 
            fontWeight: 800, 
            borderRadius: 2,
            fontSize: '0.62rem'
          }} 
        />
      </Stack>

      <Typography variant="body2" sx={{ color: COLORS.subtext, mb: 3 }}>
        The patient has requested custom voice guidance. Record or upload an instruction guide explaining dosage and schedules.
      </Typography>

      {errorMsg && <Alert severity="error" sx={{ mb: 2, borderRadius: 3, py: 0.5 }}>{errorMsg}</Alert>}
      {successMsg && <Alert severity="success" sx={{ mb: 2, borderRadius: 3, py: 0.5 }}>{successMsg}</Alert>}

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

        {/* Preview Player */}
        {audioUrl && !recording && (
          <Box sx={{ p: 2, borderRadius: 4, border: `1px solid ${COLORS.border}`, bgcolor: '#f8fafc' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.text, display: 'block', mb: 1 }}>
              Playback Guide Preview
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
                  {selectedFile ? selectedFile.name : (order.audioInstructions?.url ? 'Uploaded Guide.webm' : 'Recording Preview.webm')}
                </Typography>
                <Typography variant="caption" sx={{ color: COLORS.subtext }}>
                  {isPlaying ? 'Playing guidance audio...' : 'Click play to review instructions'}
                </Typography>
              </Box>
              {(audioBlob || selectedFile) && (
                <IconButton 
                  onClick={handleClear}
                  color="error"
                  size="small"
                  sx={{ bgcolor: 'white', border: `1px solid ${COLORS.border}` }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              )}
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
    </Paper>
  );
};

export default AudioInstructionRecorder;
