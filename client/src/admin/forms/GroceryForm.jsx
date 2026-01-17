import React from 'react';
import { Paper, Typography, Box, Grid, TextField, Stack, Button, IconButton } from '@mui/material';
import { AddPhotoAlternate, Save, RestartAlt, Close, Clear } from '@mui/icons-material';

const GroceryForm = ({
  groceryForm,
  setGroceryForm,
  editingGroceryId,
  loading,
  onSubmit,
  onReset,
  handleFormChange,
  handleImageUpload,
  handleRemoveImage,
}) => (
  <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
    <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
      {editingGroceryId ? 'Update Grocery' : 'Add New Grocery'}
    </Typography>
    <Box component="form" onSubmit={onSubmit}>
      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField label="Item Name *" name="name" value={groceryForm.name} onChange={handleFormChange(setGroceryForm)} fullWidth required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Price (Rs.) *" name="price" type="number" value={groceryForm.price} onChange={handleFormChange(setGroceryForm)} fullWidth required inputProps={{ min: 0, step: 0.01 }} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField label="Unit" name="unit" value={groceryForm.unit} onChange={handleFormChange(setGroceryForm)} fullWidth placeholder="item, kg, liter, etc." />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField label="Stock" name="stock" type="number" value={groceryForm.stock} onChange={handleFormChange(setGroceryForm)} fullWidth inputProps={{ min: 0 }} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField label="Min Stock (Alert Threshold)" name="minStock" type="number" value={groceryForm.minStock} onChange={handleFormChange(setGroceryForm)} fullWidth inputProps={{ min: 0 }} />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Description" name="description" value={groceryForm.description} onChange={handleFormChange(setGroceryForm)} fullWidth multiline rows={3} />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button variant="outlined" component="label" startIcon={<AddPhotoAlternate />}>Upload Image<input type="file" hidden accept="image/*" onChange={handleImageUpload(setGroceryForm)} /></Button>
            {groceryForm.imageUrl && (
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Box component="img" src={groceryForm.imageUrl} alt="Preview" sx={{ maxHeight: 100, maxWidth: 100, objectFit: 'cover', borderRadius: 1 }} />
                <IconButton size="small" onClick={handleRemoveImage(setGroceryForm)} sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            )}
            <TextField label="Or Image URL" name="imageUrl" value={groceryForm.imageUrl} onChange={handleFormChange(setGroceryForm)} fullWidth placeholder="https://..." InputProps={{ endAdornment: groceryForm.imageUrl && (
              <IconButton size="small" onClick={() => setGroceryForm((prev) => {
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
            <Button type="submit" variant="contained" startIcon={<Save />} disabled={loading}>{editingGroceryId ? 'Update' : 'Save'}</Button>
            <Button variant="outlined" startIcon={<RestartAlt />} onClick={onReset}>Reset</Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  </Paper>
);

export default GroceryForm;
