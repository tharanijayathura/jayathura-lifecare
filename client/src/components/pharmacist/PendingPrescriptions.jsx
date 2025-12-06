import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  PlayArrow,
  Refresh,
} from '@mui/icons-material';

// Mock data
const mockPrescriptions = [
  { id: 'P2456', patient: 'Kumar', time: '15 min ago', priority: 'High', items: 3, reason: 'Emergency' },
  { id: 'P2455', patient: 'N. Silva', time: '25 min ago', priority: 'Medium', items: 2, reason: 'Diabetes' },
  { id: 'P2454', patient: 'Fernando', time: '30 min ago', priority: 'Normal', items: 1, reason: null },
  { id: 'P2453', patient: 'Rajapakse', time: '45 min ago', priority: 'Normal', items: 4, reason: null },
];

const PendingPrescriptions = ({ onSelectPrescription }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('time');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [page, setPage] = useState(1);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      default: return 'default';
    }
  };

  const filteredPrescriptions = mockPrescriptions.filter((p) => {
    const matchesSearch = p.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || p.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5">
          PENDING PRESCRIPTIONS | {mockPrescriptions.length} Total
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" size="small" startIcon={<Refresh />}>
            Refresh
          </Button>
          <Button variant="outlined" size="small" startIcon={<FilterList />}>
            Filter
          </Button>
        </Stack>
      </Box>

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
              <TableRow key={prescription.id} hover>
                <TableCell>{prescription.id}</TableCell>
                <TableCell>{prescription.patient}</TableCell>
                <TableCell>{prescription.time}</TableCell>
                <TableCell>
                  <Chip
                    label={prescription.priority}
                    size="small"
                    color={getPriorityColor(prescription.priority)}
                  />
                  {prescription.reason && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      ({prescription.reason})
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{prescription.items} meds</TableCell>
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
          Showing {filteredPrescriptions.length} of {mockPrescriptions.length} prescriptions
        </Typography>
        <Pagination
          count={Math.ceil(filteredPrescriptions.length / 10)}
          page={page}
          onChange={(e, value) => setPage(value)}
        />
      </Box>

      {/* Bulk Actions */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          BULK ACTIONS
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          <Button variant="outlined" size="small">
            Claim All High Priority
          </Button>
          <Button variant="outlined" size="small">
            Assign to Me
          </Button>
          <Button variant="outlined" size="small">
            Batch Process
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default PendingPrescriptions;

