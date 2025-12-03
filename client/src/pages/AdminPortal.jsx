import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Chip,
  IconButton,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Badge,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  AddCircle,
  Edit,
  RestartAlt,
  Save,
  AddPhotoAlternate,
  Delete,
  Info,
  CheckCircle,
  Cancel,
  Refresh,
  Person,
  Warning,
  Error as ErrorIcon,
  Clear,
} from '@mui/icons-material';
import { medicineAPI, groceryAPI, adminAPI } from '../services/api';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';

const MEDICINE_CATEGORIES = [
  { value: 'prescription', label: 'Prescription' },
  { value: 'otc', label: 'OTC' },
  { value: 'herbal', label: 'Herbal' },
  { value: 'vitamins', label: 'Vitamins' },
  { value: 'non-medical', label: 'Non Medical' },
];

const BASE_UNITS = [
  { value: 'tablet', label: 'Tablet' },
  { value: 'capsule', label: 'Capsule' },
  { value: 'ml', label: 'Milliliter (ml)' },
  { value: 'gram', label: 'Gram (g)' },
  { value: 'piece', label: 'Piece' },
];

const PACKAGING_TYPES = [
  { value: 'blister', label: 'Blister' },
  { value: 'card', label: 'Card' },
  { value: 'bottle', label: 'Bottle' },
  { value: 'tube', label: 'Tube' },
  { value: 'box', label: 'Box' },
  { value: 'sachet', label: 'Sachet' },
  { value: 'unit', label: 'Unit' },
];

const initialMedicineForm = {
  name: '',
  brand: '',
  category: 'otc',
  description: '',
  baseUnit: 'tablet',
  packaging: {
    type: 'unit',
    qtyPerPack: 1,
    packName: '',
  },
  price: {
    perPack: '',
  },
  stock: {
    packs: '',
  },
  minStockUnits: 10,
  requiresPrescription: false,
  image: null,
  imageUrl: '',
};

const initialGroceryForm = {
  name: '',
  description: '',
  price: '',
  unit: 'item',
  stock: '',
  minStock: '10',
  image: null,
  imageUrl: '',
};

const AdminPortal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Check if user is admin
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin' && !user.isSuperAdmin) {
      alert('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // State management
  const [mainTabIndex, setMainTabIndex] = useState(0); // Medicines, Groceries, Users
  const [medicineCategoryTab, setMedicineCategoryTab] = useState(0); // Category tabs for medicines
  const [medicines, setMedicines] = useState([]);
  const [groceries, setGroceries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [medicineForm, setMedicineForm] = useState(initialMedicineForm);
  const [groceryForm, setGroceryForm] = useState(initialGroceryForm);
  const [editingMedicineId, setEditingMedicineId] = useState(null);
  const [editingGroceryId, setEditingGroceryId] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [alertDialog, setAlertDialog] = useState({ open: false, item: null, type: null });

  // Fetch medicines
  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await medicineAPI.getAllAdmin();
      setMedicines(response.data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      const status = error.response?.status;
      
      if (status === 401 || status === 403) {
        alert('Authentication required. Please log in as admin.');
        window.location.href = '/login';
      } else {
        alert(`Failed to load medicines: ${errorMessage}. Please check if the server is running and you are logged in as admin.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch groceries
  const fetchGroceries = async () => {
    setLoading(true);
    try {
      const response = await groceryAPI.getAllAdmin();
      setGroceries(response.data);
    } catch (error) {
      console.error('Error fetching groceries:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      const status = error.response?.status;
      
      if (status === 401 || status === 403) {
        alert('Authentication required. Please log in as admin.');
        window.location.href = '/login';
      } else {
        alert(`Failed to load groceries: ${errorMessage}. Please check if the server is running and you are logged in as admin.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch pending users
  const fetchPendingUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await adminAPI.getPendingUsers();
      setPendingUsers(response.data);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Load data on mount and tab change
  useEffect(() => {
    // Only fetch if user is authenticated and is admin
    if (!user || (user.role !== 'admin' && !user.isSuperAdmin)) {
      return;
    }
    
    if (mainTabIndex === 0) {
      fetchMedicines();
    } else if (mainTabIndex === 1) {
      fetchGroceries();
    } else if (mainTabIndex === 2) {
      fetchPendingUsers();
    }
  }, [mainTabIndex, user]);

  // Filter medicines by category
  const filteredMedicines = medicines.filter((med) => {
    const selectedCategory = MEDICINE_CATEGORIES[medicineCategoryTab]?.value;
    return selectedCategory ? med.category === selectedCategory : true;
  });

  // Helper functions
  const handleFormChange = (setter) => (event) => {
    const { name, value, type, checked } = event.target;
    setter((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = (setter) => (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setter((prev) => ({
        ...prev,
        image: file,
        imageUrl: URL.createObjectURL(file),
      }));
    }
  };

  // Medicine form handlers
  const handleMedicineSubmit = async (event) => {
    event.preventDefault();
    if (!medicineForm.name || !medicineForm.price.perPack) {
      alert('Please fill in required fields (Name and Price per Pack)');
      return;
    }

    if (!medicineForm.packaging.qtyPerPack || medicineForm.packaging.qtyPerPack < 1) {
      alert('Quantity per pack must be at least 1');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      
      // Basic fields
      formData.append('name', medicineForm.name);
      if (medicineForm.brand) formData.append('brand', medicineForm.brand);
      formData.append('category', medicineForm.category);
      if (medicineForm.description) formData.append('description', medicineForm.description);
      formData.append('baseUnit', medicineForm.baseUnit);
      formData.append('requiresPrescription', medicineForm.requiresPrescription);
      
      // Packaging - send as individual fields
      formData.append('packagingType', medicineForm.packaging.type);
      formData.append('packagingQtyPerPack', medicineForm.packaging.qtyPerPack.toString());
      if (medicineForm.packaging.packName) {
        formData.append('packagingPackName', medicineForm.packaging.packName);
      }
      
      // Price - send as individual field
      formData.append('pricePerPack', medicineForm.price.perPack.toString());
      
      // Stock - send as individual field
      formData.append('stockPacks', (medicineForm.stock.packs || 0).toString());
      
      // Min stock
      formData.append('minStockUnits', medicineForm.minStockUnits);
      
      // Image
      if (medicineForm.image) {
        formData.append('image', medicineForm.image);
      } else if (medicineForm.imageUrl) {
        formData.append('image', medicineForm.imageUrl);
      }

      if (editingMedicineId) {
        await medicineAPI.update(editingMedicineId, formData);
      } else {
        await medicineAPI.create(formData);
      }

      await fetchMedicines();
      setMedicineForm(initialMedicineForm);
      setEditingMedicineId(null);
      alert('Medicine saved successfully!');
    } catch (error) {
      console.error('Error saving medicine:', error);
      alert('Failed to save medicine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditMedicine = (medicine) => {
    setMedicineForm({
      name: medicine.name || '',
      brand: medicine.brand || '',
      category: medicine.category || 'otc',
      description: medicine.description || '',
      baseUnit: medicine.baseUnit || 'tablet',
      packaging: {
        type: medicine.packaging?.type || 'unit',
        qtyPerPack: medicine.packaging?.qtyPerPack || 1,
        packName: medicine.packaging?.packName || '',
      },
      price: {
        perPack: medicine.price?.perPack?.toString() || '',
      },
      stock: {
        packs: medicine.stock?.packs?.toString() || '',
      },
      minStockUnits: medicine.minStockUnits?.toString() || '10',
      requiresPrescription: medicine.requiresPrescription || false,
      image: null,
      imageUrl: medicine.image || '',
    });
    setEditingMedicineId(medicine._id);
  };

  const handleDeleteMedicine = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medicine?')) return;
    setLoading(true);
    try {
      await medicineAPI.delete(id);
      await fetchMedicines();
      alert('Medicine deleted successfully!');
    } catch (error) {
      console.error('Error deleting medicine:', error);
      alert('Failed to delete medicine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Grocery form handlers
  const handleGrocerySubmit = async (event) => {
    event.preventDefault();
    if (!groceryForm.name || !groceryForm.price) {
      alert('Please fill in required fields (Name and Price)');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(groceryForm).forEach((key) => {
        if (key === 'image' && groceryForm.image) {
          formData.append('image', groceryForm.image);
        } else if (key !== 'image' && key !== 'imageUrl' && groceryForm[key] !== null && groceryForm[key] !== '') {
          formData.append(key, groceryForm[key]);
        }
      });

      if (editingGroceryId) {
        await groceryAPI.update(editingGroceryId, formData);
      } else {
        await groceryAPI.create(formData);
      }

      await fetchGroceries();
      setGroceryForm(initialGroceryForm);
      setEditingGroceryId(null);
      alert('Grocery saved successfully!');
    } catch (error) {
      console.error('Error saving grocery:', error);
      alert('Failed to save grocery. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditGrocery = (grocery) => {
    setGroceryForm({
      name: grocery.name || '',
      description: grocery.description || '',
      price: grocery.price?.toString() || '',
      unit: grocery.unit || 'item',
      stock: grocery.stock?.toString() || '',
      minStock: grocery.minStock?.toString() || '10',
      image: null,
      imageUrl: grocery.image || '',
    });
    setEditingGroceryId(grocery._id);
  };

  const handleDeleteGrocery = async (id) => {
    if (!window.confirm('Are you sure you want to delete this grocery item?')) return;
    setLoading(true);
    try {
      await groceryAPI.delete(id);
      await fetchGroceries();
      alert('Grocery deleted successfully!');
    } catch (error) {
      console.error('Error deleting grocery:', error);
      alert('Failed to delete grocery. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Stock alert handlers
  const handleClearAlert = async (id, type) => {
    try {
      if (type === 'medicine') {
        await medicineAPI.clearAlert(id);
        await fetchMedicines();
      } else {
        await groceryAPI.clearAlert(id);
        await fetchGroceries();
      }
      alert('Alert cleared successfully!');
    } catch (error) {
      console.error('Error clearing alert:', error);
      alert('Failed to clear alert. Please try again.');
    }
  };

  // User approval handlers
  const handleApproveUser = async (userId) => {
    try {
      await adminAPI.approveUser(userId);
      await fetchPendingUsers();
      alert('User approved successfully!');
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user. Please try again.');
    }
  };

  const handleRejectUser = async (userId) => {
    if (!window.confirm('Are you sure you want to reject this user? This action cannot be undone.')) {
      return;
    }
    try {
      await adminAPI.rejectUser(userId);
      await fetchPendingUsers();
      alert('User rejected successfully!');
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Failed to reject user. Please try again.');
    }
  };

  // Check if item has low stock (based on base units)
  const isLowStock = (item) => {
    return item.stock?.units <= item.minStockUnits;
  };

  // Check if item is out of stock
  const isOutOfStock = (item) => {
    return item.stock?.units <= 0;
  };

  // Render medicine form
  const renderMedicineForm = () => (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
      >
        {editingMedicineId ? 'Update Medicine' : 'Add New Medicine'}
      </Typography>
      <Box component="form" onSubmit={handleMedicineSubmit}>
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Medicine Name *"
              name="name"
              value={medicineForm.name}
              onChange={handleFormChange(setMedicineForm)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Brand"
              name="brand"
              value={medicineForm.brand}
              onChange={handleFormChange(setMedicineForm)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Category *"
              name="category"
              value={medicineForm.category}
              onChange={handleFormChange(setMedicineForm)}
              fullWidth
              required
            >
              {MEDICINE_CATEGORIES.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Base Unit *"
              name="baseUnit"
              value={medicineForm.baseUnit}
              onChange={handleFormChange(setMedicineForm)}
              fullWidth
              required
            >
              {BASE_UNITS.map((unit) => (
                <MenuItem key={unit.value} value={unit.value}>
                  {unit.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Packaging Type *"
              name="packaging.type"
              value={medicineForm.packaging.type}
              onChange={(e) => {
                setMedicineForm(prev => ({
                  ...prev,
                  packaging: { ...prev.packaging, type: e.target.value }
                }));
              }}
              fullWidth
              required
            >
              {PACKAGING_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Quantity per Pack *"
              name="packaging.qtyPerPack"
              type="number"
              value={medicineForm.packaging.qtyPerPack}
              onChange={(e) => {
                const qty = parseInt(e.target.value) || 1;
                setMedicineForm(prev => ({
                  ...prev,
                  packaging: { ...prev.packaging, qtyPerPack: qty }
                }));
              }}
              fullWidth
              required
              inputProps={{ min: 1 }}
              helperText={`e.g., 10 tablets per card, 120ml per bottle`}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Pack Display Name (Optional)"
              name="packaging.packName"
              value={medicineForm.packaging.packName}
              onChange={(e) => {
                setMedicineForm(prev => ({
                  ...prev,
                  packaging: { ...prev.packaging, packName: e.target.value }
                }));
              }}
              fullWidth
              placeholder="e.g., 1 card (10 tablets)"
              helperText="Leave empty for auto-generated name"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Price per Pack (Rs.) *"
              name="price.perPack"
              type="number"
              value={medicineForm.price.perPack}
              onChange={(e) => {
                setMedicineForm(prev => ({
                  ...prev,
                  price: { ...prev.price, perPack: e.target.value }
                }));
              }}
              fullWidth
              required
              inputProps={{ min: 0, step: 0.01 }}
              helperText={medicineForm.price.perPack && medicineForm.packaging.qtyPerPack 
                ? `Per unit: Rs. ${(parseFloat(medicineForm.price.perPack) / medicineForm.packaging.qtyPerPack).toFixed(2)}`
                : ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Stock (Number of Packs)"
              name="stock.packs"
              type="number"
              value={medicineForm.stock.packs}
              onChange={(e) => {
                setMedicineForm(prev => ({
                  ...prev,
                  stock: { ...prev.stock, packs: e.target.value }
                }));
              }}
              fullWidth
              inputProps={{ min: 0 }}
              helperText={medicineForm.stock.packs && medicineForm.packaging.qtyPerPack
                ? `Total: ${parseInt(medicineForm.stock.packs || 0) * medicineForm.packaging.qtyPerPack} ${medicineForm.baseUnit}s`
                : ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Min Stock Alert (Base Units)"
              name="minStockUnits"
              type="number"
              value={medicineForm.minStockUnits}
              onChange={handleFormChange(setMedicineForm)}
              fullWidth
              inputProps={{ min: 0 }}
              helperText={`Alert when stock falls below ${medicineForm.minStockUnits} ${medicineForm.baseUnit}s`}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={medicineForm.description}
              onChange={handleFormChange(setMedicineForm)}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  name="requiresPrescription"
                  checked={medicineForm.requiresPrescription}
                  onChange={handleFormChange(setMedicineForm)}
                />
              }
              label="Requires Prescription"
            />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="outlined"
                component="label"
                startIcon={<AddPhotoAlternate />}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload(setMedicineForm)}
                />
              </Button>
              {medicineForm.imageUrl && (
                <Box
                  component="img"
                  src={medicineForm.imageUrl}
                  alt="Preview"
                  sx={{ maxHeight: 100, maxWidth: 100, objectFit: 'cover', borderRadius: 1 }}
                />
              )}
              <TextField
                label="Or Image URL"
                name="imageUrl"
                value={medicineForm.imageUrl}
                onChange={handleFormChange(setMedicineForm)}
                fullWidth
                placeholder="https://..."
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained" startIcon={<Save />} disabled={loading}>
                {editingMedicineId ? 'Update' : 'Save'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<RestartAlt />}
                onClick={() => {
                  setMedicineForm(initialMedicineForm);
                  setEditingMedicineId(null);
                }}
              >
                Reset
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );

  // Render medicine list with category tabs
  const renderMedicineList = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Box>
        <Tabs
          value={medicineCategoryTab}
          onChange={(e, newValue) => setMedicineCategoryTab(newValue)}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons={isMobile ? 'auto' : false}
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider', 
            mb: { xs: 2, md: 3 },
            '& .MuiTab-root': {
              fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
              minWidth: { xs: 60, sm: 80 },
            },
          }}
        >
          {MEDICINE_CATEGORIES.map((cat, index) => {
            const categoryMedicines = medicines.filter((m) => m.category === cat.value);
            const alertCount = categoryMedicines.filter((m) => m.stockAlert?.isAlerted || isOutOfStock(m)).length;
            return (
              <Tab
                key={cat.value}
                label={
                  <Badge badgeContent={alertCount} color="error">
                    {cat.label}
                  </Badge>
                }
              />
            );
          })}
        </Tabs>

        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          {filteredMedicines.length === 0 ? (
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                <AddCircle color="disabled" sx={{ fontSize: 48 }} />
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                  No medicines in this category. Add your first medicine using the form.
                </Typography>
              </Paper>
            </Grid>
          ) : (
            filteredMedicines.map((medicine) => {
              const hasAlert = medicine.stockAlert?.isAlerted || isOutOfStock(medicine);
              const isLow = isLowStock(medicine);
              return (
                <Grid item xs={12} sm={6} md={4} key={medicine._id}>
                  <Card
                    sx={{
                      border: hasAlert ? '2px solid red' : isLow ? '2px solid orange' : '1px solid',
                      borderColor: hasAlert ? 'error.main' : isLow ? 'warning.main' : 'divider',
                      position: 'relative',
                    }}
                  >
                    {hasAlert && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'error.main',
                          color: 'white',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 1,
                        }}
                      >
                        <ErrorIcon sx={{ fontSize: 16 }} />
                      </Box>
                    )}
                    {medicine.image && (
                      <CardMedia
                        component="img"
                        height="150"
                        image={
                          medicine.image.startsWith('http') || medicine.image.startsWith('data:')
                            ? medicine.image
                            : medicine.image.startsWith('/')
                            ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${medicine.image}`
                            : medicine.image
                        }
                        alt={medicine.name}
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="h6">{medicine.name}</Typography>
                        <Chip
                          label={MEDICINE_CATEGORIES.find((c) => c.value === medicine.category)?.label || medicine.category}
                          size="small"
                          color="primary"
                        />
                      </Stack>
                      {medicine.brand && (
                        <Typography variant="body2" color="text.secondary">
                          Brand: {medicine.brand}
                        </Typography>
                      )}
                      <Typography variant="body2" sx={{ my: 1 }}>
                        {medicine.description}
                      </Typography>
                      <Box sx={{ my: 1 }}>
                        <Typography variant="subtitle1" color="primary">
                          Rs. {medicine.price?.perPack || medicine.price} per pack
                        </Typography>
                        {medicine.price?.perUnit && (
                          <Typography variant="caption" color="text.secondary">
                            (Rs. {medicine.price.perUnit.toFixed(2)} per {medicine.baseUnit})
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ my: 1 }}>
                        <Typography variant="caption" display="block" color="text.secondary">
                          Pack: {medicine.packDisplay || medicine.packaging?.packName || `1 ${medicine.packaging?.type || 'unit'} (${medicine.packaging?.qtyPerPack || 1} ${medicine.baseUnit}${(medicine.packaging?.qtyPerPack || 1) > 1 ? 's' : ''})`}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" gap={1}>
                        <Chip
                          label={`${medicine.stock?.packs || 0} packs`}
                          size="small"
                          color={isOutOfStock(medicine) ? 'error' : isLow ? 'warning' : 'default'}
                        />
                        <Chip
                          label={`${medicine.stock?.units || 0} ${medicine.baseUnit}s`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={`Min: ${medicine.minStockUnits || 0}`}
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                      </Stack>
                      {medicine.stockValue && (
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                          Stock Value: Rs. {medicine.stockValue.toFixed(2)}
                        </Typography>
                      )}
                      {medicine.stockAlert?.isAlerted && (
                        <Alert severity="error" sx={{ mt: 1 }}>
                          <Typography variant="caption">
                            Alerted by: {medicine.stockAlert.alertedBy?.name || 'Pharmacist'}
                            <br />
                            Reason: {medicine.stockAlert.alertReason}
                          </Typography>
                        </Alert>
                      )}
                      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        <Button
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => handleEditMedicine(medicine)}
                        >
                          Edit
                        </Button>
                        {hasAlert && (
                          <Button
                            size="small"
                            color="success"
                            startIcon={<Clear />}
                            onClick={() => handleClearAlert(medicine._id, 'medicine')}
                          >
                            Clear Alert
                          </Button>
                        )}
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteMedicine(medicine._id)}
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          )}
        </Grid>
      </Box>
    );
  };

  // Render grocery form
  const renderGroceryForm = () => (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
      >
        {editingGroceryId ? 'Update Grocery' : 'Add New Grocery'}
      </Typography>
      <Box component="form" onSubmit={handleGrocerySubmit}>
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Item Name *"
              name="name"
              value={groceryForm.name}
              onChange={handleFormChange(setGroceryForm)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Price (Rs.) *"
              name="price"
              type="number"
              value={groceryForm.price}
              onChange={handleFormChange(setGroceryForm)}
              fullWidth
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Unit"
              name="unit"
              value={groceryForm.unit}
              onChange={handleFormChange(setGroceryForm)}
              fullWidth
              placeholder="item, kg, liter, etc."
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Stock"
              name="stock"
              type="number"
              value={groceryForm.stock}
              onChange={handleFormChange(setGroceryForm)}
              fullWidth
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Min Stock (Alert Threshold)"
              name="minStock"
              type="number"
              value={groceryForm.minStock}
              onChange={handleFormChange(setGroceryForm)}
              fullWidth
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={groceryForm.description}
              onChange={handleFormChange(setGroceryForm)}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="outlined"
                component="label"
                startIcon={<AddPhotoAlternate />}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload(setGroceryForm)}
                />
              </Button>
              {groceryForm.imageUrl && (
                <Box
                  component="img"
                  src={groceryForm.imageUrl}
                  alt="Preview"
                  sx={{ maxHeight: 100, maxWidth: 100, objectFit: 'cover', borderRadius: 1 }}
                />
              )}
              <TextField
                label="Or Image URL"
                name="imageUrl"
                value={groceryForm.imageUrl}
                onChange={handleFormChange(setGroceryForm)}
                fullWidth
                placeholder="https://..."
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained" startIcon={<Save />} disabled={loading}>
                {editingGroceryId ? 'Update' : 'Save'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<RestartAlt />}
                onClick={() => {
                  setGroceryForm(initialGroceryForm);
                  setEditingGroceryId(null);
                }}
              >
                Reset
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );

  // Render grocery list
  const renderGroceryList = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
        {groceries.length === 0 ? (
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
              <AddCircle color="disabled" sx={{ fontSize: 48 }} />
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                No grocery items yet. Add your first item using the form.
              </Typography>
            </Paper>
          </Grid>
        ) : (
          groceries.map((grocery) => {
            const hasAlert = grocery.stockAlert?.isAlerted || isOutOfStock(grocery);
            const isLow = isLowStock(grocery);
            return (
              <Grid item xs={12} sm={6} md={4} key={grocery._id}>
                <Card
                  sx={{
                    border: hasAlert ? '2px solid red' : isLow ? '2px solid orange' : '1px solid',
                    borderColor: hasAlert ? 'error.main' : isLow ? 'warning.main' : 'divider',
                    position: 'relative',
                  }}
                >
                  {hasAlert && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'error.main',
                        color: 'white',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1,
                      }}
                    >
                      <ErrorIcon sx={{ fontSize: 16 }} />
                    </Box>
                  )}
                  {grocery.image && (
                    <CardMedia
                      component="img"
                      height="150"
                      image={
                        grocery.image.startsWith('http') || grocery.image.startsWith('data:')
                          ? grocery.image
                          : grocery.image.startsWith('/')
                          ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${grocery.image}`
                          : grocery.image
                      }
                      alt={grocery.name}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6">{grocery.name}</Typography>
                    <Typography variant="body2" sx={{ my: 1 }}>
                      {grocery.description}
                    </Typography>
                    <Typography variant="subtitle1" color="primary">
                      Rs. {grocery.price} / {grocery.unit}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Chip
                        label={`Stock: ${grocery.stock}`}
                        size="small"
                        color={isOutOfStock(grocery) ? 'error' : isLow ? 'warning' : 'default'}
                      />
                      <Chip
                        label={`Min: ${grocery.minStock}`}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                    {grocery.stockAlert?.isAlerted && (
                      <Alert severity="error" sx={{ mt: 1 }}>
                        <Typography variant="caption">
                          Alerted by: {grocery.stockAlert.alertedBy?.name || 'Pharmacist'}
                          <br />
                          Reason: {grocery.stockAlert.alertReason}
                        </Typography>
                      </Alert>
                    )}
                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleEditGrocery(grocery)}
                      >
                        Edit
                      </Button>
                      {hasAlert && (
                        <Button
                          size="small"
                          color="success"
                          startIcon={<Clear />}
                          onClick={() => handleClearAlert(grocery._id, 'grocery')}
                        >
                          Clear Alert
                        </Button>
                      )}
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteGrocery(grocery._id)}
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>
    );
  };

  // Render user approvals tab
  const renderUserApprovals = () => (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: { xs: 2, md: 3 },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1.5, sm: 0 },
      }}>
        <Typography 
          variant="h6"
          sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
        >
          Pending User Approvals
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchPendingUsers}
          disabled={loadingUsers}
          fullWidth={isMobile}
          sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}
        >
          Refresh
        </Button>
      </Box>
      {loadingUsers ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : pendingUsers.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
          <CheckCircle color="success" sx={{ fontSize: 48 }} />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            No pending user approvals. All users are approved.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          {pendingUsers.map((user) => (
            <Grid item xs={12} md={6} key={user._id || user.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Person sx={{ mr: 1, color: 'primary.main' }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">{user.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                      {user.phone && (
                        <Typography variant="body2" color="text.secondary">
                          {user.phone}
                        </Typography>
                      )}
                    </Box>
                    <Chip
                      label={user.role}
                      color={user.role === 'admin' ? 'error' : user.role === 'pharmacist' ? 'warning' : 'info'}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                    Registered: {new Date(user.createdAt).toLocaleDateString()}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={() => handleApproveUser(user._id || user.id)}
                      fullWidth
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Cancel />}
                      onClick={() => handleRejectUser(user._id || user.id)}
                      fullWidth
                    >
                      Reject
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  // Show loading or redirect if not authenticated
  if (!user) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="warning">
          Please log in to access the admin portal.
        </Alert>
      </Container>
    );
  }

  if (user.role !== 'admin' && !user.isSuperAdmin) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">
          Access denied. Admin privileges required.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}>
      <PageHeader
        title="Admin Catalogue Manager"
        subtitle="Manage medicines, groceries, and user approvals"
        showBack={false}
      />
      <Alert 
        severity="info" 
        sx={{ 
          mt: { xs: 1, md: 2 }, 
          mb: { xs: 2, md: 3 },
          fontSize: { xs: '0.85rem', md: '0.875rem' },
        }}
      >
        <Typography variant="body2" sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}>
          Add and manage medicines by category (Prescription, OTC, Herbal, Vitamins, Non-Medical). 
          Red indicators show items with stock alerts. Pharmacists can create alerts for low stock items.
        </Typography>
      </Alert>

      <Paper sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
        <Tabs 
          value={mainTabIndex} 
          onChange={(e, newValue) => setMainTabIndex(newValue)}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons={isMobile ? 'auto' : false}
          sx={{
            '& .MuiTab-root': {
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
              minWidth: { xs: 80, sm: 120 },
            },
          }}
        >
          <Tab label="Medicines" />
          <Tab label="Groceries" />
          <Tab label="User Approvals" />
        </Tabs>
        <Box sx={{ mt: { xs: 2, md: 3 } }}>
          {mainTabIndex === 0 && (
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              <Grid item xs={12} md={4}>
                {renderMedicineForm()}
              </Grid>
              <Grid item xs={12} md={8}>
                {renderMedicineList()}
              </Grid>
            </Grid>
          )}
          {mainTabIndex === 1 && (
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              <Grid item xs={12} md={4}>
                {renderGroceryForm()}
              </Grid>
              <Grid item xs={12} md={8}>
                {renderGroceryList()}
              </Grid>
            </Grid>
          )}
          {mainTabIndex === 2 && renderUserApprovals()}
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminPortal;
