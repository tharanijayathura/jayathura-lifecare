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
} from '@mui/material';
import { Search, History, ContactPage } from '@mui/icons-material';
import { pharmacistAPI } from '../../services/api';

const PatientDirectory = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

        <TableContainer>
          <Table>
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
                        <Chip label="CHRONIC CARE" size="small" sx={{ bgcolor: '#fff1f2', color: '#f43f5e', fontWeight: 800, borderRadius: 2 }} />
                      ) : (
                        <Chip label="STANDARD" size="small" sx={{ bgcolor: COLORS.green1, color: '#059669', fontWeight: 800, borderRadius: 2 }} />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{new Date(patient.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton size="small" sx={{ color: COLORS.blue2, bgcolor: '#f1f5f9' }} title="View History">
                          <History fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: COLORS.blue2, bgcolor: '#f1f5f9' }} title="Patient Records">
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
    </Box>
  );
};

export default PatientDirectory;
