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
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Stack,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
} from '@mui/material';
import { Search, Refresh, Inventory, Edit, Delete, Add, ShoppingBag, Warning, ErrorOutline, LocalPharmacy } from '@mui/icons-material';
import { pharmacistAPI, medicineAPI } from '../../services/api';
import { MEDICINE_CATEGORIES, BASE_UNITS, PACKAGING_TYPES } from '../../admin/constants';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStockStatus, setFilterStockStatus] = useState('all');
  const [filterPrescription, setFilterPrescription] = useState('all');

  // Dialog & Form State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialFormState = {
    name: '',
    brand: '',
    category: 'otc',
    description: '',
    baseUnit: 'tablet',
    packagingType: 'unit',
    packagingQtyPerPack: 1,
    packagingPackName: '',
    pricePerPack: '',
    stockPacks: '',
    minStockUnits: 10,
    requiresPrescription: false,
    imageUrl: '',
    imageFile: null
  };
  
  const [formState, setFormState] = useState(initialFormState);

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
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await pharmacistAPI.getInventory();
      setInventory(response.data || []);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setFormState(initialFormState);
    setEditingId(null);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (med) => {
    setFormState({
      name: med.name || '',
      brand: med.brand || '',
      category: med.category || 'otc',
      description: med.description || '',
      baseUnit: med.baseUnit || 'tablet',
      packagingType: med.packaging?.type || 'unit',
      packagingQtyPerPack: med.packaging?.qtyPerPack || 1,
      packagingPackName: med.packaging?.packName || '',
      pricePerPack: med.price?.perPack?.toString() || '',
      stockPacks: med.stock?.packs?.toString() || '0',
      minStockUnits: med.minStockUnits || 10,
      requiresPrescription: med.requiresPrescription || false,
      imageUrl: med.image || '',
      imageFile: null
    });
    setEditingId(med._id);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this medicine from inventory?')) return;
    try {
      setLoading(true);
      await medicineAPI.delete(id);
      await fetchInventory();
    } catch (err) {
      console.error('Error deleting medicine:', err);
      setError('Failed to remove medicine');
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormState(prev => ({
        ...prev,
        imageFile: file,
        imageUrl: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name || !formState.pricePerPack) {
      alert('Name and Price per Pack are required.');
      return;
    }
    
    try {
      setSubmitLoading(true);
      const formData = new FormData();
      formData.append('name', formState.name);
      formData.append('brand', formState.brand || '');
      formData.append('category', formState.category);
      formData.append('description', formState.description || '');
      formData.append('baseUnit', formState.baseUnit);
      formData.append('requiresPrescription', formState.requiresPrescription);
      formData.append('packagingType', formState.packagingType);
      formData.append('packagingQtyPerPack', formState.packagingQtyPerPack.toString());
      if (formState.packagingPackName) formData.append('packagingPackName', formState.packagingPackName);
      formData.append('pricePerPack', formState.pricePerPack.toString());
      formData.append('stockPacks', (formState.stockPacks || 0).toString());
      formData.append('minStockUnits', formState.minStockUnits.toString());
      
      if (formState.imageFile) {
        formData.append('image', formState.imageFile);
      } else if (formState.imageUrl) {
        formData.append('image', formState.imageUrl);
      } else {
        formData.append('image', '');
      }

      if (editingId) {
        await medicineAPI.update(editingId, formData);
      } else {
        await medicineAPI.create(formData);
      }
      
      setDialogOpen(false);
      await fetchInventory();
    } catch (err) {
      console.error('Error saving medicine:', err);
      alert('Failed to save medicine. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item => {
    // 1. Search term filter
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
      
    // 2. Category filter
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    
    // 3. Stock status filter
    const isLow = item.stock?.units <= item.minStockUnits;
    const isOut = item.stock?.units <= 0;
    let matchesStock = true;
    if (filterStockStatus === 'available') {
      matchesStock = !isOut && !isLow;
    } else if (filterStockStatus === 'low') {
      matchesStock = isLow && !isOut;
    } else if (filterStockStatus === 'out') {
      matchesStock = isOut;
    }
    
    // 4. Prescription filter
    let matchesRx = true;
    if (filterPrescription === 'rx') {
      matchesRx = item.requiresPrescription === true;
    } else if (filterPrescription === 'otc') {
      matchesRx = item.requiresPrescription === false;
    }
    
    return matchesSearch && matchesCategory && matchesStock && matchesRx;
  });

  // Calculate statistics
  const totalMeds = inventory.length;
  const lowStockCount = inventory.filter(item => item.stock?.units <= item.minStockUnits && item.stock?.units > 0).length;
  const outOfStockCount = inventory.filter(item => item.stock?.units <= 0).length;
  const rxCount = inventory.filter(item => item.requiresPrescription).length;

  if (loading && inventory.length === 0) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="400px">
      <CircularProgress sx={{ color: COLORS.blue2 }} />
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 1, md: 0 } }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: COLORS.text, mb: 1 }}>
            Stock Control
          </Typography>
          <Typography sx={{ color: COLORS.subtext, fontWeight: 500 }}>
            Monitor and manage pharmacy inventory levels in real-time
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenAddDialog}
            sx={{
              borderRadius: 3,
              fontWeight: 700,
              bgcolor: COLORS.blue2,
              color: 'white',
              '&:hover': { bgcolor: COLORS.blue1 }
            }}
          >
            Add Medicine
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<Refresh />} 
            onClick={fetchInventory}
            sx={{ borderRadius: 3, fontWeight: 700, color: COLORS.blue2, borderColor: COLORS.blue2 }}
          >
            Update Stock
          </Button>
        </Stack>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 4 }}>{error}</Alert>}

      {/* Stock Summary Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, border: `1px solid ${COLORS.border}`, bgcolor: 'white', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: '#f1f5f9', color: COLORS.blue2, display: 'flex' }}>
              <Inventory />
            </Box>
            <Box>
              <Typography sx={{ color: COLORS.subtext, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Items</Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: COLORS.text }}>{totalMeds}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0} 
            onClick={() => { setFilterStockStatus(filterStockStatus === 'low' ? 'all' : 'low'); }}
            sx={{ 
              p: 2.5, 
              borderRadius: 4, 
              border: `1px solid ${filterStockStatus === 'low' ? '#f97316' : COLORS.border}`, 
              bgcolor: filterStockStatus === 'low' ? '#fff7ed' : 'white', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': { borderColor: '#f97316' }
            }}
          >
            <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: '#fff7ed', color: '#f97316', display: 'flex' }}>
              <Warning />
            </Box>
            <Box>
              <Typography sx={{ color: COLORS.subtext, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Low Stock</Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#f97316' }}>{lowStockCount}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0} 
            onClick={() => { setFilterStockStatus(filterStockStatus === 'out' ? 'all' : 'out'); }}
            sx={{ 
              p: 2.5, 
              borderRadius: 4, 
              border: `1px solid ${filterStockStatus === 'out' ? '#f43f5e' : COLORS.border}`, 
              bgcolor: filterStockStatus === 'out' ? '#fff1f2' : 'white', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': { borderColor: '#f43f5e' }
            }}
          >
            <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: '#fff1f2', color: '#f43f5e', display: 'flex' }}>
              <ErrorOutline />
            </Box>
            <Box>
              <Typography sx={{ color: COLORS.subtext, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Out of Stock</Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#f43f5e' }}>{outOfStockCount}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0} 
            onClick={() => { setFilterPrescription(filterPrescription === 'rx' ? 'all' : 'rx'); }}
            sx={{ 
              p: 2.5, 
              borderRadius: 4, 
              border: `1px solid ${filterPrescription === 'rx' ? COLORS.blue2 : COLORS.border}`, 
              bgcolor: filterPrescription === 'rx' ? 'rgba(122, 168, 176, 0.08)' : 'white', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': { borderColor: COLORS.blue2 }
            }}
          >
            <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'rgba(122, 168, 176, 0.1)', color: COLORS.blue2, display: 'flex' }}>
              <LocalPharmacy />
            </Box>
            <Box>
              <Typography sx={{ color: COLORS.subtext, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Prescriptions (Rx)</Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: COLORS.blue2 }}>{rxCount}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ mb: 4, borderRadius: 5, border: `1px solid ${COLORS.border}`, bgcolor: 'white', overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderBottom: `1px solid ${COLORS.border}` }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                placeholder="Search by medicine name, brand, or category..."
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
            </Grid>
            <Grid item xs={12} sm={4} md={2.5}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={filterCategory}
                  label="Category"
                  onChange={(e) => setFilterCategory(e.target.value)}
                  sx={{ borderRadius: 4, bgcolor: 'white' }}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {MEDICINE_CATEGORIES.map(cat => (
                    <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={2.5}>
              <FormControl fullWidth size="small">
                <InputLabel>Stock Status</InputLabel>
                <Select
                  value={filterStockStatus}
                  label="Stock Status"
                  onChange={(e) => setFilterStockStatus(e.target.value)}
                  sx={{ borderRadius: 4, bgcolor: 'white' }}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="low">Low Stock</MenuItem>
                  <MenuItem value="out">Out of Stock</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Prescription (Rx)</InputLabel>
                <Select
                  value={filterPrescription}
                  label="Prescription (Rx)"
                  onChange={(e) => setFilterPrescription(e.target.value)}
                  sx={{ borderRadius: 4, bgcolor: 'white' }}
                >
                  <MenuItem value="all">All Rx/OTC</MenuItem>
                  <MenuItem value="rx">Requires Rx</MenuItem>
                  <MenuItem value="otc">No Rx Required</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: `2px solid #f1f5f9`, color: COLORS.subtext, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' } }}>
                <TableCell>Medicine Details</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="center">Stock Level</TableCell>
                <TableCell align="right">Pricing (per pack)</TableCell>
                <TableCell align="right">Inventory Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => {
                  const isLow = item.stock?.units <= item.minStockUnits;
                  const isOut = item.stock?.units <= 0;
                  
                  return (
                    <TableRow key={item._id} hover sx={{ '& td': { borderBottom: '1px solid #f1f5f9', py: 2.5 } }}>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, color: COLORS.text }}>{item.name}</Typography>
                        <Typography variant="caption" sx={{ color: COLORS.subtext }}>{item.brand || 'General'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={MEDICINE_CATEGORIES.find(c => c.value === item.category)?.label || item.category?.toUpperCase()} size="small" variant="outlined" sx={{ borderRadius: 2, fontSize: '0.65rem', fontWeight: 700 }} />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography sx={{ fontWeight: 800, color: isLow ? '#f43f5e' : COLORS.text }}>
                            {item.stock?.units || 0} {item.baseUnit}s
                          </Typography>
                          <Typography variant="caption" sx={{ color: COLORS.subtext }}>{item.stock?.packs || 0} packs</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontWeight: 800 }}>Rs. {item.price?.perPack?.toFixed(2)}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        {isOut ? (
                          <Chip label="OUT OF STOCK" size="small" sx={{ bgcolor: '#fff1f2', color: '#f43f5e', fontWeight: 800, borderRadius: 2 }} />
                        ) : isLow ? (
                          <Chip label="LOW STOCK" size="small" sx={{ bgcolor: '#fff7ed', color: '#f97316', fontWeight: 800, borderRadius: 2 }} />
                        ) : (
                          <Chip label="AVAILABLE" size="small" sx={{ bgcolor: COLORS.green1, color: '#059669', fontWeight: 800, borderRadius: 2 }} />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <IconButton size="small" onClick={() => handleOpenEditDialog(item)} sx={{ color: COLORS.blue2 }}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDelete(item._id)} sx={{ color: '#f43f5e' }}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                    <Inventory sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
                    <Typography sx={{ color: COLORS.subtext, fontWeight: 600 }}>No matching inventory found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>
            {editingId ? 'Edit Medicine Details' : 'Add New Medicine to Inventory'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Medicine Name"
                  name="name"
                  value={formState.name}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Brand"
                  name="brand"
                  value={formState.brand}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formState.category}
                    label="Category"
                    onChange={handleFormChange}
                  >
                    {MEDICINE_CATEGORIES.map(cat => (
                      <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Base Unit</InputLabel>
                  <Select
                    name="baseUnit"
                    value={formState.baseUnit}
                    label="Base Unit"
                    onChange={handleFormChange}
                  >
                    {BASE_UNITS.map(unit => (
                      <MenuItem key={unit.value} value={unit.value}>{unit.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel>Packaging Type</InputLabel>
                  <Select
                    name="packagingType"
                    value={formState.packagingType}
                    label="Packaging Type"
                    onChange={handleFormChange}
                  >
                    {PACKAGING_TYPES.map(pkg => (
                      <MenuItem key={pkg.value} value={pkg.value}>{pkg.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Qty per Pack"
                  name="packagingQtyPerPack"
                  value={formState.packagingQtyPerPack}
                  onChange={handleFormChange}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Pack Name Display"
                  name="packagingPackName"
                  value={formState.packagingPackName}
                  onChange={handleFormChange}
                  placeholder="e.g. Card of 12"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Price per Pack"
                  name="pricePerPack"
                  value={formState.pricePerPack}
                  onChange={handleFormChange}
                  inputProps={{ min: 0, step: "0.01" }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Stock (Packs)"
                  name="stockPacks"
                  value={formState.stockPacks}
                  onChange={handleFormChange}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Min Alert Stock (Units)"
                  name="minStockUnits"
                  value={formState.minStockUnits}
                  onChange={handleFormChange}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Description"
                  name="description"
                  value={formState.description}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Image URL"
                  name="imageUrl"
                  value={formState.imageUrl}
                  onChange={handleFormChange}
                  placeholder="https://example.com/image.png"
                />
              </Grid>
              <Grid item xs={12} sm={4} display="flex" alignItems="center">
                <Button variant="outlined" component="label" fullWidth>
                  Upload File
                  <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formState.requiresPrescription}
                      onChange={handleFormChange}
                      name="requiresPrescription"
                    />
                  }
                  label="Requires Doctor Prescription (Rx)"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setDialogOpen(false)} disabled={submitLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitLoading}
              sx={{ bgcolor: COLORS.blue2, color: 'white', '&:hover': { bgcolor: COLORS.blue1 } }}
            >
              {submitLoading ? <CircularProgress size={20} color="inherit" /> : 'Save Medicine'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default InventoryManagement;
