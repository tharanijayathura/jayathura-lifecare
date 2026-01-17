import React from 'react';
import { Box, Paper, Typography, TextField, Button, Alert, Stack, Tooltip, CircularProgress } from '@mui/material';
import { Upload, Info, Download } from '@mui/icons-material';

const GroceryImportForm = ({
  title = 'Bulk Import Groceries',
  inputText,
  setInputText,
  formatHelp,
  onParse,
  loading,
  canImport,
  onImport,
  onLoadExample,
  onLoadFullList,
  onClear,
  errors,
}) => {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5, md: 3 }, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Tooltip title="Load example format">
            <Button size="small" startIcon={<Info />} onClick={onLoadExample}>
              Example
            </Button>
          </Tooltip>
          <Tooltip title="Load grocery list (sample)">
            <Button size="small" startIcon={<Download />} onClick={onLoadFullList} color="primary">
              Load Sample Groceries
            </Button>
          </Tooltip>
          <Button size="small" onClick={onClear}>Clear</Button>
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
        <Button variant="outlined" onClick={onParse} disabled={!inputText.trim()}>
          Parse & Preview
        </Button>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <Upload />}
          onClick={onImport}
          disabled={!canImport || loading}
        >
          Import
        </Button>
      </Stack>

      {errors?.length > 0 && (
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
  );
};

export default GroceryImportForm;
