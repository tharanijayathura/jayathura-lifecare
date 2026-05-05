import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Chip,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Pagination,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Search,
  Visibility,
  PlayArrow,
  Refresh,
  Assignment,
} from '@mui/icons-material';
import { pharmacistAPI } from '../../services/api';

const PendingPrescriptions = ({ onSelectPrescription }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('time');
  const [page, setPage] = useState(1);

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
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await pharmacistAPI.getPendingPrescriptions();
      setPrescriptions(response.data || []);
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter((p) => {
    const patientName = p.patientId?.name || 'Unknown';
    const prescriptionId = p._id?.slice(-6) || '';
    return patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           prescriptionId.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress sx={{ color: COLORS.blue2 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 0 } }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: COLORS.text, mb: 1 }}>
            Pending Queue
          </Typography>
          <Typography sx={{ color: COLORS.subtext, fontWeight: 500 }}>
            {prescriptions.length} prescriptions awaiting verification and billing
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<Refresh />} 
          onClick={fetchPrescriptions}
          sx={{ borderRadius: 3, fontWeight: 700, color: COLORS.blue2, borderColor: COLORS.blue2 }}
        >
          Sync Queue
        </Button>
      </Box>

      {/* Filters Bar */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 5, border: `1px solid ${COLORS.border}`, bgcolor: 'white' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <TextField
            fullWidth
            placeholder="Search by patient name or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: COLORS.blue2 }} />,
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: '#f8fafc' } }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Sort Order</InputLabel>
            <Select value={sortBy} label="Sort Order" onChange={(e) => setSortBy(e.target.value)} sx={{ borderRadius: 4 }}>
              <MenuItem value="time">Most Recent</MenuItem>
              <MenuItem value="patient">Patient Name</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {filteredPrescriptions.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'white', borderRadius: 8, border: `2px dashed ${COLORS.border}` }}>
          <Assignment sx={{ fontSize: 64, color: '#e2e8f0', mb: 2 }} />
          <Typography variant="h6" sx={{ color: COLORS.subtext }}>No prescriptions found</Typography>
          <Typography variant="body2" sx={{ color: COLORS.subtext }}>All caught up! Check back later for new uploads.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredPrescriptions.map((rx) => (
            <Grid item xs={12} sm={6} md={4} key={rx._id}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 6,
                  border: `1px solid ${COLORS.border}`,
                  bgcolor: 'white',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.04)',
                    borderColor: COLORS.blue2
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Chip 
                    label={`ID: ${rx._id?.slice(-6).toUpperCase()}`} 
                    size="small" 
                    sx={{ bgcolor: COLORS.green1, color: COLORS.blue2, fontWeight: 800, borderRadius: 2 }} 
                  />
                  <Typography variant="caption" sx={{ color: COLORS.subtext, fontWeight: 600 }}>
                    {new Date(rx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.text, mb: 0.5 }}>
                    {rx.patientId?.name || 'Unknown Patient'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: COLORS.subtext, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Visibility sx={{ fontSize: 14 }} /> {rx.items?.length || 0} Medicines listed
                  </Typography>
                </Box>

                <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />

                <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                  <Chip label="Pending Verification" size="small" color="warning" sx={{ fontWeight: 700, borderRadius: 2 }} />
                  {rx.orderStatus === 'draft' && (
                    <Chip label="New Upload" size="small" variant="outlined" color="info" sx={{ fontWeight: 700, borderRadius: 2 }} />
                  )}
                </Stack>

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={() => onSelectPrescription(rx)}
                  sx={{ 
                    borderRadius: 4, 
                    py: 1.5, 
                    bgcolor: COLORS.blue2, 
                    fontWeight: 800,
                    '&:hover': { bgcolor: COLORS.blue1 }
                  }}
                >
                  Process Rx
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(filteredPrescriptions.length / 12)}
          page={page}
          onChange={(e, value) => setPage(value)}
          sx={{ '& .MuiPaginationItem-root': { fontWeight: 700 } }}
        />
      </Box>
    </Box>
  );
};

export default PendingPrescriptions;
