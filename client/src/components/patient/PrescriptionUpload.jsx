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
  IconButton,
  Grid,
  CircularProgress,
  TextField,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { 
  CloudUpload, 
  CheckCircle, 
  Image as ImageIcon, 
  PictureAsPdf, 
  Close, 
  UploadFile,
  VolumeUp
} from '@mui/icons-material';
import { prescriptionAPI, patientAPI } from '../../services/api';

const COLORS = {
  green1: '#ECF4E8',
  green2: '#CBF3BB',
  green3: '#ABE7B2',
  blue1: '#93BFC7',
  blue2: '#7AA8B0',
  text: '#1e293b', // Sleek Slate 800
  subtext: '#64748b', // Slate 500
  border: 'rgba(147, 191, 199, 0.25)',
};

const PrescriptionUpload = ({ onUploaded }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [notes, setNotes] = useState('');
  const [requestAudioInstructions, setRequestAudioInstructions] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setMessage('');
    
    if (file) {
      const isImage = file.type.startsWith('image/') || 
                      /\.(jfif|jpg|jpeg|png|webp|gif|bmp)$/i.test(file.name);
      if (isImage) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(null);
    }
  };

  const isPdf = selectedFile?.type === 'application/pdf' || selectedFile?.name?.toLowerCase().endsWith('.pdf');

  const handleUpload = async (sendDirectly = false) => {
    if (!selectedFile) {
      setMessage('Please select a file first');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('imageFile', selectedFile);
    if (notes) {
      formData.append('notes', notes);
    }
    formData.append('requestAudioInstructions', requestAudioInstructions);

    try {
      const response = await prescriptionAPI.upload(formData);
      const payload = response.data?.prescription || response.data || {};
      const orderData = response.data?.order || {};
      const orderId = orderData._id || orderData.id;

      if (sendDirectly && orderId) {
        await patientAPI.sendOrderToPharmacist(orderId);
        setMessage('success:Prescription uploaded and submitted directly to the pharmacist!');
      } else {
        setMessage('success:Prescription draft created! We are directing you to the shop to add optional items.');
      }

      const meta = {
        id: payload._id || payload.id || `rx-${Date.now()}`,
        fileName: selectedFile.name,
        originalName: selectedFile.name,
        mimeType: payload.mimeType || selectedFile.type,
        status: payload.status || 'pending',
        uploadedAt: new Date().toISOString(),
        orderId: orderId,
        order: orderData,
        sendDirectly: sendDirectly
      };

      setSelectedFile(null);
      setPreviewUrl(null);
      setNotes('');
      setRequestAudioInstructions(false);
      if (document.getElementById('prescription-upload')) {
        document.getElementById('prescription-upload').value = '';
      }

      setTimeout(() => {
        onUploaded?.(meta);
      }, 1500);

    } catch (error) {
      console.error('Upload error:', error);
      setMessage('error:Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const checklist = [
    { text: "Doctor's Signature & Stamp", desc: "Ensure doctor's signature and registration stamp are visible." },
    { text: "Valid Date Range", desc: "Check that the prescription is dated within the last 6 months." },
    { text: "Matching Account Name", desc: "The patient name on the prescription should match your profile." }
  ];

  return (
    <Box sx={{ py: { xs: 1, md: 2 } }}>
      {/* Header Description */}
      <Box sx={{ mb: 4, textAlign: 'left' }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontSize: { xs: '1.8rem', md: '2.2rem' }, 
            fontWeight: 900, 
            color: COLORS.text, 
            mb: 1,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: '-0.02em'
          }}
        >
          Prescription Upload Portal
        </Typography>
        <Typography variant="body2" sx={{ color: COLORS.subtext, fontWeight: 500 }}>
          Submit your clinical prescription documents. Our pharmacists will verify and prepare your orders immediately.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column: Visual Guide & Validation checks */}
        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            {/* Steps card */}
            <Card sx={{ borderRadius: 6, border: `1px solid ${COLORS.border}`, boxShadow: '0 4px 20px rgba(15, 23, 42, 0.02)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: COLORS.text, mb: 3, fontFamily: "'Plus Jakarta Sans', sans-serif", textAlign: 'left' }}>
                  Clinical Workflow
                </Typography>
                
                <Stack spacing={3}>
                  {[
                    { step: '01', title: 'Submit Document', desc: 'Drag & drop or browse your digital prescription (JPG, PNG, or PDF).', color: '#10b981' },
                    { step: '02', title: 'Pharmacist Audit', desc: 'Our qualified clinical team verifies dosage details and items.', color: '#3b82f6' },
                    { step: '03', title: 'Express Delivery', desc: 'Review the items bill, confirm payment, and receive dispatch.', color: '#6366f1' }
                  ].map((item, idx) => (
                    <Stack direction="row" spacing={2} key={idx} alignItems="flex-start" sx={{ textAlign: 'left' }}>
                      <Box sx={{ 
                        width: 36, 
                        height: 36, 
                        borderRadius: '50%', 
                        bgcolor: item.color + '0e', 
                        color: item.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '0.8rem',
                        flexShrink: 0,
                        border: `1px solid ${item.color}20`
                      }}>
                        {item.step}
                      </Box>
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: COLORS.text, mb: 0.5, fontSize: '0.88rem', textAlign: 'left' }}>
                          {item.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: COLORS.subtext, display: 'block', lineHeight: 1.4, textAlign: 'left' }}>
                          {item.desc}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Checklist guidelines card */}
            <Card sx={{ borderRadius: 6, border: `1px solid ${COLORS.border}`, bgcolor: 'rgba(147, 191, 199, 0.05)', boxShadow: 'none' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: COLORS.text, mb: 2.5, display: 'flex', alignItems: 'center', gap: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <CheckCircle sx={{ color: '#10b981', fontSize: 18 }} /> Verification Checklist
                </Typography>
                
                <Stack spacing={2}>
                  {checklist.map((item, idx) => (
                    <Box key={idx} sx={{ p: 2, bgcolor: 'white', borderRadius: 4, border: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'flex-start', gap: 1.5, textAlign: 'left' }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981', mt: 1, flexShrink: 0 }} />
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: COLORS.text, display: 'block', mb: 0.2, textAlign: 'left' }}>
                          {item.text}
                        </Typography>
                        <Typography variant="caption" sx={{ color: COLORS.subtext, display: 'block', fontSize: '0.68rem', lineHeight: 1.3, textAlign: 'left' }}>
                          {item.desc}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Right Column: Dropzone upload & file previews */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 6, border: `1px solid ${COLORS.border}`, boxShadow: '0 8px 32px rgba(15, 23, 42, 0.03)', height: '100%' }}>
            <CardContent sx={{ p: { xs: 3, sm: 4.5 }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: COLORS.text, mb: 3, fontFamily: "'Plus Jakarta Sans', sans-serif", textAlign: 'left' }}>
                  Upload Document
                </Typography>

                {message && (
                  <Alert 
                    severity={message.startsWith('success') ? 'success' : 'error'} 
                    sx={{ mb: 3, borderRadius: 3, fontWeight: 700 }}
                    icon={message.startsWith('success') ? <CheckCircle /> : undefined}
                    onClose={() => setMessage('')}
                  >
                    {message.split(':')[1]}
                  </Alert>
                )}

                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: { xs: 4, sm: 6 }, 
                    textAlign: 'center',
                    border: '2px dashed',
                    borderRadius: 5,
                    borderColor: selectedFile ? '#10b981' : COLORS.border,
                    bgcolor: selectedFile ? 'rgba(16, 185, 129, 0.02)' : 'rgba(248, 250, 252, 0.5)',
                    transition: 'all 0.25s ease',
                    mb: 3,
                    position: 'relative',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: '#10b981',
                      bgcolor: 'rgba(16, 185, 129, 0.04)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                  onClick={() => document.getElementById('prescription-upload').click()}
                >
                  <input
                    id="prescription-upload"
                    type="file"
                    hidden
                    accept="image/*,.jfif,.jpg,.jpeg,.png,.pdf"
                    onChange={handleFileSelect}
                  />
                  
                  {selectedFile ? (
                    <Stack spacing={2.5} alignItems="center">
                      <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                        <IconButton 
                          size="small" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setSelectedFile(null); 
                            setPreviewUrl(null);
                          }} 
                          sx={{ color: COLORS.subtext, bgcolor: '#f1f5f9', '&:hover': { bgcolor: '#e2e8f0' } }}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </Box>
                      
                      {previewUrl ? (
                        <Box 
                          component="img" 
                          src={previewUrl} 
                          alt="Prescription Preview" 
                          sx={{ 
                            width: '100%', 
                            maxHeight: 180, 
                            objectFit: 'contain', 
                            borderRadius: 3,
                            border: `1px solid ${COLORS.border}`,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                          }} 
                        />
                      ) : (
                        <Box sx={{ 
                          p: 2.5, 
                          bgcolor: 'white', 
                          borderRadius: 4, 
                          boxShadow: '0 8px 24px rgba(0,0,0,0.05)', 
                          display: 'flex', 
                          color: '#10b981',
                          border: '1px solid rgba(16, 185, 129, 0.15)'
                        }}>
                          {isPdf ? <PictureAsPdf sx={{ fontSize: 52, color: '#ef4444' }} /> : <ImageIcon sx={{ fontSize: 52, color: '#10b981' }} />}
                        </Box>
                      )}
                      
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: COLORS.text, mb: 0.5 }}>
                          {selectedFile.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: COLORS.subtext, fontWeight: 600 }}>
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {isPdf ? 'PDF document' : 'Image file'}
                        </Typography>
                      </Box>
                      
                      <Chip 
                        label="FILE ATTACHED" 
                        size="small" 
                        sx={{ bgcolor: '#10b981', color: 'white', fontWeight: 900, px: 1.5, height: 22, fontSize: '0.65rem', borderRadius: 1.5 }} 
                      />
                    </Stack>
                  ) : (
                    <Stack spacing={2.5} alignItems="center">
                      <Box sx={{ 
                        p: 3, 
                        bgcolor: 'white', 
                        borderRadius: '50%', 
                        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.1)', 
                        display: 'flex', 
                        color: '#10b981',
                        border: '1px solid rgba(16, 185, 129, 0.08)'
                      }}>
                        <CloudUpload sx={{ fontSize: 44 }} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: COLORS.text, mb: 0.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          Select Prescription File
                        </Typography>
                        <Typography variant="body2" sx={{ color: COLORS.subtext, fontWeight: 500, fontSize: '0.85rem' }}>
                          Drag & drop or click to browse files
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: COLORS.subtext, opacity: 0.7, fontSize: '0.72rem', fontWeight: 500 }}>
                        Supported formats: JPG, JPEG, PNG, JFIF, PDF (Max 10MB)
                      </Typography>
                    </Stack>
                  )}
                </Paper>

                {selectedFile && (
                  <Stack spacing={2} sx={{ mt: 3, mb: 1, textAlign: 'left' }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Add Notes / Instructions for the Pharmacist (Optional)"
                      placeholder="Specify dosage instructions, general notes, or request specific packaging..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          bgcolor: 'white',
                        }
                      }}
                    />

                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        borderRadius: 3, 
                        bgcolor: requestAudioInstructions ? COLORS.green1 : 'transparent',
                        borderColor: requestAudioInstructions ? COLORS.green2 : COLORS.border,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={requestAudioInstructions}
                            onChange={(e) => setRequestAudioInstructions(e.target.checked)}
                            sx={{ color: '#10b981', '&.Mui-checked': { color: '#10b981' } }}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1, color: COLORS.text }}>
                              <VolumeUp fontSize="small" sx={{ color: '#10b981' }} /> Request Audio Instructions
                            </Typography>
                            <Typography variant="caption" sx={{ color: COLORS.subtext, fontWeight: 500 }}>
                              Our pharmacist will provide a personalized voice guide for your medicines.
                            </Typography>
                          </Box>
                        }
                      />
                    </Paper>
                  </Stack>
                )}
              </Box>

              <Box sx={{ mt: selectedFile ? 2 : 4 }}>
                <Stack spacing={2}>
                  {selectedFile ? (
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpload(true);
                          }}
                          disabled={uploading}
                          size="large"
                          sx={{ 
                            borderRadius: 4, 
                            py: 1.8, 
                            fontWeight: 800, 
                            textTransform: 'none', 
                            fontSize: '0.9rem',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)',
                            transition: 'all 0.2s ease',
                            '&:hover': { 
                              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                              boxShadow: '0 12px 28px rgba(16, 185, 129, 0.35)',
                              transform: 'translateY(-2px)'
                            }
                          }}
                          startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
                        >
                          Send Only Prescription
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpload(false);
                          }}
                          disabled={uploading}
                          size="large"
                          sx={{ 
                            borderRadius: 4, 
                            py: 1.8, 
                            fontWeight: 800, 
                            textTransform: 'none', 
                            fontSize: '0.9rem',
                            borderColor: COLORS.blue2,
                            color: COLORS.blue2,
                            transition: 'all 0.2s ease',
                            '&:hover': { 
                              borderColor: COLORS.blue1,
                              bgcolor: 'rgba(122, 168, 176, 0.05)',
                              transform: 'translateY(-2px)'
                            }
                          }}
                          startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <UploadFile />}
                        >
                          Add More Items (Shop)
                        </Button>
                      </Grid>
                    </Grid>
                  ) : (
                    <Button
                      variant="contained"
                      disabled
                      size="large"
                      sx={{ 
                        borderRadius: 4, 
                        py: 2, 
                        fontWeight: 800, 
                        textTransform: 'none', 
                        fontSize: '1rem',
                        bgcolor: '#e2e8f0',
                        color: '#94a3b8',
                        '&.Mui-disabled': { 
                          bgcolor: '#e2e8f0', 
                          color: '#94a3b8' 
                        }
                      }}
                      startIcon={<CloudUpload />}
                    >
                      Select a prescription to proceed
                    </Button>
                  )}
                  
                  {uploading && (
                    <Box sx={{ width: '100%', mt: 1 }}>
                      <LinearProgress sx={{ borderRadius: 2, height: 6, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: '#10b981' } }} />
                    </Box>
                  )}
                </Stack>
              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PrescriptionUpload;