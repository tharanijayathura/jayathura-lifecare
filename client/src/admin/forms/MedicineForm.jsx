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
  Autocomplete,
  Tabs,
  Tab,
  Card,
  CardMedia,
  CardContent,
  Chip
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
  InfoOutlined,
  NavigateNext,
  NavigateBefore,
  CheckCircle
} from '@mui/icons-material';
import { MEDICINE_TEMPLATES } from '../constants';
import { getPublicFileUrl } from '../../services/api';


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
  const [activeTab, setActiveTab] = React.useState(0);

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

  // Reset tab to 0 when starting to edit a different medicine or resetting
  React.useEffect(() => {
    setActiveTab(0);
  }, [editingMedicineId]);

  // Tab validations
  const isTab0Valid = !!(medicineForm.name && medicineForm.category);
  const isTab1Valid = !!(
    medicineForm.baseUnit && 
    medicineForm.packaging.type && 
    medicineForm.packaging.qtyPerPack && 
    medicineForm.price.perPack
  );

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
        justifyContent: 'space-between',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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

        {editingMedicineId && (
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={onReset}
            startIcon={<Close />}
            sx={{ 
              textTransform: 'none', 
              borderRadius: 2,
              fontSize: '0.75rem',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(211, 47, 47, 0.2)'
            }}
          >
            Cancel Update
          </Button>
        )}
      </Box>

      {/* Structured Tab Header */}
      <Tabs 
        value={activeTab} 
        onChange={(e, val) => setActiveTab(val)} 
        variant="fullWidth"
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: '#f8f9fa',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.75rem',
            py: 1.5,
            minHeight: 48,
          },
          '& .Mui-selected': {
            color: `${COLORS.primary} !important`,
          },
          '& .MuiTabs-indicator': {
            backgroundColor: COLORS.teal,
            height: 3,
            borderRadius: '3px 3px 0 0',
          }
        }}
      >
        <Tab 
          icon={isTab0Valid ? <CheckCircle fontSize="small" sx={{ color: 'success.main' }} /> : <InfoOutlined fontSize="small" />} 
          iconPosition="start" 
          label="Basic" 
        />
        <Tab 
          icon={isTab1Valid ? <CheckCircle fontSize="small" sx={{ color: 'success.main' }} /> : <MonetizationOn fontSize="small" />} 
          iconPosition="start" 
          label="Packaging & Price" 
        />
        <Tab 
          icon={<Inventory fontSize="small" />} 
          iconPosition="start" 
          label="Stock & Image" 
        />
      </Tabs>

      {/* Form Content */}
      <Box component="form" onSubmit={onSubmit} sx={{ p: 3 }}>
        
        {/* TAB 0: BASIC INFORMATION */}
        <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <Typography sx={sectionHeaderSx}>
                <InfoOutlined fontSize="small" sx={{ color: COLORS.teal }} />
                General Catalog Specifications
              </Typography>
              <Divider sx={{ mb: 1.5 }} />
            </Grid>

            <Grid item xs={12}>
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
                renderOption={(props, option) => {
                  if (typeof option === 'string') return <li {...props}>{option}</li>;
                  return (
                    <Box 
                      component="li" 
                      {...props} 
                      key={option.name}
                      sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'flex-start', 
                        gap: 0.5,
                        p: '10px 14px !important',
                        borderBottom: '1px solid rgba(0,0,0,0.04)',
                        '&:hover': {
                          backgroundColor: '#ECF4E8 !important'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: COLORS.primary }}>
                          {option.name}
                        </Typography>
                        <Chip 
                          label={option.category === 'prescription' ? 'Rx Only' : option.category === 'otc' ? 'OTC' : option.category.toUpperCase()} 
                          size="small" 
                          sx={{ 
                            height: 18, 
                            fontSize: '0.65rem', 
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            backgroundColor: option.category === 'prescription' ? '#FFF3E0' : option.category === 'otc' ? '#E3F2FD' : '#E8F5E9',
                            color: option.category === 'prescription' ? '#E65100' : option.category === 'otc' ? '#1565C0' : '#2E7D32',
                            border: `1px solid ${option.category === 'prescription' ? '#FFE0B2' : option.category === 'otc' ? '#BBDEFB' : '#C8E6C9'}`
                          }} 
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                        {option.brand && (
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            Brand: <strong>{option.brand}</strong>
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.disabled">|</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Pack: <strong>{option.packagingQtyPerPack} {option.baseUnit}s per {option.packagingType}</strong>
                        </Typography>
                      </Box>
                    </Box>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="Medicine Name *"
                    placeholder="e.g., Panadol 500mg"
                    helperText="Search drug templates to auto-fill specifications"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField 
                label="Brand" 
                name="brand" 
                value={medicineForm.brand} 
                onChange={handleFormChange(setMedicineForm)} 
                fullWidth 
                size="small"
                placeholder="e.g., Pfizer / GSK / SPC Sri Lanka"
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
                rows={3} 
                size="small"
                placeholder="Enter indications, warnings, ingredients, or usage guidelines..."
              />
            </Grid>
          </Grid>
        </Box>

        {/* TAB 1: PACKAGING & PRICE */}
        <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <Typography sx={sectionHeaderSx}>
                <MonetizationOn fontSize="small" sx={{ color: COLORS.teal }} />
                Packaging & Unit Price setup
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
                helperText="Lowest unit (e.g. tablet, ml)"
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
                helperText="Container style (e.g. card, bottle)"
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
                helperText="Units in 1 pack (e.g. 10 tablets)"
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

            <Grid item xs={12}>
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
                helperText={medicineForm.price.perPack && medicineForm.packaging.qtyPerPack ? `Unit cost: Rs. ${(parseFloat(medicineForm.price.perPack) / medicineForm.packaging.qtyPerPack).toFixed(2)}` : 'Enter the customer price for a single pack'}
              />
            </Grid>
          </Grid>
        </Box>

        {/* TAB 2: STOCK & MEDIA */}
        <Box sx={{ display: activeTab === 2 ? 'block' : 'none' }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <Typography sx={sectionHeaderSx}>
                <Inventory fontSize="small" sx={{ color: COLORS.teal }} />
                Inventory & Medication Media
              </Typography>
              <Divider sx={{ mb: 1.5 }} />
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

            <Grid item xs={12}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: 2, 
                border: `1px solid ${COLORS.border}`, 
                backgroundColor: medicineForm.requiresPrescription ? 'rgba(230, 81, 0, 0.03)' : '#fcfcfc'
              }}>
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
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: medicineForm.requiresPrescription ? '#E65100' : COLORS.primary }}>
                        Requires Prescription
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Requires a valid medical doctor prescription to purchase this item.
                      </Typography>
                    </Box>
                  } 
                />
              </Box>
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
                  placeholder="https://example.com/med-photo.png" 
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
                      src={getPublicFileUrl(medicineForm.imageUrl)} 
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
          </Grid>
        </Box>

        {/* NAVIGATION / ACTION BUTTONS */}
        <Grid container sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" justifyContent="space-between">
              {activeTab > 0 ? (
                <Button 
                  variant="outlined" 
                  startIcon={<NavigateBefore />} 
                  onClick={() => setActiveTab(prev => prev - 1)}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Back
                </Button>
              ) : (
                <Button 
                  variant="outlined" 
                  startIcon={<RestartAlt />} 
                  onClick={onReset}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Reset Form
                </Button>
              )}

              <Stack direction="row" spacing={1.5}>
                {activeTab < 2 ? (
                  <Button 
                    variant="contained" 
                    endIcon={<NavigateNext />} 
                    onClick={() => setActiveTab(prev => prev + 1)}
                    sx={{ 
                      textTransform: 'none', 
                      borderRadius: 2, 
                      backgroundColor: COLORS.teal, 
                      color: '#ffffff',
                      boxShadow: '0 4px 12px rgba(122, 168, 176, 0.3)',
                      '&:hover': { backgroundColor: COLORS.primary } 
                    }}
                  >
                    Next Step
                  </Button>
                ) : (
                  <>
                    {activeTab === 2 && !editingMedicineId && (
                      <Button 
                        variant="outlined" 
                        startIcon={<RestartAlt />} 
                        onClick={onReset}
                        sx={{ textTransform: 'none', borderRadius: 2 }}
                      >
                        Reset Form
                      </Button>
                    )}
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
                  </>
                )}
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        {/* LIVE STOREFRONT CARD PREVIEW */}
        <Box sx={{ mt: 4, pt: 3, borderTop: `1px dashed ${COLORS.border}` }}>
          <Typography sx={{ ...sectionHeaderSx, mt: 0, mb: 2, color: COLORS.teal }}>
            <InfoOutlined fontSize="small" />
            Live storefront preview
          </Typography>

          <Card sx={{ 
            border: medicineForm.requiresPrescription ? '2px solid #E65100' : `1px solid ${COLORS.border}`, 
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            position: 'relative',
            backgroundColor: '#ffffff'
          }}>
            {/* Requires Prescription Banner */}
            {medicineForm.requiresPrescription && (
              <Box sx={{ 
                position: 'absolute', 
                top: 8, 
                left: 8, 
                bgcolor: '#E65100', 
                color: 'white', 
                px: 1, 
                py: 0.25, 
                borderRadius: 1, 
                fontSize: '0.65rem', 
                fontWeight: 700,
                zIndex: 1,
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                Prescription Rx
              </Box>
            )}

            {/* Live Preview Label */}
            <Box sx={{ 
              position: 'absolute', 
              top: 8, 
              right: 8, 
              bgcolor: COLORS.lightGreen, 
              color: COLORS.primary, 
              px: 1, 
              py: 0.25, 
              borderRadius: 1, 
              fontSize: '0.65rem', 
              fontWeight: 700,
              zIndex: 1,
              border: `1px solid ${COLORS.teal}`
            }}>
              LIVE PREVIEW
            </Box>

            {/* Card Media */}
            <CardMedia 
              component="img" 
              height="130" 
              image={getPublicFileUrl(medicineForm.imageUrl) || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300'} 
              alt="Listing Preview" 
              sx={{ 
                objectFit: 'cover', 
                filter: medicineForm.imageUrl ? 'none' : 'grayscale(100%) opacity(0.5)',
                backgroundColor: '#f5f5f5' 
              }} 
            />

            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1} mb={1}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700, color: COLORS.primary, lineHeight: 1.2 }}>
                    {medicineForm.name || 'Untitled Medicine'}
                  </Typography>
                  {medicineForm.brand && (
                    <Typography variant="caption" noWrap color="text.secondary" sx={{ display: 'block' }}>
                      Brand: {medicineForm.brand}
                    </Typography>
                  )}
                </Box>
                <Chip 
                  label={MEDICINE_CATEGORIES.find(c => c.value === medicineForm.category)?.label || 'OTC'} 
                  size="small" 
                  sx={{ 
                    height: 20, 
                    fontSize: '0.65rem', 
                    fontWeight: 700,
                    backgroundColor: COLORS.lightGreen,
                    color: COLORS.primary,
                    border: `1px solid ${COLORS.teal}`
                  }} 
                />
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ 
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                height: 32,
                fontSize: '0.75rem',
                lineHeight: 1.2,
                mb: 2
              }}>
                {medicineForm.description || 'No description provided yet. Enter general catalog specifications above.'}
              </Typography>

              <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Price per Pack
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: COLORS.teal }}>
                    Rs. {parseFloat(medicineForm.price.perPack || 0).toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  {medicineForm.price.perPack && medicineForm.packaging.qtyPerPack ? (
                    <>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Per {medicineForm.baseUnit || 'unit'}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.secondary }}>
                        Rs. {(parseFloat(medicineForm.price.perPack) / medicineForm.packaging.qtyPerPack).toFixed(2)}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="caption" color="text.disabled">
                      Unit price unknown
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5}>
                <Chip 
                  label={`${medicineForm.stock.packs || 0} Packs`} 
                  size="small" 
                  color={parseInt(medicineForm.stock.packs || 0) === 0 ? 'error' : 'default'}
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
                <Chip 
                  label={`${parseInt(medicineForm.stock.packs || 0) * (parseInt(medicineForm.packaging.qtyPerPack) || 1)} ${medicineForm.baseUnit || 'units'}`} 
                  size="small" 
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
                <Chip 
                  label={`Min: ${medicineForm.minStockUnits || 10}`} 
                  size="small" 
                  variant="outlined" 
                  color="secondary"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Paper>
  );
};

export default MedicineForm;
