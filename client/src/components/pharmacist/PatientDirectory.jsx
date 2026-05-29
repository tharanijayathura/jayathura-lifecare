import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Button
} from '@mui/material';
import { Search, History, ContactPage, HealthAndSafety, Edit } from '@mui/icons-material';
import { pharmacistAPI } from '../../services/api';

const PatientDirectory = ({ onSelectPatient }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Chronic care dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPatientForChronic, setSelectedPatientForChronic] = useState(null);
  const [isChronic, setIsChronic] = useState(false);
  const [conditionsText, setConditionsText] = useState('');
  const [saving, setSaving] = useState(false);

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
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await pharmacistAPI.getPatients();
      setPatients(response.data || []);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Failed to load patient records');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChronicDialog = (patient) => {
    setSelectedPatientForChronic(patient);
    setIsChronic(patient.flaggedAsChronic || false);
    setConditionsText(patient.chronicConditions ? patient.chronicConditions.join(', ') : '');
    setDialogOpen(true);
  };

  const handleSaveChronic = async () => {
    if (!selectedPatientForChronic) return;
    try {
      setSaving(true);
      const conditions = conditionsText
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0);
      
      await pharmacistAPI.flagChronicPatient(selectedPatientForChronic._id, conditions, isChronic);
      setDialogOpen(false);
      fetchPatients();
    } catch (err) {
      console.error('Error saving chronic settings:', err);
      setError('Failed to update chronic care settings');
    } finally {
      setSaving(false);
    }
  };

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="400px">
      <CircularProgress sx={{ color: COLORS.blue2 }} />
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 1, md: 0 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: COLORS.text, mb: 1 }}>
          Patient Directory
        </Typography>
        <Typography sx={{ color: COLORS.subtext, fontWeight: 500 }}>
          Manage clinical records and order histories for registered patients
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 4 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ mb: 4, borderRadius: 5, border: `1px solid ${COLORS.border}`, bgcolor: 'white', overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderBottom: `1px solid ${COLORS.border}` }}>
          <TextField
            fullWidth
            placeholder="Search by patient name, email, or contact ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: COLORS.blue2 }} />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: 'white' } }}
          />
        </Box>

        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: `2px solid #f1f5f9`, color: COLORS.subtext, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' } }}>
                <TableCell>Patient Profile</TableCell>
                <TableCell>Contact Details</TableCell>
                <TableCell>Clinical Status</TableCell>
                <TableCell>Registered On</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <TableRow key={patient._id} hover sx={{ '& td': { borderBottom: '1px solid #f1f5f9', py: 2.5 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ 
                          bgcolor: COLORS.blue1, 
                          width: 44, 
                          height: 44, 
                          fontWeight: 800,
                          fontSize: '1rem',
                          boxShadow: '0 4px 10px rgba(147, 191, 199, 0.3)'
                        }}>
                          {patient.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 800, color: COLORS.text }}>{patient.name}</Typography>
                          <Typography variant="caption" sx={{ color: COLORS.subtext, fontWeight: 600 }}>PID: {patient._id.slice(-6).toUpperCase()}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.text }}>{patient.email}</Typography>
                      <Typography variant="caption" sx={{ color: COLORS.subtext }}>{patient.phone || 'No phone recorded'}</Typography>
                    </TableCell>
                    <TableCell>
                      {patient.flaggedAsChronic ? (
                        <Box>
                          <Chip label="CHRONIC CARE" size="small" sx={{ bgcolor: '#fff1f2', color: '#f43f5e', fontWeight: 800, borderRadius: 2, mb: 0.5 }} />
                          {patient.chronicConditions && patient.chronicConditions.length > 0 && (
                            <Typography variant="caption" sx={{ display: 'block', color: COLORS.subtext, fontSize: '0.7rem', fontWeight: 650 }}>
                              {patient.chronicConditions.join(', ')}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Chip label="STANDARD" size="small" sx={{ bgcolor: COLORS.green1, color: '#059669', fontWeight: 800, borderRadius: 2 }} />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{new Date(patient.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton 
                          size="small" 
                          sx={{ color: '#f43f5e', bgcolor: '#fff1f2', '&:hover': { bgcolor: '#ffe4e6' } }} 
                          onClick={() => handleOpenChronicDialog(patient)}
                          title="Manage Chronic Care"
                        >
                          <HealthAndSafety fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          sx={{ color: COLORS.blue2, bgcolor: '#f1f5f9', '&:hover': { bgcolor: '#e2e8f0' } }} 
                          onClick={() => onSelectPatient && onSelectPatient(patient)}
                          title="View History"
                        >
                          <History fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          sx={{ color: COLORS.blue2, bgcolor: '#f1f5f9', '&:hover': { bgcolor: '#e2e8f0' } }} 
                          onClick={() => onSelectPatient && onSelectPatient(patient)}
                          title="Patient Records"
                        >
                          <ContactPage fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <ContactPage sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
                    <Typography sx={{ color: COLORS.subtext, fontWeight: 600 }}>No patient records found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: COLORS.text }}>
          Manage Chronic Care Settings
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: COLORS.subtext, mb: 3 }}>
            Configure chronic patient status and record recurring medical conditions for <strong>{selectedPatientForChronic?.name}</strong>.
          </Typography>
          
          <Stack spacing={3.5}>
            <FormControlLabel
              control={
                <Switch
                  checked={isChronic}
                  onChange={(e) => setIsChronic(e.target.checked)}
                  color="error"
                />
              }
              label={
                <Typography sx={{ fontWeight: 700, color: COLORS.text }}>
                  Mark as Chronic Patient
                </Typography>
              }
            />
            
            {isChronic && (
              <TextField
                fullWidth
                label="Chronic Conditions"
                placeholder="Diabetes, Hypertension, Asthma..."
                helperText="Separate conditions with commas"
                value={conditionsText}
                onChange={(e) => setConditionsText(e.target.value)}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button 
            onClick={() => setDialogOpen(false)} 
            sx={{ fontWeight: 700, color: COLORS.subtext, textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveChronic} 
            variant="contained" 
            disabled={saving}
            sx={{ 
              bgcolor: COLORS.blue2, 
              color: 'white', 
              fontWeight: 700, 
              borderRadius: 3, 
              textTransform: 'none',
              px: 3,
              '&:hover': { bgcolor: COLORS.blue1 } 
            }}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientDirectory;
