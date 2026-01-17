import React, { useEffect, useMemo, useState } from 'react';
import { Box, Grid, Paper, Tabs, Tab, Typography, CircularProgress } from '@mui/material';
import { medicineAPI } from '../../services/api';
import BulkMedicineImport from './BulkMedicineImport';
import { MEDICINE_CATEGORIES, BASE_UNITS, PACKAGING_TYPES, initialMedicineForm } from './constants';
import MedicineForm from './forms/MedicineForm';
import MedicineList from './lists/MedicineList';

const MedicineManager = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [medicineForm, setMedicineForm] = useState(initialMedicineForm);
  const [editingMedicineId, setEditingMedicineId] = useState(null);
  const [medicineCategoryTab, setMedicineCategoryTab] = useState(0);
  const [medicineSearchTerm, setMedicineSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('single'); // 'single' | 'bulk'

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await medicineAPI.getAllAdmin();
      setMedicines(response.data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      alert('Failed to load medicines.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMedicines(); }, []);

  const filteredMedicines = useMemo(() => {
    if (!medicines || medicines.length === 0) return [];
    const selectedCategory = medicineCategoryTab === 0 ? 'all' : MEDICINE_CATEGORIES[medicineCategoryTab - 1]?.value;
    return medicines.filter((med) => {
      const categoryMatch = selectedCategory === 'all' || !selectedCategory || med.category === selectedCategory;
      const searchMatch = !medicineSearchTerm ||
        (med.name && med.name.toLowerCase().includes(medicineSearchTerm.toLowerCase())) ||
        (med.brand && med.brand.toLowerCase().includes(medicineSearchTerm.toLowerCase())) ||
        (med.description && med.description.toLowerCase().includes(medicineSearchTerm.toLowerCase()));
      return categoryMatch && searchMatch;
    });
  }, [medicines, medicineCategoryTab, medicineSearchTerm]);

  const handleFormChange = (setter) => (event) => {
    const { name, value, type, checked } = event.target;
    setter((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
      formData.append('name', medicineForm.name);
      if (medicineForm.brand) formData.append('brand', medicineForm.brand);
      formData.append('category', medicineForm.category);
      if (medicineForm.description) formData.append('description', medicineForm.description);
      formData.append('baseUnit', medicineForm.baseUnit);
      formData.append('requiresPrescription', medicineForm.requiresPrescription);
      formData.append('packagingType', medicineForm.packaging.type);
      formData.append('packagingQtyPerPack', medicineForm.packaging.qtyPerPack.toString());
      if (medicineForm.packaging.packName) formData.append('packagingPackName', medicineForm.packaging.packName);
      formData.append('pricePerPack', medicineForm.price.perPack.toString());
      formData.append('stockPacks', (medicineForm.stock.packs || 0).toString());
      formData.append('minStockUnits', medicineForm.minStockUnits);
      if (medicineForm.image) {
        formData.append('image', medicineForm.image);
      } else if (medicineForm.imageUrl && medicineForm.imageUrl.trim() !== '') {
        formData.append('image', medicineForm.imageUrl);
      } else {
        formData.append('image', '');
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
      price: { perPack: medicine.price?.perPack?.toString() || '' },
      stock: { packs: medicine.stock?.packs?.toString() || '' },
      minStockUnits: medicine.minStockUnits?.toString() || '10',
      requiresPrescription: medicine.requiresPrescription || false,
      image: null,
      imageUrl: medicine.image || '',
    });
    setEditingMedicineId(medicine._id);
  };

  const handleDeleteMedicine = async (id) => {
    if (!window.confirm('Delete this medicine?')) return;
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

  const handleClearAlert = async (id) => {
    try {
      await medicineAPI.clearAlert(id);
      await fetchMedicines();
      alert('Alert cleared successfully!');
    } catch (error) {
      console.error('Error clearing alert:', error);
      alert('Failed to clear alert. Please try again.');
    }
  };

  const isLowStock = (item) => item.stock?.units <= item.minStockUnits;
  const isOutOfStock = (item) => item.stock?.units <= 0;

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
        <BulkMedicineImport />
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <MedicineForm
              medicineForm={medicineForm}
              setMedicineForm={setMedicineForm}
              editingMedicineId={editingMedicineId}
              MEDICINE_CATEGORIES={MEDICINE_CATEGORIES}
              BASE_UNITS={BASE_UNITS}
              PACKAGING_TYPES={PACKAGING_TYPES}
              loading={loading}
              onSubmit={handleMedicineSubmit}
              onReset={() => { setMedicineForm(initialMedicineForm); setEditingMedicineId(null); }}
              handleFormChange={handleFormChange}
              handleImageUpload={handleImageUpload}
              handleRemoveImage={handleRemoveImage}
            />
          </Grid>
          <Grid item xs={12} md={7}>
            <MedicineList
              medicines={medicines}
              filteredMedicines={filteredMedicines}
              MEDICINE_CATEGORIES={MEDICINE_CATEGORIES}
              medicineCategoryTab={medicineCategoryTab}
              setMedicineCategoryTab={setMedicineCategoryTab}
              medicineSearchTerm={medicineSearchTerm}
              setMedicineSearchTerm={setMedicineSearchTerm}
              loading={loading}
              handleEditMedicine={handleEditMedicine}
              handleDeleteMedicine={handleDeleteMedicine}
              handleClearAlert={(id) => handleClearAlert(id, 'medicine')}
              isLowStock={isLowStock}
              isOutOfStock={isOutOfStock}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default MedicineManager;
