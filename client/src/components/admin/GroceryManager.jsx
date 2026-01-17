import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Tabs, Tab, CircularProgress } from '@mui/material';
import { groceryAPI } from '../../services/api';
import BulkGroceryImport from './BulkGroceryImport';
import { initialGroceryForm } from './constants';
import GroceryForm from './forms/GroceryForm';
import GroceryList from './lists/GroceryList';

const GroceryManager = () => {
  const [groceries, setGroceries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groceryForm, setGroceryForm] = useState(initialGroceryForm);
  const [editingGroceryId, setEditingGroceryId] = useState(null);
  const [viewMode, setViewMode] = useState('single'); // 'single' | 'bulk'

  const fetchGroceries = async () => {
    setLoading(true);
    try {
      const response = await groceryAPI.getAllAdmin();
      setGroceries(response.data);
    } catch (error) {
      console.error('Error fetching groceries:', error);
      alert('Failed to load groceries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGroceries(); }, []);

  const handleFormChange = (setter) => (event) => {
    const { name, value } = event.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (setter) => (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setter((prev) => {
        if (prev.imageUrl && prev.imageUrl.startsWith('blob:')) URL.revokeObjectURL(prev.imageUrl);
        return { ...prev, image: file, imageUrl: URL.createObjectURL(file) };
      });
    }
  };

  const handleRemoveImage = (setter) => () => {
    setter((prev) => {
      if (prev.imageUrl && prev.imageUrl.startsWith('blob:')) URL.revokeObjectURL(prev.imageUrl);
      return { ...prev, image: null, imageUrl: '' };
    });
  };

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
        if (key === 'image') {
          if (groceryForm.image) formData.append('image', groceryForm.image);
          else if (groceryForm.imageUrl && groceryForm.imageUrl.trim() !== '') formData.append('image', groceryForm.imageUrl);
          else formData.append('image', '');
        } else if (key !== 'image' && key !== 'imageUrl' && groceryForm[key] !== null && groceryForm[key] !== '') {
          formData.append(key, groceryForm[key]);
        }
      });
      if (editingGroceryId) await groceryAPI.update(editingGroceryId, formData);
      else await groceryAPI.create(formData);
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
    if (!window.confirm('Delete this grocery item?')) return;
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

  const handleClearAlert = async (id) => {
    try {
      await groceryAPI.clearAlert(id);
      await fetchGroceries();
      alert('Alert cleared successfully!');
    } catch (error) {
      console.error('Error clearing alert:', error);
      alert('Failed to clear alert. Please try again.');
    }
  };

  const isLowStock = (item) => (item.stock || 0) <= (parseInt(item.minStock, 10) || 0);
  const isOutOfStock = (item) => (item.stock || 0) <= 0;

  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tabs value={viewMode === 'single' ? 0 : 1} onChange={(e, v) => setViewMode(v === 0 ? 'single' : 'bulk')}>
          <Tab label="Manage" />
          <Tab label="Bulk Import" />
        </Tabs>
        {loading && <CircularProgress size={20} />}
      </Paper>

      {viewMode === 'bulk' ? (
        <BulkGroceryImport />
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <GroceryForm
              groceryForm={groceryForm}
              setGroceryForm={setGroceryForm}
              editingGroceryId={editingGroceryId}
              loading={loading}
              onSubmit={handleGrocerySubmit}
              onReset={() => { setGroceryForm(initialGroceryForm); setEditingGroceryId(null); }}
              handleFormChange={handleFormChange}
              handleImageUpload={handleImageUpload}
              handleRemoveImage={handleRemoveImage}
            />
          </Grid>
          <Grid item xs={12} md={7}>
            <GroceryList
              groceries={groceries}
              loading={loading}
              handleEditGrocery={handleEditGrocery}
              handleDeleteGrocery={handleDeleteGrocery}
              handleClearAlert={(id) => handleClearAlert(id, 'grocery')}
              isLowStock={isLowStock}
              isOutOfStock={isOutOfStock}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default GroceryManager;
