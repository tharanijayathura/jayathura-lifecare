import React, { useMemo, useState, useEffect } from 'react';
import { Typography, Box, Alert, CircularProgress } from '@mui/material';
import { patientAPI } from '../../services/api';
import CatalogFilters from './catalog/CatalogFilters';
import MedicineGrid from './catalog/MedicineGrid';

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All categories' },
  { value: 'otc', label: 'Non Prescription Items' },
  { value: 'herbal', label: 'Herbal & Ayurvedic' },
  { value: 'vitamins', label: 'Vitamins & Supplements' },
  { value: 'medical-devices', label: 'Medical Devices & Equipment' },
  { value: 'personal-care', label: 'Personal Care & Hygiene' },
  { value: 'groceries', label: 'Groceries & Snacks' },
  { value: 'baby-care', label: 'Baby & Infant Care' },
  { value: 'first-aid', label: 'First Aid & Emergency' },
  { value: 'seasonal', label: 'Seasonal & Special' },
  { value: 'dermatology', label: 'Dermatology & Skin Care' },
  { value: 'eye-ear-care', label: 'Eye & Ear Care' },
  { value: 'womens-health', label: "Women's Health" },
  { value: 'mens-health', label: "Men's Health" },
  { value: 'dental-care', label: 'Dental Care' },
  { value: 'home-healthcare', label: 'Home Healthcare' },
  { value: 'fitness-weight', label: 'Fitness & Weight Management' },
  { value: 'cold-chain', label: 'Cold Chain' },
  { value: 'pet-health', label: 'Pet Health' },
];


const MedicineCatalog = ({ onAddToCart }) => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    brand: 'all',
    priceMin: '',
    priceMax: '',
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.browseOTC();
      const medicinesData = response.data || [];
      
      
      const seenIds = new Map();
      const seenNames = new Map(); // Also check by name+brand as fallback
      const uniqueMedicines = medicinesData.filter(medicine => {
        const medicineId = medicine._id?.toString() || medicine.id?.toString();
        const nameKey = `${medicine.name || ''}_${medicine.brand || ''}`.toLowerCase();
        
        // Check by ID first
        if (medicineId && seenIds.has(medicineId)) {
          
          return false;
        }
        
        // Also check by name+brand combination (in case IDs are different but same medicine)
        if (nameKey && seenNames.has(nameKey)) {
          
          return false;
        }
        
        if (medicineId) seenIds.set(medicineId, true);
        if (nameKey) seenNames.set(nameKey, true);
        return true;
      });
      
      
      setMedicines(uniqueMedicines);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const brandOptions = useMemo(() => {
    const brands = new Set(
      medicines
        .filter((medicine) => !medicine.requiresPrescription)
        .map((medicine) => medicine.brand)
        .filter(Boolean),
    );
    return ['all', ...Array.from(brands)];
  }, [medicines]);

  const filteredMedicines = useMemo(() => {
    
    const seenIds = new Map();
    const seenNames = new Map();
    const uniqueMedicines = medicines.filter(medicine => {
      const medicineId = medicine._id?.toString() || medicine.id?.toString();
      const nameKey = `${medicine.name || ''}_${medicine.brand || ''}`.toLowerCase();
      
      
      if (medicineId && seenIds.has(medicineId)) {
        return false;
      }
      
      
      if (nameKey && seenNames.has(nameKey)) {
        return false;
      }
      
      if (medicineId) seenIds.set(medicineId, true);
      if (nameKey) seenNames.set(nameKey, true);
      return true;
    });
    
    
    return uniqueMedicines
      .filter(
        (medicine) =>
          medicine.stock > 0 &&
          (filters.category === 'all' || medicine.category === filters.category) &&
          (filters.brand === 'all' || medicine.brand === filters.brand) &&
          (filters.priceMin === '' || medicine.price >= Number(filters.priceMin)) &&
          (filters.priceMax === '' || medicine.price <= Number(filters.priceMax)),
      );
  }, [medicines, filters]);

  
  useEffect(() => {
    if (!searchTerm) {
      
      fetchMedicines();
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await patientAPI.searchMedicines(searchTerm);
        const medicinesData = response.data || [];
        
        
        const seenIds = new Map();
        const seenNames = new Map();
        const uniqueMedicines = medicinesData.filter(medicine => {
          const medicineId = medicine._id?.toString() || medicine.id?.toString();
          const nameKey = `${medicine.name || ''}_${medicine.brand || ''}`.toLowerCase();
          
          if (medicineId && seenIds.has(medicineId)) return false;
          if (nameKey && seenNames.has(nameKey)) return false;
          
          if (medicineId) seenIds.set(medicineId, true);
          if (nameKey) seenNames.set(nameKey, true);
          return true;
        });
        
        
        setMedicines(uniqueMedicines);
      } catch (error) {
        console.error('Error searching medicines:', error);
        setMedicines([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleAddToCart = (medicine) => {
    
    const medicineId = medicine._id?.toString() || medicine.id?.toString();
    onAddToCart({
      itemId: medicineId,
      name: medicine.name,
      quantity: 1,
      price: medicine.price,
      unit: medicine.unit || medicine.doseUnit || 'dose',
      itemType: 'medicine',
      image: medicine.image,
    });
  };

  if (loading && medicines.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Medicine Catalog
      </Typography>
      <Alert
        severity="info"
        sx={{ mb: 3, bgcolor: 'success.50', color: 'success.dark' }}
      >
        Browse all non-prescription items such as Panadol, Siddhalepa, ENO, Vicks, vitamins, baby products,
        and medical supplies like cotton wool, masks, and bandages. Prescription medicines are not shown here.
        Use filters to sort by category, price, or brand, and add items directly to your cart without a prescription.
      </Alert>

      <CatalogFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        CATEGORY_OPTIONS={CATEGORY_OPTIONS}
        brandOptions={brandOptions}
      />

      <MedicineGrid filteredMedicines={filteredMedicines} onAddToCart={handleAddToCart} searchTerm={searchTerm} loading={loading} />

      {/* Empty state handled in MedicineGrid */}

      {loading && filteredMedicines.length === 0 && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default MedicineCatalog;