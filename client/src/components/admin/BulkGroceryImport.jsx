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
  Delete,
  Info,
  Download,
} from '@mui/icons-material';
import { groceryAPI } from '../../services/api';
import { fullGroceryList } from '../../data/groceriesData';

const BulkGroceryImport = ({ onImportComplete }) => {
  const [inputText, setInputText] = useState('');
  const [parsedGroceries, setParsedGroceries] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Example format for user reference
  const exampleFormat = `Milk Powder 500g | Kothmale - Full cream milk powder for cooking & drinks. | 1200.00 | g | 50 | 10
Chocolate Bar 50g | Cadbury - Popular milk chocolate bar. | 250.00 | g | 60 | 10`;

  const formatHelp = `Format: Name | Description | Price | Unit | Stock | MinStock

Fields:
- Name: Grocery item name (required)
- Description: Item description with brand info (optional)
- Price: Price in LKR (required, number)
- Unit: Unit of measurement - g, ml, piece, kg, liter, etc. (required)
- Stock: Current stock quantity (optional, default: 0)
- MinStock: Minimum stock for alert (optional, default: 10)

Separate each grocery item with a new line.`;

  const parseInput = () => {
    const lines = inputText.trim().split('\n').filter(line => line.trim());
    const groceries = [];
    const newErrors = [];

    lines.forEach((line, index) => {
      const parts = line.split('|').map(p => p.trim());
      
      if (parts.length < 4) {
        newErrors.push(`Line ${index + 1}: Insufficient fields. Need at least 4 fields (Name, Description, Price, Unit).`);
        return;
      }

      const [name, description = '', price, unit = 'item', stock = '0', minStock = '10'] = parts;

      if (!name) {
        newErrors.push(`Line ${index + 1}: Name is required`);
        return;
      }

      const priceNum = parseFloat(price);
      const stockNum = parseInt(stock) || 0;
      const minStockNum = parseInt(minStock) || 10;

      if (isNaN(priceNum) || priceNum < 0) {
        newErrors.push(`Line ${index + 1}: Invalid price. Must be a positive number.`);
        return;
      }

      groceries.push({
        name,
        description: description || '',
        price: priceNum,
        unit: unit || 'item',
        stock: stockNum,
        minStock: minStockNum,
      });
    });

    setParsedGroceries(groceries);
    setErrors(newErrors);

    if (newErrors.length === 0 && groceries.length > 0) {
      return true;
    }
    return false;
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
    setInputText(exampleFormat);
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
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5, md: 3 }, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Bulk Import Groceries
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Tooltip title="Load example format">
              <Button size="small" startIcon={<Info />} onClick={handleLoadExample}>
                Example
              </Button>
            </Tooltip>
            <Tooltip title="Load full grocery list (45 items)">
              <Button size="small" startIcon={<Download />} onClick={handleLoadFullList} color="primary">
                Load Groceries
              </Button>
            </Tooltip>
            <Button size="small" onClick={handleClear}>
              Clear
            </Button>
          </Stack>
        </Box>

        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2" component="div">
            <strong>Quick Format:</strong> Paste your grocery data below, one item per line.
            <br />
            <strong>Format:</strong> Name | Description | Price | Unit | Stock | MinStock
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
            disabled={parsedGroceries.length === 0 || errors.length > 0 || loading}
          >
            Import {parsedGroceries.length > 0 ? `(${parsedGroceries.length})` : ''}
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

      {parsedGroceries.length > 0 && (
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Preview ({parsedGroceries.length} items)
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Unit</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Stock</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parsedGroceries.map((grocery, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{grocery.name}</TableCell>
                    <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {grocery.description || '-'}
                    </TableCell>
                    <TableCell align="right">Rs. {grocery.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip label={grocery.unit} size="small" color="primary" />
                    </TableCell>
                    <TableCell align="right">{grocery.stock}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveGrocery(index)}
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

export default BulkGroceryImport;

