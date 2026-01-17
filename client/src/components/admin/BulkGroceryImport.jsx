import React, { useState } from 'react';
import { Box } from '@mui/material';
import { groceryAPI } from '../../services/api';
import { fullGroceryList } from '../../data/groceriesData';
import GroceryImportForm from './bulk/grocery/GroceryImportForm';
import GroceryPreviewTable from './bulk/grocery/GroceryPreviewTable';
import ImportResultsDialog from './bulk/ImportResultsDialog';
import { parseGroceries } from './bulk/grocery/parser';
import { groceryExampleFormat, groceryFormatHelp } from './bulk/grocery/formatHelp';

const BulkGroceryImport = ({ onImportComplete }) => {
  const [inputText, setInputText] = useState('');
  const [parsedGroceries, setParsedGroceries] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const parseInput = () => {
    const { groceries, errors: newErrors } = parseGroceries(inputText);
    setParsedGroceries(groceries);
    setErrors(newErrors);
    return newErrors.length === 0 && groceries.length > 0;
  };

  const handleImport = async () => {
    if (parsedGroceries.length === 0) {
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
      // Import groceries one by one
      for (const grocery of parsedGroceries) {
        try {
          // Create FormData for consistency with API, but without image
          const formData = new FormData();
          formData.append('name', grocery.name);
          formData.append('description', grocery.description || '');
          formData.append('price', grocery.price.toString());
          formData.append('unit', grocery.unit);
          formData.append('stock', grocery.stock.toString());
          formData.append('minStock', grocery.minStock.toString());
          
          await groceryAPI.create(formData);
          results.success.push(grocery.name);
        } catch (error) {
          const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
          results.failed.push({ name: grocery.name, error: errorMsg });
        }
      }

      setImportResults(results);
      setShowResults(true);
      
      if (results.success.length > 0 && onImportComplete) {
        onImportComplete();
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import groceries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveGrocery = (index) => {
    const updated = parsedGroceries.filter((_, i) => i !== index);
    setParsedGroceries(updated);
  };

  const handleLoadExample = () => {
    setInputText(groceryExampleFormat);
  };

  const handleLoadFullList = () => {
    setInputText(fullGroceryList);
  };

  const handleClear = () => {
    setInputText('');
    setParsedGroceries([]);
    setErrors([]);
    setImportResults(null);
  };

  return (
    <Box>
      <GroceryImportForm
        inputText={inputText}
        setInputText={setInputText}
        formatHelp={groceryFormatHelp}
        onParse={parseInput}
        loading={loading}
        canImport={parsedGroceries.length > 0 && errors.length === 0}
        onImport={handleImport}
        onLoadExample={handleLoadExample}
        onLoadFullList={handleLoadFullList}
        onClear={handleClear}
        errors={errors}
      />

      <GroceryPreviewTable groceries={parsedGroceries} onRemove={handleRemoveGrocery} />

      <ImportResultsDialog
        open={showResults}
        results={importResults}
        onClose={() => { setShowResults(false); handleClear(); }}
      />
    </Box>
  );
};

export default BulkGroceryImport;

