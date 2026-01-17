import React from 'react';
import { Paper, Typography, Box, Grid, TextField, MenuItem, Stack, Button, IconButton, FormControlLabel, Switch } from '@mui/material';
import { AddPhotoAlternate, Save, RestartAlt, Close, Clear } from '@mui/icons-material';

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
}) => (
  <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
    <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
      {editingMedicineId ? 'Update Medicine' : 'Add New Medicine'}
    </Typography>
    <Box component="form" onSubmit={onSubmit}>
      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField label="Medicine Name *" name="name" value={medicineForm.name} onChange={handleFormChange(setMedicineForm)} fullWidth required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Brand" name="brand" value={medicineForm.brand} onChange={handleFormChange(setMedicineForm)} fullWidth />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField select label="Category *" name="category" value={medicineForm.category} onChange={handleFormChange(setMedicineForm)} fullWidth required>
            {MEDICINE_CATEGORIES.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField select label="Base Unit *" name="baseUnit" value={medicineForm.baseUnit} onChange={handleFormChange(setMedicineForm)} fullWidth required>
            {BASE_UNITS.map((unit) => (
              <MenuItem key={unit.value} value={unit.value}>{unit.label}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField select label="Packaging Type *" name="packaging.type" value={medicineForm.packaging.type} onChange={(e) => setMedicineForm(prev => ({ ...prev, packaging: { ...prev.packaging, type: e.target.value } }))} fullWidth required>
            {PACKAGING_TYPES.map((type) => (
              <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Quantity per Pack *" name="packaging.qtyPerPack" type="number" value={medicineForm.packaging.qtyPerPack} onChange={(e) => {
            const qty = parseInt(e.target.value) || 1;
            setMedicineForm(prev => ({ ...prev, packaging: { ...prev.packaging, qtyPerPack: qty } }));
          }} fullWidth required inputProps={{ min: 1 }} helperText={`e.g., 10 tablets per card, 120ml per bottle`} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Pack Display Name (Optional)" name="packaging.packName" value={medicineForm.packaging.packName} onChange={(e) => setMedicineForm(prev => ({ ...prev, packaging: { ...prev.packaging, packName: e.target.value } }))} fullWidth placeholder="e.g., 1 card (10 tablets)" helperText="Leave empty for auto-generated name" />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Price per Pack (Rs.) *" name="price.perPack" type="number" value={medicineForm.price.perPack} onChange={(e) => setMedicineForm(prev => ({ ...prev, price: { ...prev.price, perPack: e.target.value } }))} fullWidth required inputProps={{ min: 0, step: 0.01 }} helperText={medicineForm.price.perPack && medicineForm.packaging.qtyPerPack ? `Per unit: Rs. ${(parseFloat(medicineForm.price.perPack) / medicineForm.packaging.qtyPerPack).toFixed(2)}` : ''} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Stock (Number of Packs)" name="stock.packs" type="number" value={medicineForm.stock.packs} onChange={(e) => setMedicineForm(prev => ({ ...prev, stock: { ...prev.stock, packs: e.target.value } }))} fullWidth inputProps={{ min: 0 }} helperText={medicineForm.stock.packs && medicineForm.packaging.qtyPerPack ? `Total: ${parseInt(medicineForm.stock.packs || 0) * medicineForm.packaging.qtyPerPack} ${medicineForm.baseUnit}s` : ''} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Min Stock Alert (Base Units)" name="minStockUnits" type="number" value={medicineForm.minStockUnits} onChange={handleFormChange(setMedicineForm)} fullWidth inputProps={{ min: 0 }} helperText={`Alert when stock falls below ${medicineForm.minStockUnits} ${medicineForm.baseUnit}s`} />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Description" name="description" value={medicineForm.description} onChange={handleFormChange(setMedicineForm)} fullWidth multiline rows={3} />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel control={<Switch name="requiresPrescription" checked={medicineForm.requiresPrescription} onChange={handleFormChange(setMedicineForm)} />} label="Requires Prescription" />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button variant="outlined" component="label" startIcon={<AddPhotoAlternate />}>Upload Image<input type="file" hidden accept="image/*" onChange={handleImageUpload(setMedicineForm)} /></Button>
            {medicineForm.imageUrl && (
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Box component="img" src={medicineForm.imageUrl} alt="Preview" sx={{ maxHeight: 100, maxWidth: 100, objectFit: 'cover', borderRadius: 1 }} />
                <IconButton size="small" onClick={handleRemoveImage(setMedicineForm)} sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            )}
            <TextField label="Or Image URL" name="imageUrl" value={medicineForm.imageUrl} onChange={handleFormChange(setMedicineForm)} fullWidth placeholder="https://..." InputProps={{ endAdornment: medicineForm.imageUrl && (
              <IconButton size="small" onClick={() => setMedicineForm((prev) => {
                if (prev.imageUrl && prev.imageUrl.startsWith('blob:')) {
                  URL.revokeObjectURL(prev.imageUrl);
                }
                return { ...prev, imageUrl: '', image: null };
              })}>
                <Clear fontSize="small" />
              </IconButton>
            ) }} />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" startIcon={<Save />} disabled={loading}>{editingMedicineId ? 'Update' : 'Save'}</Button>
            <Button variant="outlined" startIcon={<RestartAlt />} onClick={onReset}>Reset</Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  </Paper>
);

export default MedicineForm;
