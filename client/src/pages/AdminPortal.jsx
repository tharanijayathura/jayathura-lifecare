import React, { useState } from 'react';
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
} from '@mui/material';
import {
  AddCircle,
  Edit,
  RestartAlt,
  Save,
  AddPhotoAlternate,
  Delete,
  Info,
} from '@mui/icons-material';
import { useCatalog } from '../contexts/CatalogContext';

const MEDICINE_CATEGORIES = ['prescription', 'otc', 'herbal', 'vitamins', 'non-medical'];

const initialMedicineForm = {
  name: '',
  brand: '',
  category: 'otc',
  description: '',
  price: '',
  unit: 'dose',
  stock: '',
  requiresPrescription: false,
  image: '',
};

const initialGroceryForm = {
  name: '',
  description: '',
  price: '',
  unit: 'item',
  stock: '',
  image: '',
};

const AdminPortal = () => {
  const {
    medicines,
    groceries,
    addMedicine,
    updateMedicine,
    removeMedicine,
    addGrocery,
    updateGrocery,
    removeGrocery,
  } = useCatalog();
  const [tabIndex, setTabIndex] = useState(0);
  const [medicineForm, setMedicineForm] = useState(initialMedicineForm);
  const [groceryForm, setGroceryForm] = useState(initialGroceryForm);
  const [editingMedicineId, setEditingMedicineId] = useState(null);
  const [editingGroceryId, setEditingGroceryId] = useState(null);

  const handleFormChange = (setter) => (event) => {
    const { name, value } = event.target;
    setter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMedicineSwitch = (event) => {
    const { name, checked } = event.target;
    setMedicineForm((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleMedicineSubmit = (event) => {
    event.preventDefault();
    if (!medicineForm.name || !medicineForm.price) return;

    if (editingMedicineId) {
      updateMedicine(editingMedicineId, medicineForm);
    } else {
      addMedicine(medicineForm);
    }

    setMedicineForm(initialMedicineForm);
    setEditingMedicineId(null);
  };

  const handleGrocerySubmit = (event) => {
    event.preventDefault();
    if (!groceryForm.name || !groceryForm.price) return;

    if (editingGroceryId) {
      updateGrocery(editingGroceryId, groceryForm);
    } else {
      addGrocery(groceryForm);
    }

    setGroceryForm(initialGroceryForm);
    setEditingGroceryId(null);
  };

  const handleGroceryImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setGroceryForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleMedicineImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setMedicineForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const renderMedicineTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={5}>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {editingMedicineId ? 'Update Medicine' : 'Add Medicine'}
          </Typography>
          <Box component="form" onSubmit={handleMedicineSubmit}>
            <TextField
              label="Name"
              name="name"
              value={medicineForm.name}
              onChange={handleFormChange(setMedicineForm)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Brand"
              name="brand"
              value={medicineForm.brand}
              onChange={handleFormChange(setMedicineForm)}
              fullWidth
              margin="normal"
            />
            <TextField
              select
              label="Category"
              name="category"
              value={medicineForm.category}
              onChange={handleFormChange(setMedicineForm)}
              fullWidth
              margin="normal"
            >
              {MEDICINE_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category.replace('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                </MenuItem>
              ))}
            </TextField>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Price per dose (Rs.)"
                name="price"
                value={medicineForm.price}
                onChange={handleFormChange(setMedicineForm)}
                type="number"
                inputProps={{ min: 0 }}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Dose unit"
                name="unit"
                value={medicineForm.unit}
                onChange={handleFormChange(setMedicineForm)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Stock"
                name="stock"
                value={medicineForm.stock}
                onChange={handleFormChange(setMedicineForm)}
                type="number"
                inputProps={{ min: 0 }}
                fullWidth
                margin="normal"
              />
            </Stack>
            <TextField
              label="Description"
              name="description"
              value={medicineForm.description}
              onChange={handleFormChange(setMedicineForm)}
              fullWidth
              multiline
              rows={3}
              margin="normal"
            />
            <FormControlLabel
              control={
                <Switch
                  name="requiresPrescription"
                  checked={medicineForm.requiresPrescription}
                  onChange={handleMedicineSwitch}
                />
              }
              label="Requires prescription to dispense"
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ my: 2 }}>
              <Button
                variant="outlined"
                startIcon={<AddPhotoAlternate />}
                component="label"
              >
                Upload Image
                <input type="file" hidden accept="image/*" onChange={handleMedicineImageUpload} />
              </Button>
              <TextField
                label="Image URL (optional)"
                name="image"
                value={medicineForm.image}
                onChange={handleFormChange(setMedicineForm)}
                fullWidth
              />
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" startIcon={<Save />}>
                {editingMedicineId ? 'Update' : 'Save'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<RestartAlt />}
                onClick={() => {
                  setMedicineForm(initialMedicineForm);
                  setEditingMedicineId(null);
                }}
              >
                Reset
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={7}>
        <Grid container spacing={2}>
          {medicines.map((medicine) => (
            <Grid item xs={12} sm={6} key={medicine.id}>
              <Card>
                {medicine.image && (
                  <CardMedia component="img" height="150" image={medicine.image} alt={medicine.name} />
                )}
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{medicine.name}</Typography>
                    <Chip label={medicine.category} size="small" color="info" />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {medicine.brand}
                  </Typography>
                  <Typography variant="body2" sx={{ my: 1 }}>
                    {medicine.description}
                  </Typography>
                  <Typography variant="subtitle1">
                    Rs. {medicine.price} / {medicine.unit}
                  </Typography>
                  <Typography variant="caption" display="block">
                    Stock: {medicine.stock}
                  </Typography>
                  <Typography variant="caption" display="block">
                    Requires prescription: {medicine.requiresPrescription ? 'Yes' : 'No'}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => {
                        setMedicineForm({
                          name: medicine.name,
                          brand: medicine.brand || '',
                          category: medicine.category,
                          description: medicine.description || '',
                          price: medicine.price,
                          unit: medicine.unit || 'dose',
                          stock: medicine.stock,
                          requiresPrescription: !!medicine.requiresPrescription,
                          image: medicine.image || '',
                        });
                        setEditingMedicineId(medicine.id);
                      }}
                    >
                      Edit
                    </Button>
                    <IconButton color="error" onClick={() => removeMedicine(medicine.id)}>
                      <Delete />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {medicines.length === 0 && (
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                <AddCircle color="disabled" sx={{ fontSize: 48 }} />
                <Typography variant="body1" color="text.secondary">
                  No medicines yet. Add your first entry using the form.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );

  const renderGroceryTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={5}>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {editingGroceryId ? 'Update Grocery' : 'Add Grocery'}
          </Typography>
          <Box component="form" onSubmit={handleGrocerySubmit}>
            <TextField
              label="Item name"
              name="name"
              value={groceryForm.name}
              onChange={handleFormChange(setGroceryForm)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              value={groceryForm.description}
              onChange={handleFormChange(setGroceryForm)}
              fullWidth
              multiline
              rows={3}
              margin="normal"
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Price per unit (Rs.)"
                name="price"
                value={groceryForm.price}
                onChange={handleFormChange(setGroceryForm)}
                type="number"
                inputProps={{ min: 0 }}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Unit"
                name="unit"
                value={groceryForm.unit}
                onChange={handleFormChange(setGroceryForm)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Stock"
                name="stock"
                value={groceryForm.stock}
                onChange={handleFormChange(setGroceryForm)}
                type="number"
                inputProps={{ min: 0 }}
                fullWidth
                margin="normal"
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ my: 2 }}>
              <Button
                variant="outlined"
                startIcon={<AddPhotoAlternate />}
                component="label"
              >
                Upload Image
                <input type="file" hidden accept="image/*" onChange={handleGroceryImageUpload} />
              </Button>
              <TextField
                label="Image URL"
                name="image"
                value={groceryForm.image}
                onChange={handleFormChange(setGroceryForm)}
                fullWidth
              />
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" startIcon={<Save />}>
                {editingGroceryId ? 'Update' : 'Save'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<RestartAlt />}
                onClick={() => {
                  setGroceryForm(initialGroceryForm);
                  setEditingGroceryId(null);
                }}
              >
                Reset
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={7}>
        <Grid container spacing={2}>
          {groceries.map((item) => (
            <Grid item xs={12} sm={6} key={item.id}>
              <Card>
                {item.image && (
                  <CardMedia component="img" height="150" image={item.image} alt={item.name} />
                )}
                <CardContent>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2" sx={{ my: 1 }}>
                    {item.description}
                  </Typography>
                  <Typography variant="subtitle1">
                    Rs. {item.price} / {item.unit}
                  </Typography>
                  <Typography variant="caption" display="block">
                    Stock: {item.stock}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => {
                        setGroceryForm({
                          name: item.name,
                          description: item.description || '',
                          price: item.price,
                          unit: item.unit || 'item',
                          stock: item.stock,
                          image: item.image || '',
                        });
                        setEditingGroceryId(item.id);
                      }}
                    >
                      Edit
                    </Button>
                    <IconButton color="error" onClick={() => removeGrocery(item.id)}>
                      <Delete />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {groceries.length === 0 && (
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                <AddCircle color="disabled" sx={{ fontSize: 48 }} />
                <Typography variant="body1" color="text.secondary">
                  No grocery items yet. Use the form to add your first item.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Catalogue Manager
        </Typography>
        <Typography color="text.secondary">
          Add or update OTC medicines and grocery items with dose-based pricing.
        </Typography>
        <Alert
          severity="info"
          icon={<Info fontSize="inherit" />}
          sx={{ mt: 2, bgcolor: 'primary.50', color: 'primary.dark' }}
        >
          Add or update items in the pharmacy catalogue by selecting the correct category (Prescription, OTC, Herbal,
          Vitamins, or Non-Medical). Enter the medicine name, brand, description, price, stock quantity, and whether it
          requires a prescription. Upload an image and save the item to make it visible for patients.
        </Alert>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}>
          <Tab label="Medicine Catalogue" />
          <Tab label="Grocery Catalogue" />
        </Tabs>
        <Box sx={{ mt: 3 }}>
          {tabIndex === 0 ? renderMedicineTab() : renderGroceryTab()}
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminPortal;
