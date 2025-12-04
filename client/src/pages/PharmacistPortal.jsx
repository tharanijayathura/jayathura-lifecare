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
  useTheme,
  useMediaQuery,
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
import PharmacistAnalytics from '../components/pharmacist/PharmacistAnalytics';

const PharmacistPortal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
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
                  <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                    <Typography 
                      variant="h6"
                      sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                    >
                      {item.name}
                    </Typography>
                    {item.brand && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                      >
                        Brand: {item.brand}
                      </Typography>
                    )}
                    {item.description && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          my: 1,
                          fontSize: { xs: '0.85rem', md: '0.875rem' },
                        }}
                      >
                        {item.description}
                      </Typography>
                    )}
                    <Typography 
                      variant="subtitle1" 
                      color="primary"
                      sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
                    >
                      Rs. {item.price} / {item.unit || 'unit'}
                    </Typography>
                    <Stack 
                      direction="row" 
                      spacing={1} 
                      sx={{ mt: 1 }}
                      flexWrap="wrap"
                      gap={0.5}
                    >
                      <Chip
                        label={`Stock: ${item.stock}`}
                        size="small"
                        color={out ? 'error' : low ? 'warning' : 'default'}
                        sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                      />
                      <Chip
                        label={`Min: ${item.minStock}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                      />
                    </Stack>
                    {(out || low) && (
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={<Warning />}
                        onClick={() => handleOpenAlert(item, type)}
                        sx={{ 
                          mt: 2,
                          fontSize: { xs: '0.8rem', md: '0.875rem' },
                        }}
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
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}>
      <PageHeader
        title="Pharmacist Dashboard"
        subtitle={`Welcome, ${user?.name || 'Pharmacist'}`}
        showBack={false}
      />
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: { xs: 2, sm: 2.5, md: 3 }, mb: { xs: 2, md: 2 } }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
            >
              Quick Actions
            </Typography>
            <Stack spacing={{ xs: 1.5, md: 2 }}>
              <Button
                variant="contained"
                startIcon={<Chat />}
                onClick={() => navigate('/chat')}
                fullWidth
                sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}
              >
                Open Chat with Patients
              </Button>
              <Button
                variant="outlined"
                startIcon={<Inventory />}
                onClick={() => setTabIndex(0)}
                fullWidth
                sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}
              >
                View Medicines Inventory
              </Button>
            </Stack>
          </Paper>
          <Paper sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
            >
              Features:
            </Typography>
            <Typography 
              variant="body2"
              sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}
            >
              • Prescription Verification<br />
              • Medicine Catalog Management<br />
              • Order Processing<br />
              • Patient Management<br />
              • Inventory Management & Alerts
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
            <Tabs 
              value={tabIndex} 
              onChange={(e, newValue) => setTabIndex(newValue)}
              variant={isMobile ? 'scrollable' : 'standard'}
              scrollButtons={isMobile ? 'auto' : false}
              sx={{
                '& .MuiTab-root': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                },
              }}
            >
              <Tab label="Analytics" />
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
            <Box sx={{ mt: { xs: 2, md: 3 } }}>
              {tabIndex === 0 && <PharmacistAnalytics />}
              {tabIndex === 1 && renderInventoryList(medicines, 'medicine')}
              {tabIndex === 2 && renderInventoryList(groceries, 'grocery')}
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