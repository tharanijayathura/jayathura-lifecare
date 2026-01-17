import React, { useState } from 'react';
import { Box } from '@mui/material';
import { medicineAPI } from '../../services/api';
import { fullMedicineList } from '../../data/medicinesData';
import MedicineImportForm from './bulk/medicine/MedicineImportForm';
import MedicinePreviewTable from './bulk/medicine/MedicinePreviewTable';
import ImportResultsDialog from './bulk/ImportResultsDialog';
import { parseMedicines } from './bulk/medicine/parser';
import { medicineExampleFormat, medicineFormatHelp } from './bulk/medicine/formatHelp';

const BulkMedicineImport = ({ onImportComplete }) => {
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
      alert('Please fix the errors before importing.');
      return;
    }

    setLoading(true);
    const results = {
      success: [],
      failed: [],
    };

    try {
      // Import medicines one by one
      for (const medicine of parsedMedicines) {
        try {
          await medicineAPI.create(medicine);
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
      alert('Failed to import medicines. Please try again.');
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

