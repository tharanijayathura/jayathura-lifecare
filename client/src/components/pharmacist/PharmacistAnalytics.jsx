import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  LocalPharmacy,
  AttachMoney,
  ShoppingCart,
  Inventory,
  Assessment,
} from '@mui/icons-material';

const PharmacistAnalytics = () => {
  const [timePeriod, setTimePeriod] = useState('month');

  // Mock data for analytics
  const mockData = {
    week: {
      totalSales: 1250,
      totalRevenue: 187500,
      medicinesSold: 1250,
      prescriptionsVerified: 85,
      topSelling: [
        { name: 'Panadol 500mg', quantity: 145, revenue: 21750 },
        { name: 'Siddhalepa Balm', quantity: 98, revenue: 14700 },
        { name: 'ENO Antacid', quantity: 87, revenue: 13050 },
        { name: 'Vicks Vaporub', quantity: 76, revenue: 11400 },
        { name: 'Cetirizine 10mg', quantity: 65, revenue: 9750 },
      ],
      categoryBreakdown: [
        { category: 'OTC', sales: 650, revenue: 97500 },
        { category: 'Prescription', sales: 420, revenue: 63000 },
        { category: 'Vitamins', sales: 180, revenue: 27000 },
      ],
      dailySales: [
        { day: 'Mon', sales: 180, revenue: 27000 },
        { day: 'Tue', sales: 195, revenue: 29250 },
        { day: 'Wed', sales: 210, revenue: 31500 },
        { day: 'Thu', sales: 175, revenue: 26250 },
        { day: 'Fri', sales: 200, revenue: 30000 },
        { day: 'Sat', sales: 185, revenue: 27750 },
        { day: 'Sun', sales: 105, revenue: 15750 },
      ],
    },
    month: {
      totalSales: 4850,
      totalRevenue: 727500,
      medicinesSold: 4850,
      prescriptionsVerified: 320,
      topSelling: [
        { name: 'Panadol 500mg', quantity: 580, revenue: 87000 },
        { name: 'Siddhalepa Balm', quantity: 420, revenue: 63000 },
        { name: 'ENO Antacid', quantity: 380, revenue: 57000 },
        { name: 'Vicks Vaporub', quantity: 340, revenue: 51000 },
        { name: 'Cetirizine 10mg', quantity: 290, revenue: 43500 },
      ],
      categoryBreakdown: [
        { category: 'OTC', sales: 2500, revenue: 375000 },
        { category: 'Prescription', sales: 1650, revenue: 247500 },
        { category: 'Vitamins', sales: 700, revenue: 105000 },
      ],
      dailySales: Array.from({ length: 30 }, (_, i) => ({
        day: `Day ${i + 1}`,
        sales: Math.floor(Math.random() * 200) + 100,
        revenue: Math.floor(Math.random() * 30000) + 15000,
      })),
    },
    threeMonths: {
      totalSales: 14200,
      totalRevenue: 2130000,
      medicinesSold: 14200,
      prescriptionsVerified: 950,
      topSelling: [
        { name: 'Panadol 500mg', quantity: 1680, revenue: 252000 },
        { name: 'Siddhalepa Balm', quantity: 1250, revenue: 187500 },
        { name: 'ENO Antacid', quantity: 1120, revenue: 168000 },
        { name: 'Vicks Vaporub', quantity: 980, revenue: 147000 },
        { name: 'Cetirizine 10mg', quantity: 850, revenue: 127500 },
      ],
      categoryBreakdown: [
        { category: 'OTC', sales: 7300, revenue: 1095000 },
        { category: 'Prescription', sales: 4850, revenue: 727500 },
        { category: 'Vitamins', sales: 2050, revenue: 307500 },
      ],
      dailySales: Array.from({ length: 90 }, (_, i) => ({
        day: `Day ${i + 1}`,
        sales: Math.floor(Math.random() * 200) + 100,
        revenue: Math.floor(Math.random() * 30000) + 15000,
      })),
    },
  };

  const currentData = mockData[timePeriod] || mockData.month;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const StatCard = ({ icon, title, value, subtitle, trend, color = 'primary' }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${color}.light`,
              color: `${color}.main`,
            }}
          >
            {icon}
          </Box>
          {trend && (
            <Chip
              icon={trend > 0 ? <TrendingUp /> : <TrendingDown />}
              label={`${trend > 0 ? '+' : ''}${trend}%`}
              size="small"
              color={trend > 0 ? 'success' : 'error'}
              sx={{ fontSize: '0.75rem' }}
            />
          )}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const SimpleBarChart = ({ data, height = 200 }) => {
    const maxValue = Math.max(...data.map((d) => d.sales || d.revenue));
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'flex-end', gap: 1, px: 1 }}>
        {data.map((item, index) => {
          const heightPercent = ((item.sales || item.revenue) / maxValue) * 100;
          return (
            <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                sx={{
                  width: '100%',
                  height: `${heightPercent}%`,
                  minHeight: 20,
                  bgcolor: 'primary.main',
                  borderRadius: '4px 4px 0 0',
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    transform: 'scaleY(1.05)',
                  },
                }}
              />
              <Typography variant="caption" sx={{ mt: 0.5, fontSize: '0.7rem', textAlign: 'center' }}>
                {item.day || item.category}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Sales Analytics
        </Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Time Period</InputLabel>
          <Select value={timePeriod} label="Time Period" onChange={(e) => setTimePeriod(e.target.value)}>
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="threeMonths">Last 3 Months</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<ShoppingCart sx={{ fontSize: 28 }} />}
            title="Total Sales"
            value={currentData.totalSales.toLocaleString()}
            subtitle={`${currentData.medicinesSold} items sold`}
            trend={12.5}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<AttachMoney sx={{ fontSize: 28 }} />}
            title="Total Revenue"
            value={formatCurrency(currentData.totalRevenue)}
            subtitle="Gross earnings"
            trend={8.3}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<LocalPharmacy sx={{ fontSize: 28 }} />}
            title="Prescriptions"
            value={currentData.prescriptionsVerified}
            subtitle="Verified this period"
            trend={5.2}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Assessment sx={{ fontSize: 28 }} />}
            title="Avg. Order Value"
            value={formatCurrency(currentData.totalRevenue / currentData.totalSales)}
            subtitle="Per transaction"
            trend={-2.1}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Sales Trend
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Daily sales over the selected period
              </Typography>
              <SimpleBarChart data={currentData.dailySales.slice(0, 14)} height={250} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Category Breakdown
              </Typography>
              <Box sx={{ mt: 2 }}>
                {currentData.categoryBreakdown.map((cat, index) => {
                  const total = currentData.categoryBreakdown.reduce((sum, c) => sum + c.sales, 0);
                  const percentage = (cat.sales / total) * 100;
                  return (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {cat.category}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {cat.sales} ({percentage.toFixed(1)}%)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: index === 0 ? 'primary.main' : index === 1 ? 'success.main' : 'info.main',
                          },
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {formatCurrency(cat.revenue)}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Selling Medicines */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Top Selling Medicines
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Rank</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Medicine Name</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Quantity Sold
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Revenue
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentData.topSelling.map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Chip
                        label={`#${index + 1}`}
                        size="small"
                        color={index === 0 ? 'primary' : index === 1 ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{item.name}</TableCell>
                    <TableCell align="right">{item.quantity.toLocaleString()}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: 'success.main' }}>
                      {formatCurrency(item.revenue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PharmacistAnalytics;

