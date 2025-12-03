// client/src/pages/PharmacistPortal.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import {
  Warning,
  Error as ErrorIcon,
  Chat,
  Inventory,
} from '@mui/icons-material';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { medicineAPI, groceryAPI } from '../services/api';

const PharmacistPortal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [medicines, setMedicines] = useState([]);
  const [groceries, setGroceries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertDialog, setAlertDialog] = useState({ open: false, item: null, type: null, reason: '' });

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await medicineAPI.getAll();
      setMedicines(response.data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroceries = async () => {
    setLoading(true);
    try {
      const response = await groceryAPI.getAll();
      setGroceries(response.data);
    } catch (error) {
      console.error('Error fetching groceries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tabIndex === 0) {
      fetchMedicines();
    } else {
      fetchGroceries();
    }
  }, [tabIndex]);

  const isLowStock = (item) => item.stock <= item.minStock;
  const isOutOfStock = (item) => item.stock <= 0;

  const handleOpenAlert = (item, type) => {
    setAlertDialog({ open: true, item, type, reason: '' });
  };

  const handleCloseAlert = () => {
    setAlertDialog({ open: false, item: null, type: null, reason: '' });
  };

  const handleSubmitAlert = async () => {
    try {
      if (alertDialog.type === 'medicine') {
        await medicineAPI.createAlert(alertDialog.item._id, alertDialog.reason);
        await fetchMedicines();
      } else {
        await groceryAPI.createAlert(alertDialog.item._id, alertDialog.reason);
        await fetchGroceries();
      }
      alert('Alert created successfully! Admin will be notified.');
      handleCloseAlert();
    } catch (error) {
      console.error('Error creating alert:', error);
      alert('Failed to create alert. Please try again.');
    }
  };

  const renderInventoryList = (items, type) => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    const lowStockItems = items.filter((item) => isLowStock(item) || isOutOfStock(item));

    return (
      <Box>
        {lowStockItems.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {lowStockItems.length} item(s) need attention (low or out of stock)
          </Alert>
        )}
        <Grid container spacing={2}>
          {items.map((item) => {
            const low = isLowStock(item);
            const out = isOutOfStock(item);
            return (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Card
                  sx={{
                    border: out ? '2px solid red' : low ? '2px solid orange' : '1px solid',
                    borderColor: out ? 'error.main' : low ? 'warning.main' : 'divider',
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{item.name}</Typography>
                    {item.brand && (
                      <Typography variant="body2" color="text.secondary">
                        Brand: {item.brand}
                      </Typography>
                    )}
                    {item.description && (
                      <Typography variant="body2" sx={{ my: 1 }}>
                        {item.description}
                      </Typography>
                    )}
                    <Typography variant="subtitle1" color="primary">
                      Rs. {item.price} / {item.unit || 'unit'}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Chip
                        label={`Stock: ${item.stock}`}
                        size="small"
                        color={out ? 'error' : low ? 'warning' : 'default'}
                      />
                      <Chip
                        label={`Min: ${item.minStock}`}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                    {(out || low) && (
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={<Warning />}
                        onClick={() => handleOpenAlert(item, type)}
                        sx={{ mt: 2 }}
                      >
                        Alert Admin
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        title="Pharmacist Dashboard"
        subtitle={`Welcome, ${user?.name || 'Pharmacist'}`}
        showBack={false}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="contained"
                startIcon={<Chat />}
                onClick={() => navigate('/chat')}
                fullWidth
              >
                Open Chat with Patients
              </Button>
              <Button
                variant="outlined"
                startIcon={<Inventory />}
                onClick={() => setTabIndex(0)}
                fullWidth
              >
                View Medicines Inventory
              </Button>
            </Stack>
          </Paper>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Features:
            </Typography>
            <Typography variant="body2">
              • Prescription Verification<br />
              • Medicine Catalog Management<br />
              • Order Processing<br />
              • Patient Management<br />
              • Inventory Management & Alerts
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}>
              <Tab
                label={
                  <Badge
                    badgeContent={medicines.filter((m) => isLowStock(m) || isOutOfStock(m)).length}
                    color="error"
                  >
                    Medicines
                  </Badge>
                }
              />
              <Tab
                label={
                  <Badge
                    badgeContent={groceries.filter((g) => isLowStock(g) || isOutOfStock(g)).length}
                    color="error"
                  >
                    Groceries
                  </Badge>
                }
              />
            </Tabs>
            <Box sx={{ mt: 3 }}>
              {tabIndex === 0 && renderInventoryList(medicines, 'medicine')}
              {tabIndex === 1 && renderInventoryList(groceries, 'grocery')}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Alert Dialog */}
      <Dialog open={alertDialog.open} onClose={handleCloseAlert}>
        <DialogTitle>Create Stock Alert</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Item: <strong>{alertDialog.item?.name}</strong>
            <br />
            Current Stock: <strong>{alertDialog.item?.stock}</strong>
            <br />
            Minimum Stock: <strong>{alertDialog.item?.minStock}</strong>
          </Typography>
          <TextField
            label="Alert Reason (Optional)"
            fullWidth
            multiline
            rows={3}
            value={alertDialog.reason}
            onChange={(e) => setAlertDialog({ ...alertDialog, reason: e.target.value })}
            placeholder="e.g., Stock is critically low, need to reorder urgently"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert}>Cancel</Button>
          <Button onClick={handleSubmitAlert} variant="contained" color="error">
            Send Alert to Admin
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PharmacistPortal;