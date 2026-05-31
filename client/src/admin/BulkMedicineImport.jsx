import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useNotification } from '../contexts/NotificationContext';
import { medicineAPI } from '../services/api';
import { fullMedicineList } from '../data/medicinesData';
import MedicineImportForm from './bulk/medicine/MedicineImportForm';
import MedicinePreviewTable from './bulk/medicine/MedicinePreviewTable';
import ImportResultsDialog from './bulk/ImportResultsDialog';
import { parseMedicines } from './bulk/medicine/parser';
import { medicineExampleFormat, medicineFormatHelp } from './bulk/medicine/formatHelp';

const BulkMedicineImport = ({ onImportComplete }) => {
  const { showNotification } = useNotification();
  const [inputText, setInputText] = useState('');
  const [parsedMedicines, setParsedMedicines] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const parseInput = () => {
    const { medicines, errors: newErrors } = parseMedicines(inputText);
    setParsedMedicines(medicines);
    setErrors(newErrors);
    return newErrors.length === 0 && medicines.length > 0;
  };

  const handleImport = async () => {
    if (parsedMedicines.length === 0) {
      if (!parseInput()) {
        return;
      }
    }

    if (errors.length > 0) {
      showNotification('Please fix the errors before importing.', { type: 'warning' });
      return;
    }

    setLoading(true);
    const results = {
      success: [],
      failed: [],
    };

    try {
      for (const medicine of parsedMedicines) {
        try {
          const formData = new FormData();
          formData.append('name', medicine.name);
          if (medicine.brand) formData.append('brand', medicine.brand);
          formData.append('category', medicine.category);
          if (medicine.description) formData.append('description', medicine.description);
          formData.append('baseUnit', medicine.baseUnit);
          formData.append('requiresPrescription', medicine.requiresPrescription);
          formData.append('packagingType', medicine.packaging.type);
          formData.append('packagingQtyPerPack', medicine.packaging.qtyPerPack.toString());
          if (medicine.packaging.packName) formData.append('packagingPackName', medicine.packaging.packName);
          formData.append('pricePerPack', medicine.price.perPack.toString());
          formData.append('stockPacks', (medicine.stock.packs || 0).toString());
          formData.append('minStockUnits', medicine.minStockUnits.toString());
          if (medicine.imageUrl) formData.append('image', medicine.imageUrl);

          await medicineAPI.create(formData);
          results.success.push(medicine.name);
        } catch (error) {
          const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
          results.failed.push({ name: medicine.name, error: errorMsg });
        }
      }

      setImportResults(results);
      setShowResults(true);
      
      if (results.success.length > 0 && onImportComplete) {
        onImportComplete();
      }
    } catch (error) {
      console.error('Import error:', error);
      showNotification('Failed to import medicines. Please try again.', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMedicine = (index) => {
    const updated = parsedMedicines.filter((_, i) => i !== index);
    setParsedMedicines(updated);
  };

  const handleLoadExample = () => {
    setInputText(medicineExampleFormat);
  };

  const handleLoadFullList = () => {
    setInputText(fullMedicineList);
  };

  const handleClear = () => {
    setInputText('');
    setParsedMedicines([]);
    setErrors([]);
    setImportResults(null);
  };

  return (
    <Box>
      <MedicineImportForm
        inputText={inputText}
        setInputText={setInputText}
        formatHelp={medicineFormatHelp}
        onParse={parseInput}
        loading={loading}
        canImport={parsedMedicines.length > 0 && errors.length === 0}
        onImport={handleImport}
        onLoadExample={handleLoadExample}
        onLoadFullList={handleLoadFullList}
        onClear={handleClear}
        errors={errors}
      />

      <MedicinePreviewTable medicines={parsedMedicines} onRemove={handleRemoveMedicine} />

      <ImportResultsDialog
        open={showResults}
        results={importResults}
        onClose={() => { setShowResults(false); handleClear(); }}
      />
    </Box>
  );
};

export default BulkMedicineImport;
