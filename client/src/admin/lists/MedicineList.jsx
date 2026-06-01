import React from 'react';
import { getPublicFileUrl } from '../../services/api';
import { 
  Box, 
  Paper, 
  Grid, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Chip, 
  Tabs, 
  Tab, 
  Badge, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Stack, 
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  LinearProgress,
  ToggleButtonGroup,
  ToggleButton,
  Divider
} from '@mui/material';
import { 
  Search, 
  Clear, 
  Edit, 
  Delete, 
  ViewList, 
  ViewModule, 
  LocalPharmacy, 
  Sort 
} from '@mui/icons-material';
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
  const [viewLayout, setViewLayout] = React.useState('table'); // 'table' or 'grid'
  const [sortBy, setSortBy] = React.useState('name_asc');

  const COLORS = {
    primary: '#2C3E50',
    secondary: '#546E7A',
    teal: '#7AA8B0',
    lightGreen: '#ECF4E8',
    alertGreen: '#ABE7B2',
    accentBlue: '#93BFC7',
    border: 'rgba(147, 191, 199, 0.35)',
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        {/* Spinner in parent handles this; return empty or soft container */}
      </Box>
    );
  }

  const totalMedicines = medicines.length;
  const totalAlerts = medicines.filter(m => m.stockAlert?.isAlerted || isOutOfStock(m)).length;

  const getFilteredMedicines = () => {
    if (medicineCategoryTab === 0) return filteredMedicines;
    if (medicineCategoryTab === MEDICINE_CATEGORIES.length + 1) {
      return medicines.filter((med) => 
        FREQUENTLY_USED_KEYWORDS.some((kw) => 
          med.name && med.name.toLowerCase().includes(kw.toLowerCase())
        )
      );
    }
    const selectedCategory = MEDICINE_CATEGORIES[medicineCategoryTab - 1]?.value;
    return medicines.filter((med) => 
      med.category === selectedCategory && 
      (!medicineSearchTerm || (med.name && med.name.toLowerCase().includes(medicineSearchTerm.toLowerCase())))
    );
  };

  const getSortedMedicines = (items) => {
    return [...items].sort((a, b) => {
      if (sortBy === 'name_asc') {
        return (a.name || '').localeCompare(b.name || '');
      }
      if (sortBy === 'name_desc') {
        return (b.name || '').localeCompare(a.name || '');
      }
      if (sortBy === 'price_asc') {
        const pA = parseFloat(a.price?.perPack || a.price || 0);
        const pB = parseFloat(b.price?.perPack || b.price || 0);
        return pA - pB;
      }
      if (sortBy === 'price_desc') {
        const pA = parseFloat(a.price?.perPack || a.price || 0);
        const pB = parseFloat(b.price?.perPack || b.price || 0);
        return pB - pA;
      }
      if (sortBy === 'stock_asc') {
        const sA = parseInt(a.stock?.packs || 0);
        const sB = parseInt(b.stock?.packs || 0);
        return sA - sB;
      }
      if (sortBy === 'stock_desc') {
        const sA = parseInt(a.stock?.packs || 0);
        const sB = parseInt(b.stock?.packs || 0);
        return sB - sA;
      }
      if (sortBy === 'alert_first') {
        const alertA = a.stockAlert?.isAlerted || isOutOfStock(a) ? 1 : 0;
        const alertB = b.stockAlert?.isAlerted || isOutOfStock(b) ? 1 : 0;
        return alertB - alertA;
      }
      return 0;
    });
  };

  const itemsToDisplay = getSortedMedicines(getFilteredMedicines());

  return (
    <Box>
      {/* Visual Search, Sort, & Switcher Header */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: 3, 
          border: `1px solid ${COLORS.border}`,
          boxShadow: '0 4px 20px rgba(44, 62, 80, 0.03)'
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Search medicines by name, brand..."
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

          {/* Sort Select */}
          <Grid item xs={12} sm={8} md={5}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.secondary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Sort fontSize="small" /> SORT:
              </Typography>
              <FormControl size="small" fullWidth>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{ borderRadius: 2, fontSize: '0.8rem', height: 38 }}
                >
                  <MenuItem value="name_asc">Name (A - Z)</MenuItem>
                  <MenuItem value="price_asc">Price: Low to High</MenuItem>
                  <MenuItem value="price_desc">Price: High to Low</MenuItem>
                  <MenuItem value="stock_asc">Stock: Low to High</MenuItem>
                  <MenuItem value="stock_desc">Stock: High to Low</MenuItem>
                  <MenuItem value="alert_first">Alerted Items First</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Grid>

          {/* View Toggle */}
          <Grid item xs={12} sm={4} md={2} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
            <ToggleButtonGroup
              value={viewLayout}
              exclusive
              onChange={(e, newLayout) => {
                if (newLayout !== null) {
                  setViewLayout(newLayout);
                }
              }}
              size="small"
              sx={{
                backgroundColor: '#ffffff',
                border: `1px solid ${COLORS.border}`,
                borderRadius: 2,
                overflow: 'hidden',
                height: 38,
                '& .MuiToggleButton-root': {
                  border: 'none',
                  px: 1.5,
                  borderRadius: 0,
                  color: COLORS.secondary,
                  '&.Mui-selected': {
                    color: COLORS.primary,
                    backgroundColor: COLORS.lightGreen,
                    '&:hover': {
                      backgroundColor: COLORS.lightGreen,
                    }
                  }
                }
              }}
            >
              <ToggleButton value="table" aria-label="table view">
                <ViewList fontSize="small" />
              </ToggleButton>
              <ToggleButton value="grid" aria-label="grid view">
                <ViewModule fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Paper>

      {/* Category Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={medicineCategoryTab}
          onChange={(e, newValue) => setMedicineCategoryTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider', 
            '& .MuiTab-root': { 
              fontSize: '0.8rem', 
              minWidth: 100, 
              textTransform: 'none',
              fontWeight: 600,
              pb: 1.5
            },
            '& .MuiTabs-indicator': {
              backgroundColor: COLORS.teal,
              height: 2.5
            }
          }}
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

      {/* Display Count and Filters */}
      {filteredMedicines.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            Showing <strong>{itemsToDisplay.length}</strong> of <strong>{totalMedicines}</strong> medicines
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {totalAlerts > 0 && <Chip label={`${totalAlerts} active alerts`} color="error" size="small" sx={{ fontWeight: 700 }} />}
            {medicineSearchTerm && <Button size="small" variant="text" onClick={() => setMedicineSearchTerm('')} startIcon={<Clear />}>Clear Search</Button>}
          </Box>
        </Box>
      )}

      {/* RENDER DUAL VIEWS */}
      {itemsToDisplay.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 3, borderStyle: 'dashed', borderColor: COLORS.border }}>
          <Search sx={{ fontSize: 48, color: 'text.disabled', mb: 1.5 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }} color="text.secondary" gutterBottom>
            No Medicines Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search filters or selected category
          </Typography>
        </Paper>
      ) : viewLayout === 'table' ? (
        /* TABLE LAYOUT */
        <TableContainer 
          component={Paper} 
          elevation={0}
          sx={{ 
            borderRadius: 3, 
            border: `1px solid ${COLORS.border}`, 
            overflowX: 'auto',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              height: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#c1c1c1',
              borderRadius: '3px',
              '&:hover': {
                background: '#a8a8a8',
              },
            },
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: '#fcfcfc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: COLORS.primary }}>Medication</TableCell>
                <TableCell sx={{ fontWeight: 700, color: COLORS.primary }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700, color: COLORS.primary }}>Pricing</TableCell>
                <TableCell sx={{ fontWeight: 700, color: COLORS.primary }}>Stock Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: COLORS.primary }}>Alerts</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: COLORS.primary }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {itemsToDisplay.map((medicine) => {
                const hasAlert = medicine.stockAlert?.isAlerted || isOutOfStock(medicine);
                const isLow = isLowStock(medicine);
                const stockPacks = parseInt(medicine.stock?.packs || 0);
                const totalUnits = parseInt(medicine.stock?.units || 0);
                const alertMsg = medicine.stockAlert?.alertReason;
                const alertUser = medicine.stockAlert?.alertedBy?.name || 'Staff';

                let stockColor = 'success';
                let stockLabel = 'In Stock';
                let progressVal = 100;

                if (stockPacks === 0) {
                  stockColor = 'error';
                  stockLabel = 'Out of Stock';
                  progressVal = 0;
                } else if (isLow) {
                  stockColor = 'warning';
                  stockLabel = 'Low Stock';
                  progressVal = 35;
                } else {
                  progressVal = Math.min(100, (stockPacks / 60) * 100);
                }

                return (
                  <TableRow 
                    key={medicine._id}
                    hover
                    sx={{ 
                      backgroundColor: hasAlert ? 'rgba(211, 47, 47, 0.02)' : isLow ? 'rgba(237, 108, 2, 0.02)' : 'inherit',
                      '&:hover': {
                        backgroundColor: hasAlert ? 'rgba(211, 47, 47, 0.05) !important' : isLow ? 'rgba(237, 108, 2, 0.05) !important' : 'inherit'
                      }
                    }}
                  >
                    {/* Medication info */}
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ 
                          width: 42, 
                          height: 42, 
                          borderRadius: 2, 
                          overflow: 'hidden', 
                          border: `1px solid ${COLORS.border}`,
                          flexShrink: 0,
                          bgcolor: '#f5f5f5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {medicine.image ? (
                            <Box component="img" src={getPublicFileUrl(medicine.image)} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <LocalPharmacy sx={{ color: '#b0bec5', fontSize: 20 }} />
                          )}
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: COLORS.primary }}>
                            {medicine.name}
                          </Typography>
                          {medicine.brand && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              Brand: {medicine.brand}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </TableCell>

                    {/* Classification */}
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip 
                          label={MEDICINE_CATEGORIES.find(c => c.value === medicine.category)?.label || medicine.category} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            height: 22, 
                            fontSize: '0.7rem', 
                            fontWeight: 600,
                            borderColor: COLORS.teal,
                            color: COLORS.primary
                          }}
                        />
                        {medicine.requiresPrescription && (
                          <Chip 
                            label="Rx Only" 
                            size="small" 
                            color="warning" 
                            sx={{ 
                              height: 22, 
                              fontSize: '0.65rem', 
                              fontWeight: 700, 
                              textTransform: 'uppercase',
                              backgroundColor: '#FFF3E0',
                              color: '#E65100',
                              border: '1px solid #FFE0B2'
                            }} 
                          />
                        )}
                      </Stack>
                    </TableCell>

                    {/* Pricing */}
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: COLORS.primary }}>
                        Rs. {parseFloat(medicine.price?.perPack || medicine.price || 0).toFixed(2)}
                      </Typography>
                      {medicine.price?.perUnit && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          Rs. {parseFloat(medicine.price.perUnit).toFixed(2)} / {medicine.baseUnit}
                        </Typography>
                      )}
                    </TableCell>

                    {/* Stock Status Bar */}
                    <TableCell sx={{ minWidth: 160 }}>
                      <Stack spacing={0.5}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Chip 
                            label={stockLabel} 
                            size="small" 
                            color={stockColor} 
                            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                          />
                          <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.primary }}>
                            {stockPacks} pack{stockPacks !== 1 ? 's' : ''}
                          </Typography>
                        </Stack>
                        <LinearProgress 
                          variant="determinate" 
                          value={progressVal} 
                          color={stockColor} 
                          sx={{ height: 5, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.04)' }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                          Total: {totalUnits} {medicine.baseUnit}s (Min Alert: {medicine.minStockUnits})
                        </Typography>
                      </Stack>
                    </TableCell>

                    {/* Active Alert Columns */}
                    <TableCell>
                      {medicine.stockAlert?.isAlerted ? (
                        <Tooltip title={`Reason: "${alertMsg}" (Flagged by ${alertUser})`}>
                          <Chip 
                            icon={<ErrorIcon sx={{ fontSize: '13px !important', color: '#c62828 !important' }} />}
                            label="Active Alert" 
                            size="small" 
                            sx={{ 
                              height: 22, 
                              fontSize: '0.65rem', 
                              fontWeight: 700, 
                              backgroundColor: '#FFEBEE',
                              color: '#C62828',
                              border: '1px solid #FFCDD2',
                              cursor: 'help'
                            }}
                          />
                        </Tooltip>
                      ) : (
                        <Typography variant="caption" color="text.disabled">—</Typography>
                      )}
                    </TableCell>

                    {/* Inline Row Actions */}
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {medicine.stockAlert?.isAlerted && (
                          <Tooltip title="Clear Alert">
                            <IconButton 
                              size="small" 
                              color="success" 
                              onClick={() => handleClearAlert(medicine._id)}
                              sx={{ bgcolor: '#ECF4E8', '&:hover': { bgcolor: '#cbf3bb' } }}
                            >
                              <Clear fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Edit">
                          <IconButton 
                            size="small" 
                            color="primary" 
                            onClick={() => handleEditMedicine(medicine)}
                            sx={{ bgcolor: '#E3F2FD', '&:hover': { bgcolor: '#BBDEFB' } }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleDeleteMedicine(medicine._id)}
                            sx={{ bgcolor: '#FFEBEE', '&:hover': { bgcolor: '#FFCDD2' } }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        /* CARD GRID LAYOUT */
        <Grid container spacing={2}>
          {itemsToDisplay.map((medicine) => {
            const hasAlert = medicine.stockAlert?.isAlerted || isOutOfStock(medicine);
            const isLow = isLowStock(medicine);
            return (
              <Grid item xs={12} sm={6} key={medicine._id}>
                <Card 
                  sx={{ 
                    border: hasAlert ? '2px solid #d32f2f' : isLow ? '2px solid #ed6c02' : `1px solid ${COLORS.border}`, 
                    borderRadius: 3,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                    position: 'relative',
                    '&:hover': {
                      boxShadow: '0 8px 25px rgba(0,0,0,0.06)'
                    }
                  }}
                >
                  {hasAlert && (
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      bgcolor: 'error.main', 
                      color: 'white', 
                      borderRadius: '50%', 
                      width: 24, 
                      height: 24, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      zIndex: 1 
                    }}>
                      <ErrorIcon sx={{ fontSize: 16 }} />
                    </Box>
                  )}
                  {medicine.image && (
                    <CardMedia 
                      component="img" 
                      height="130" 
                      image={getPublicFileUrl(medicine.image)} 
                      alt={medicine.name} 
                      sx={{ objectFit: 'cover' }} 
                    />
                  )}
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1} spacing={1}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: COLORS.primary, lineHeight: 1.2 }}>
                        {medicine.name}
                      </Typography>
                      <Chip 
                        label={MEDICINE_CATEGORIES.find((c) => c.value === medicine.category)?.label || medicine.category} 
                        size="small" 
                        sx={{ 
                          height: 22, 
                          fontSize: '0.65rem', 
                          fontWeight: 700, 
                          bgcolor: COLORS.lightGreen, 
                          color: COLORS.primary 
                        }} 
                      />
                    </Stack>
                    
                    {medicine.brand && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        Brand: <strong>{medicine.brand}</strong>
                      </Typography>
                    )}
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        my: 1, 
                        fontSize: '0.78rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: 34
                      }}
                    >
                      {medicine.description || 'No description provided.'}
                    </Typography>
                    
                    <Box sx={{ my: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: COLORS.teal }}>
                        Rs. {parseFloat(medicine.price?.perPack || medicine.price || 0).toFixed(2)} per pack
                      </Typography>
                      {medicine.price?.perUnit && (
                        <Typography variant="caption" color="text.secondary">
                          (Rs. {parseFloat(medicine.price.perUnit).toFixed(2)} per {medicine.baseUnit})
                        </Typography>
                      )}
                    </Box>
                    
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" gap={0.5}>
                      <Chip 
                        label={`${medicine.stock?.packs || 0} packs`} 
                        size="small" 
                        color={isOutOfStock(medicine) ? 'error' : isLow ? 'warning' : 'default'} 
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                      <Chip 
                        label={`${medicine.stock?.units || 0} ${medicine.baseUnit}s`} 
                        size="small" 
                        variant="outlined" 
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                      <Chip 
                        label={`Min Alert: ${medicine.minStockUnits || 0}`} 
                        size="small" 
                        variant="outlined" 
                        color="secondary" 
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    </Stack>

                    {medicine.stockAlert?.isAlerted && (
                      <Alert severity="error" icon={<ErrorIcon />} sx={{ mt: 2, p: 1, '& .MuiAlert-message': { p: 0 } }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                          Pharmacist stock alert:
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block' }}>
                          Reason: {medicine.stockAlert.alertReason}
                        </Typography>
                      </Alert>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      {medicine.stockAlert?.isAlerted && (
                        <Button 
                          size="small" 
                          color="success" 
                          variant="outlined"
                          startIcon={<Clear />} 
                          onClick={() => handleClearAlert(medicine._id)}
                          sx={{ textTransform: 'none', borderRadius: 2, fontSize: '0.75rem' }}
                        >
                          Clear Alert
                        </Button>
                      )}
                      <Button 
                        size="small" 
                        variant="outlined"
                        startIcon={<Edit />} 
                        onClick={() => handleEditMedicine(medicine)}
                        sx={{ textTransform: 'none', borderRadius: 2, fontSize: '0.75rem' }}
                      >
                        Edit
                      </Button>
                      <IconButton 
                        color="error" 
                        size="small" 
                        onClick={() => handleDeleteMedicine(medicine._id)}
                        sx={{ border: '1px solid rgba(211,47,47,0.12)', borderRadius: 2 }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default MedicineList;
