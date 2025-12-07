import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  PlayArrow,
  Refresh,
} from '@mui/icons-material';
import { pharmacistAPI } from '../../services/api';

const PendingPrescriptions = ({ onSelectPrescription }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('time');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [page, setPage] = useState(1);

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

  const getPriorityColor = (orderStatus) => {
    // Map order status to priority colors
    if (orderStatus === 'draft') return 'info'; // New upload
    return 'warning'; // Pending
  };

  const filteredPrescriptions = prescriptions.filter((p) => {
    const patientName = p.patientId?.name || 'Unknown';
    const prescriptionId = p._id?.slice(-6) || '';
    const matchesSearch = patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescriptionId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5">
          PENDING PRESCRIPTIONS | {prescriptions.length} Total
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" size="small" startIcon={<Refresh />} onClick={fetchPrescriptions}>
            Refresh
          </Button>
        </Stack>
      </Box>

      {prescriptions.length === 0 ? (
        <Alert severity="info">
          No pending prescriptions at the moment. Prescriptions will appear here once patients upload them.
        </Alert>
      ) : (
        <>
          {/* Search and Filters */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                fullWidth
                placeholder="Search prescriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
                }}
                size="small"
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Sort By</InputLabel>
                <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
                  <MenuItem value="time">Upload Time</MenuItem>
                  <MenuItem value="priority">Priority</MenuItem>
                  <MenuItem value="patient">Patient Name</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Priority</InputLabel>
                <Select value={priorityFilter} label="Priority" onChange={(e) => setPriorityFilter(e.target.value)}>
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Normal">Normal</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Paper>

          {/* Prescriptions Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Patient</TableCell>
                  <TableCell>Upload Time</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPrescriptions.map((prescription) => (
                  <TableRow key={prescription._id} hover>
                    <TableCell>#{prescription._id?.slice(-6)}</TableCell>
                    <TableCell>{prescription.patientId?.name || 'Unknown'}</TableCell>
                    <TableCell>{new Date(prescription.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label="Pending"
                          size="small"
                          color="warning"
                        />
                        {prescription.orderStatus && (
                          <Chip
                            label={prescription.orderStatus === 'draft' ? 'New Upload' : 'Sent by Patient'}
                            size="small"
                            color={getPriorityColor(prescription.orderStatus)}
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>{prescription.items?.length || 0} meds</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          onClick={() => onSelectPrescription(prescription)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<PlayArrow />}
                          onClick={() => onSelectPrescription(prescription)}
                        >
                          Process
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredPrescriptions.length} of {prescriptions.length} prescriptions
            </Typography>
            <Pagination
              count={Math.ceil(filteredPrescriptions.length / 10)}
              page={page}
              onChange={(e, value) => setPage(value)}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default PendingPrescriptions;

