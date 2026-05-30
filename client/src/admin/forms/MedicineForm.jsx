import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Grid, 
  TextField, 
  MenuItem, 
  Stack, 
  Button, 
  IconButton, 
  FormControlLabel, 
  Switch, 
  Divider,
  InputAdornment,
  Autocomplete
} from '@mui/material';
import { 
  Save, 
  RestartAlt, 
  Close, 
  Clear, 
  LocalPharmacy, 
  Inventory, 
  MonetizationOn, 
  AddPhotoAlternate,
  InfoOutlined
} from '@mui/icons-material';
import { MEDICINE_TEMPLATES } from '../constants';

const MedicineForm = ({
  medicineForm,
  setMedicineForm,
  editingMedicineId,
  MEDICINE_CATEGORIES,
  BASE_UNITS,
  PACKAGING_TYPES,
  loading,
  onSubmit,
  onReset,
  handleFormChange,
  handleImageUpload,
  handleRemoveImage,
}) => {
  const COLORS = {
    primary: '#2C3E50',
    secondary: '#546E7A',
    teal: '#7AA8B0',
    lightGreen: '#ECF4E8',
    alertGreen: '#ABE7B2',
    accentBlue: '#93BFC7',
    border: 'rgba(147, 191, 199, 0.35)'
  };

  const sectionHeaderSx = {
    fontSize: '0.85rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: COLORS.secondary,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mt: 1,
    mb: 1
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        borderRadius: 3, 
        border: `1px solid ${COLORS.border}`,
        boxShadow: '0 10px 30px rgba(44, 62, 80, 0.05)',
        overflow: 'hidden',
        background: '#ffffff'
      }}
    >
      {/* Premium Form Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #ECF4E8 0%, #CBF3BB 50%, #93BFC7 100%)',
        p: 2.5,
        borderBottom: `1px solid ${COLORS.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Box sx={{
          backgroundColor: '#ffffff',
          borderRadius: '50%',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
        }}>
          <LocalPharmacy sx={{ color: '#2C3E50' }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: COLORS.primary, lineHeight: 1.2 }}>
            {editingMedicineId ? 'Update Medication' : 'Add New Medication'}
          </Typography>
          <Typography variant="caption" sx={{ color: COLORS.secondary }}>
            {editingMedicineId ? 'Modify medicine catalog specifications' : 'Create a new catalog item with packaging & prices'}
          </Typography>
        </Box>
      </Box>

      {/* Form Content */}
      <Box component="form" onSubmit={onSubmit} sx={{ p: 3 }}>
        <Grid container spacing={2.5}>
          
          {/* SECTION 1: BASIC INFORMATION */}
          <Grid item xs={12}>
            <Typography sx={sectionHeaderSx}>
              <InfoOutlined fontSize="small" sx={{ color: COLORS.teal }} />
              Basic Specifications
            </Typography>
            <Divider sx={{ mb: 1.5 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              freeSolo
              size="small"
              options={MEDICINE_TEMPLATES}
              getOptionLabel={(option) => {
                if (typeof option === 'string') return option;
                return option.name || '';
              }}
              value={medicineForm.name}
              onChange={(event, newValue) => {
                if (newValue) {
                  if (typeof newValue === 'string') {
                    setMedicineForm(prev => ({ ...prev, name: newValue }));
                  } else {
                    setMedicineForm(prev => ({
                      ...prev,
                      name: newValue.name || '',
                      brand: newValue.brand || prev.brand,
                      category: newValue.category || prev.category,
                      description: newValue.description || prev.description,
                      baseUnit: newValue.baseUnit || prev.baseUnit,
                      requiresPrescription: newValue.requiresPrescription !== undefined ? newValue.requiresPrescription : prev.requiresPrescription,
                      imageUrl: newValue.imageUrl || prev.imageUrl,
                      packaging: {
                        ...prev.packaging,
                        type: newValue.packagingType || prev.packaging.type,
                        qtyPerPack: newValue.packagingQtyPerPack || prev.packaging.qtyPerPack
                      }
                    }));
                  }
                } else {
                  setMedicineForm(prev => ({ ...prev, name: '' }));
                }
              }}
              onInputChange={(event, newInputValue) => {
                setMedicineForm(prev => ({ ...prev, name: newInputValue }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label="Medicine Name *"
                  placeholder="e.g., Panadol 500mg"
                  helperText="Autocomplete pre-fills specifications"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Brand" 
              name="brand" 
              value={medicineForm.brand} 
              onChange={handleFormChange(setMedicineForm)} 
              fullWidth 
              size="small"
              placeholder="e.g., Pfizer / SPC"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField 
              select 
              label="Category *" 
              name="category" 
              value={medicineForm.category} 
              onChange={handleFormChange(setMedicineForm)} 
              fullWidth 
              required
              size="small"
            >
              {MEDICINE_CATEGORIES.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField 
              label="Description" 
              name="description" 
              value={medicineForm.description} 
              onChange={handleFormChange(setMedicineForm)} 
              fullWidth 
              multiline 
              rows={2} 
              size="small"
              placeholder="Enter indications, warnings, or basic instructions..."
            />
          </Grid>

          {/* SECTION 2: PACKAGING & FORMULA */}
          <Grid item xs={12}>
            <Typography sx={sectionHeaderSx}>
              <Inventory fontSize="small" sx={{ color: COLORS.teal }} />
              Packaging & Base Unit setup
            </Typography>
            <Divider sx={{ mb: 1.5 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              select 
              label="Base Unit *" 
              name="baseUnit" 
              value={medicineForm.baseUnit} 
              onChange={handleFormChange(setMedicineForm)} 
              fullWidth 
              required
              size="small"
            >
              {BASE_UNITS.map((unit) => (
                <MenuItem key={unit.value} value={unit.value}>{unit.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              select 
              label="Packaging Type *" 
              name="packaging.type" 
              value={medicineForm.packaging.type} 
              onChange={(e) => setMedicineForm(prev => ({ ...prev, packaging: { ...prev.packaging, type: e.target.value } }))} 
              fullWidth 
              required
              size="small"
            >
              {PACKAGING_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Quantity per Pack *" 
              name="packaging.qtyPerPack" 
              type="number" 
              value={medicineForm.packaging.qtyPerPack} 
              onChange={(e) => {
                const qty = parseInt(e.target.value) || 1;
                setMedicineForm(prev => ({ ...prev, packaging: { ...prev.packaging, qtyPerPack: qty } }));
              }} 
              fullWidth 
              required 
              size="small"
              inputProps={{ min: 1 }} 
              helperText={`Units in 1 pack (e.g. 10 tablets/card)`}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Pack Display Name (Optional)" 
              name="packaging.packName" 
              value={medicineForm.packaging.packName} 
              onChange={(e) => setMedicineForm(prev => ({ ...prev, packaging: { ...prev.packaging, packName: e.target.value } }))} 
              fullWidth 
              size="small"
              placeholder="e.g., Card of 10 tablets" 
              helperText="Auto-generated if left blank"
            />
          </Grid>

          {/* SECTION 3: INVENTORY, PRICING & CLASSIFICATION */}
          <Grid item xs={12}>
            <Typography sx={sectionHeaderSx}>
              <MonetizationOn fontSize="small" sx={{ color: COLORS.teal }} />
              Pricing & Inventory thresholds
            </Typography>
            <Divider sx={{ mb: 1.5 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label="Price per Pack (Rs.) *" 
              name="price.perPack" 
              type="number" 
              value={medicineForm.price.perPack} 
              onChange={(e) => setMedicineForm(prev => ({ ...prev, price: { ...prev.price, perPack: e.target.value } }))} 
              fullWidth 
              required 
              size="small"
              inputProps={{ min: 0, step: 0.01 }} 
              InputProps={{
                startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
              }}
              helperText={medicineForm.price.perPack && medicineForm.packaging.qtyPerPack ? `Per unit cost: Rs. ${(parseFloat(medicineForm.price.perPack) / medicineForm.packaging.qtyPerPack).toFixed(2)}` : ''}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Stock (Number of Packs)" 
              name="stock.packs" 
              type="number" 
              value={medicineForm.stock.packs} 
              onChange={(e) => setMedicineForm(prev => ({ ...prev, stock: { ...prev.stock, packs: e.target.value } }))} 
              fullWidth 
              size="small"
              inputProps={{ min: 0 }} 
              helperText={medicineForm.stock.packs && medicineForm.packaging.qtyPerPack ? `Equivalent to ${parseInt(medicineForm.stock.packs || 0) * medicineForm.packaging.qtyPerPack} base ${medicineForm.baseUnit}s` : 'Current physical stock'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Min Stock Alert (Base Units)" 
              name="minStockUnits" 
              type="number" 
              value={medicineForm.minStockUnits} 
              onChange={handleFormChange(setMedicineForm)} 
              fullWidth 
              size="small"
              inputProps={{ min: 0 }} 
              helperText={`Triggers alert at < ${medicineForm.minStockUnits} units`}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', pl: 1 }}>
            <FormControlLabel 
              control={
                <Switch 
                  name="requiresPrescription" 
                  checked={medicineForm.requiresPrescription} 
                  onChange={handleFormChange(setMedicineForm)} 
                  color="warning"
                />
              } 
              label={
                <Typography variant="body2" sx={{ fontWeight: 600, color: medicineForm.requiresPrescription ? 'orange' : 'text.primary' }}>
                  Requires Prescription
                </Typography>
              } 
            />
          </Grid>

          {/* SECTION 4: MEDIA ASSIGNMENT */}
          <Grid item xs={12}>
            <Typography sx={sectionHeaderSx}>
              <AddPhotoAlternate fontSize="small" sx={{ color: COLORS.teal }} />
              Medication Image
            </Typography>
            <Divider sx={{ mb: 1.5 }} />
          </Grid>

          <Grid item xs={12}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <Button 
                variant="outlined" 
                component="label" 
                startIcon={<AddPhotoAlternate />}
                sx={{ 
                  textTransform: 'none', 
                  borderColor: COLORS.teal, 
                  color: COLORS.primary,
                  whiteSpace: 'nowrap',
                  '&:hover': { borderColor: COLORS.primary, backgroundColor: COLORS.lightGreen }
                }}
              >
                Upload File
                <input type="file" hidden accept="image/*" onChange={handleImageUpload(setMedicineForm)} />
              </Button>

              <TextField 
                label="Or Image URL" 
                name="imageUrl" 
                value={medicineForm.imageUrl} 
                onChange={handleFormChange(setMedicineForm)} 
                fullWidth 
                size="small"
                placeholder="https://google.com/path-to-image.png" 
                InputProps={{ 
                  endAdornment: medicineForm.imageUrl && (
                    <IconButton 
                      size="small" 
                      onClick={() => setMedicineForm((prev) => {
                        if (prev.imageUrl && prev.imageUrl.startsWith('blob:')) {
                          URL.revokeObjectURL(prev.imageUrl);
                        }
                        return { ...prev, imageUrl: '', image: null };
                      })}
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  ) 
                }} 
              />
            </Stack>

            {medicineForm.imageUrl && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ position: 'relative', borderRadius: 2, border: `1px solid ${COLORS.border}`, p: 0.5, backgroundColor: COLORS.lightGreen }}>
                  <Box 
                    component="img" 
                    src={medicineForm.imageUrl} 
                    alt="Preview" 
                    sx={{ 
                      maxHeight: 120, 
                      maxWidth: '100%', 
                      objectFit: 'contain', 
                      borderRadius: 1.5,
                      display: 'block'
                    }} 
                  />
                  <IconButton 
                    size="small" 
                    onClick={handleRemoveImage(setMedicineForm)} 
                    sx={{ 
                      position: 'absolute', 
                      top: -10, 
                      right: -10, 
                      bgcolor: 'error.main', 
                      color: 'white', 
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                      '&:hover': { bgcolor: 'error.dark' } 
                    }}
                  >
                    <Close fontSize="small" sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              </Box>
            )}
          </Grid>

          {/* SUBMIT BUTTONS */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1.5 }} />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button 
                variant="outlined" 
                startIcon={<RestartAlt />} 
                onClick={onReset}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Reset Form
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                startIcon={<Save />} 
                disabled={loading}
                sx={{ 
                  textTransform: 'none', 
                  borderRadius: 2, 
                  backgroundColor: COLORS.teal, 
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(122, 168, 176, 0.3)',
                  '&:hover': { backgroundColor: COLORS.primary } 
                }}
              >
                {editingMedicineId ? 'Update Specs' : 'Save Medicine'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default MedicineForm;
