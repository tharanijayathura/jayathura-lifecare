import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Upload,
  CheckCircle,
  Error as ErrorIcon,
  Delete,
  Info,
  Download,
} from '@mui/icons-material';
import { medicineAPI } from '../../services/api';
import { fullMedicineList } from '../../data/medicinesData';

const BulkMedicineImport = ({ onImportComplete }) => {
  const [inputText, setInputText] = useState('');
  const [parsedMedicines, setParsedMedicines] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Example format for user reference
  const exampleFormat = `Azithromycin 500mg | Zithrocin | prescription | tablet | blister | 3 | 760.00 | 25 | 10 | true | Strong antibiotic for respiratory infections.
Cefixime 200mg | Suprax | prescription | tablet | blister | 10 | 1450.00 | 15 | 20 | true | Treats UTIs and respiratory infections.`;

  const formatHelp = `Format: Name | Brand | Category | BaseUnit | Packaging | QtyPerPack | Price | StockPacks | MinStock | RequiresPrescription | Description

Fields:
- Name: Medicine/Product name (required)
- Brand: Brand name (optional)
- Category: prescription, otc, herbal, medical-devices, personal-care, groceries, baby-care, first-aid, vitamins, seasonal, dermatology, eye-ear-care, womens-health, mens-health, dental-care, home-healthcare, fitness-weight, cold-chain, pet-health (required)
- BaseUnit: tablet, capsule, ml, gram, piece (required)
- Packaging: blister, bottle, tube, box, unit, card, sachet (required)
- QtyPerPack: Quantity per pack (required, number)
- Price: Price per pack in LKR (required, number)
- StockPacks: Number of packs in stock (optional, default: 0)
- MinStock: Minimum stock units for alert (optional, default: 10)
- RequiresPrescription: true or false (optional, default: false)
- Description: Product description (optional)

Separate each item with a new line.`;

  const parseInput = () => {
    const lines = inputText.trim().split('\n').filter(line => line.trim());
    const medicines = [];
    const newErrors = [];

    lines.forEach((line, index) => {
      const parts = line.split('|').map(p => p.trim());
      
      if (parts.length < 7) {
        newErrors.push(`Line ${index + 1}: Insufficient fields. Need at least 7 fields.`);
        return;
      }

      const [name, brand, category, baseUnit, packaging, qtyPerPack, price, stockPacks = '0', minStock = '10', requiresPrescription = 'false', ...descriptionParts] = parts;
      const description = descriptionParts.join('|').trim();

      // Validation
      const validCategories = [
        'prescription', 'otc', 'herbal', 'medical-devices', 'personal-care',
        'groceries', 'baby-care', 'first-aid', 'vitamins', 'seasonal',
        'dermatology', 'eye-ear-care', 'womens-health', 'mens-health',
        'dental-care', 'home-healthcare', 'fitness-weight', 'cold-chain', 'pet-health'
      ];
      const validBaseUnits = ['tablet', 'capsule', 'ml', 'gram', 'piece'];
      const validPackaging = ['blister', 'bottle', 'tube', 'box', 'unit', 'card', 'sachet'];

      if (!name) {
        newErrors.push(`Line ${index + 1}: Name is required`);
        return;
      }

      if (!validCategories.includes(category.toLowerCase())) {
        newErrors.push(`Line ${index + 1}: Invalid category. Must be one of: ${validCategories.join(', ')}`);
        return;
      }

      if (!validBaseUnits.includes(baseUnit.toLowerCase())) {
        newErrors.push(`Line ${index + 1}: Invalid base unit. Must be one of: ${validBaseUnits.join(', ')}`);
        return;
      }

      if (!validPackaging.includes(packaging.toLowerCase())) {
        newErrors.push(`Line ${index + 1}: Invalid packaging. Must be one of: ${validPackaging.join(', ')}`);
        return;
      }

      const qty = parseInt(qtyPerPack);
      const priceNum = parseFloat(price);
      const stock = parseInt(stockPacks) || 0;
      const minStockNum = parseInt(minStock) || 10;
      const requiresPresc = requiresPrescription.toLowerCase() === 'true';

      if (isNaN(qty) || qty < 1) {
        newErrors.push(`Line ${index + 1}: Invalid quantity per pack. Must be a positive number.`);
        return;
      }

      if (isNaN(priceNum) || priceNum < 0) {
        newErrors.push(`Line ${index + 1}: Invalid price. Must be a positive number.`);
        return;
      }

      medicines.push({
        name,
        brand: brand || '',
        category: category.toLowerCase(),
        baseUnit: baseUnit.toLowerCase(),
        packaging: {
          type: packaging.toLowerCase(),
          qtyPerPack: qty,
        },
        price: {
          perPack: priceNum,
        },
        stock: {
          packs: stock,
        },
        minStockUnits: minStockNum,
        requiresPrescription: requiresPresc,
        description: description || '',
      });
    });

    setParsedMedicines(medicines);
    setErrors(newErrors);

    if (newErrors.length === 0 && medicines.length > 0) {
      return true;
    }
    return false;
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
    setInputText(exampleFormat);
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
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5, md: 3 }, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Bulk Import Medicines
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Tooltip title="Load example format">
              <Button size="small" startIcon={<Info />} onClick={handleLoadExample}>
                Example
              </Button>
            </Tooltip>
            <Tooltip title="Load prescription medicines list (50 items)">
              <Button size="small" startIcon={<Download />} onClick={handleLoadFullList} color="primary">
                Load Prescription Medicines
              </Button>
            </Tooltip>
            <Button size="small" onClick={handleClear}>
              Clear
            </Button>
          </Stack>
        </Box>

        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2" component="div">
            <strong>Quick Format:</strong> Paste your medicine data below, one medicine per line.
            <br />
            <strong>Format:</strong> Name | Brand | Category | BaseUnit | Packaging | QtyPerPack | Price | StockPacks | MinStock | RequiresPrescription | Description
          </Typography>
        </Alert>

        <TextField
          fullWidth
          multiline
          rows={10}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={formatHelp}
          sx={{ mb: 2 }}
        />

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={parseInput}
            disabled={!inputText.trim()}
          >
            Parse & Preview
          </Button>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <Upload />}
            onClick={handleImport}
            disabled={parsedMedicines.length === 0 || errors.length > 0 || loading}
          >
            Import {parsedMedicines.length > 0 ? `(${parsedMedicines.length})` : ''}
          </Button>
        </Stack>

        {errors.length > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Errors found ({errors.length}):
            </Typography>
            {errors.map((error, index) => (
              <Typography key={index} variant="body2" component="div">
                • {error}
              </Typography>
            ))}
          </Alert>
        )}
      </Paper>

      {parsedMedicines.length > 0 && (
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Preview ({parsedMedicines.length} medicines)
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Brand</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Packaging</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Price</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Stock</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parsedMedicines.map((medicine, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{medicine.name}</TableCell>
                    <TableCell>{medicine.brand || '-'}</TableCell>
                    <TableCell>
                      <Chip label={medicine.category} size="small" color="primary" />
                    </TableCell>
                    <TableCell>
                      {medicine.packaging.qtyPerPack} {medicine.baseUnit}s per {medicine.packaging.type}
                    </TableCell>
                    <TableCell align="right">Rs. {medicine.price.perPack.toFixed(2)}</TableCell>
                    <TableCell align="right">{medicine.stock.packs} packs</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveMedicine(index)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Import Results Dialog */}
      <Dialog open={showResults} onClose={() => setShowResults(false)} maxWidth="md" fullWidth>
        <DialogTitle>Import Results</DialogTitle>
        <DialogContent>
          {importResults && (
            <Box>
              {importResults.success.length > 0 && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Successfully imported ({importResults.success.length}):
                  </Typography>
                  {importResults.success.map((name, index) => (
                    <Typography key={index} variant="body2" component="div">
                      ✓ {name}
                    </Typography>
                  ))}
                </Alert>
              )}
              {importResults.failed.length > 0 && (
                <Alert severity="error">
                  <Typography variant="subtitle2" gutterBottom>
                    Failed to import ({importResults.failed.length}):
                  </Typography>
                  {importResults.failed.map((item, index) => (
                    <Typography key={index} variant="body2" component="div">
                      ✗ {item.name}: {item.error}
                    </Typography>
                  ))}
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowResults(false);
            handleClear();
          }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BulkMedicineImport;

