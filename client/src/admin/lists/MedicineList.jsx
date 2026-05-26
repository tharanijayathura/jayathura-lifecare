import React from 'react';
import { Box, Paper, Grid, TextField, InputAdornment, IconButton, Chip, Tabs, Tab, Badge, Typography, Button, Card, CardContent, CardMedia, Stack, Alert } from '@mui/material';
import { Search, Clear, Edit, Delete } from '@mui/icons-material';
import ErrorIcon from '@mui/icons-material/Error';

const FREQUENTLY_USED_KEYWORDS = [
  'Paracetamol', 'Metformin', 'Amoxicillin', 'Atorvastatin', 'Omeprazole', 'Amlodipine', 'Losartan', 'Azithromycin', 'Cetirizine', 'Ibuprofen', 'Pantoprazole', 'Levothyroxine', 'Simvastatin', 'Ciprofloxacin', 'Doxycycline', 'Clopidogrel', 'Gliclazide', 'Enalapril', 'Hydrochlorothiazide', 'Salbutamol', 'Ranitidine'
];

const MedicineList = ({
  medicines,
  filteredMedicines,
  MEDICINE_CATEGORIES,
  medicineCategoryTab,
  setMedicineCategoryTab,
  medicineSearchTerm,
  setMedicineSearchTerm,
  loading,
  handleEditMedicine,
  handleDeleteMedicine,
  handleClearAlert,
  isLowStock,
  isOutOfStock,
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        {/* CircularProgress in parent to avoid extra import */}
      </Box>
    );
  }

  const totalMedicines = medicines.length;
  const totalAlerts = medicines.filter(m => m.stockAlert?.isAlerted || isOutOfStock(m)).length;

  const getFilteredMedicines = () => {
    if (medicineCategoryTab === 0) return filteredMedicines;
    if (medicineCategoryTab === MEDICINE_CATEGORIES.length + 1) {
      return medicines.filter((med) => FREQUENTLY_USED_KEYWORDS.some((kw) => med.name && med.name.toLowerCase().includes(kw.toLowerCase())));
    }
    const selectedCategory = MEDICINE_CATEGORIES[medicineCategoryTab - 1]?.value;
    return medicines.filter((med) => med.category === selectedCategory && (!medicineSearchTerm || (med.name && med.name.toLowerCase().includes(medicineSearchTerm.toLowerCase()))));
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search medicines by name, brand, or description..."
              value={medicineSearchTerm}
              onChange={(e) => setMedicineSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
                endAdornment: medicineSearchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setMedicineSearchTerm('')}>
                      <Clear fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              {medicineSearchTerm && (
                <Chip label={`Search: "${medicineSearchTerm}"`} onDelete={() => setMedicineSearchTerm('')} color="secondary" variant="outlined" size="small" />
              )}
              {totalAlerts > 0 && (
                <Chip label={`${totalAlerts} Alerts`} color="error" size="small" />
              )}
              <Chip label={`Total: ${totalMedicines}`} color="primary" variant="outlined" size="small" />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <Tabs
          value={medicineCategoryTab}
          onChange={(e, newValue) => setMedicineCategoryTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', '& .MuiTab-root': { fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' }, minWidth: { xs: 80, sm: 100, md: 120 }, px: { xs: 1, sm: 1.5, md: 2 }, textTransform: 'none' } }}
        >
          <Tab label={<Badge badgeContent={totalAlerts > 0 ? totalAlerts : null} color="error">All Medicines</Badge>} />
          {MEDICINE_CATEGORIES.map((cat) => {
            const categoryMedicines = medicines.filter((m) => m.category === cat.value);
            const alertCount = categoryMedicines.filter((m) => m.stockAlert?.isAlerted || isOutOfStock(m)).length;
            return (
              <Tab key={cat.value} label={<Badge badgeContent={alertCount > 0 ? alertCount : null} color="error">{cat.label}</Badge>} />
            );
          })}
          <Tab label={<Badge color="success">Frequently Used</Badge>} />
        </Tabs>
      </Box>

      {filteredMedicines.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            Showing <strong>{getFilteredMedicines().length}</strong> of <strong>{totalMedicines}</strong> medicines
          </Typography>
          {medicineSearchTerm && (
            <Button size="small" onClick={() => setMedicineSearchTerm('')} startIcon={<Clear />}>Clear Search</Button>
          )}
        </Box>
      )}

      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
        {getFilteredMedicines().length === 0 ? (
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
              <Search sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No medicines found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                Try adjusting your search or selecting a different category
              </Typography>
              {medicineSearchTerm && (
                <Button variant="outlined" onClick={() => setMedicineSearchTerm('')} startIcon={<Clear />}>Clear Search</Button>
              )}
            </Paper>
          </Grid>
        ) : (
          getFilteredMedicines().map((medicine) => {
            const hasAlert = medicine.stockAlert?.isAlerted || isOutOfStock(medicine);
            const isLow = isLowStock(medicine);
            return (
              <Grid item xs={12} sm={6} md={4} key={medicine._id}>
                <Card sx={{ border: hasAlert ? '2px solid red' : isLow ? '2px solid orange' : '1px solid', borderColor: hasAlert ? 'error.main' : isLow ? 'warning.main' : 'divider', position: 'relative' }}>
                  {hasAlert && (
                    <Box sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'error.main', color: 'white', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                      <ErrorIcon sx={{ fontSize: 16 }} />
                    </Box>
                  )}
                  {medicine.image && (
                    <CardMedia component="img" height="150" image={medicine.image} alt={medicine.name} sx={{ objectFit: 'cover' }} />
                  )}
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="h6">{medicine.name}</Typography>
                      <Chip label={MEDICINE_CATEGORIES.find((c) => c.value === medicine.category)?.label || medicine.category} size="small" color="primary" />
                    </Stack>
                    {medicine.brand && (
                      <Typography variant="body2" color="text.secondary">Brand: {medicine.brand}</Typography>
                    )}
                    <Typography variant="body2" sx={{ my: 1 }}>{medicine.description}</Typography>
                    <Box sx={{ my: 1 }}>
                      <Typography variant="subtitle1" color="primary">Rs. {medicine.price?.perPack || medicine.price} per pack</Typography>
                      {medicine.price?.perUnit && (
                        <Typography variant="caption" color="text.secondary">(Rs. {medicine.price.perUnit.toFixed(2)} per {medicine.baseUnit})</Typography>
                      )}
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" gap={1}>
                      <Chip label={`${medicine.stock?.packs || 0} packs`} size="small" color={isOutOfStock(medicine) ? 'error' : isLow ? 'warning' : 'default'} />
                      <Chip label={`${medicine.stock?.units || 0} ${medicine.baseUnit}s`} size="small" variant="outlined" />
                      <Chip label={`Min: ${medicine.minStockUnits || 0}`} size="small" variant="outlined" color="secondary" />
                    </Stack>
                    {medicine.stockAlert?.isAlerted && (
                      <Alert severity="error" sx={{ mt: 1 }}>
                        <Typography variant="caption">
                          Alerted by: {medicine.stockAlert.alertedBy?.name || 'Pharmacist'}
                          <br />
                          Reason: {medicine.stockAlert.alertReason}
                        </Typography>
                      </Alert>
                    )}
                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Button size="small" startIcon={<Edit />} onClick={() => handleEditMedicine(medicine)}>Edit</Button>
                      {hasAlert && (
                        <Button size="small" color="success" startIcon={<Clear />} onClick={() => handleClearAlert(medicine._id, 'medicine')}>Clear Alert</Button>
                      )}
                      <IconButton color="error" size="small" onClick={() => handleDeleteMedicine(medicine._id)}>
                        <Delete />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>
    </Box>
  );
};

export default MedicineList;
