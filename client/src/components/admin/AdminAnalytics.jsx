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
  Button,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  LocalPharmacy,
  AttachMoney,
  ShoppingCart,
  Inventory,
  Assessment,
  Download,
  Print,
} from '@mui/icons-material';

const AdminAnalytics = () => {
  const [timePeriod, setTimePeriod] = useState('month');
  const [reportType, setReportType] = useState('sales');

  // Mock data for admin analytics
  const mockData = {
    week: {
      totalSales: 3850,
      totalRevenue: 577500,
      totalUsers: 1250,
      activePharmacists: 8,
      totalOrders: 320,
      prescriptionsProcessed: 185,
      topSelling: [
        { name: 'Panadol 500mg', quantity: 450, revenue: 67500 },
        { name: 'Siddhalepa Balm', quantity: 320, revenue: 48000 },
        { name: 'ENO Antacid', quantity: 280, revenue: 42000 },
        { name: 'Vicks Vaporub', quantity: 250, revenue: 37500 },
        { name: 'Cetirizine 10mg', quantity: 220, revenue: 33000 },
      ],
      categoryBreakdown: [
        { category: 'OTC', sales: 2000, revenue: 300000 },
        { category: 'Prescription', sales: 1300, revenue: 195000 },
        { category: 'Vitamins', sales: 550, revenue: 82500 },
      ],
      userGrowth: [
        { period: 'Mon', newUsers: 25 },
        { period: 'Tue', newUsers: 32 },
        { period: 'Wed', newUsers: 28 },
        { period: 'Thu', newUsers: 35 },
        { period: 'Fri', newUsers: 30 },
        { period: 'Sat', newUsers: 22 },
        { period: 'Sun', newUsers: 18 },
      ],
      revenueByCategory: [
        { category: 'Medicines', revenue: 450000, percentage: 78 },
        { category: 'Groceries', revenue: 127500, percentage: 22 },
      ],
    },
    month: {
      totalSales: 15200,
      totalRevenue: 2280000,
      totalUsers: 4850,
      activePharmacists: 12,
      totalOrders: 1250,
      prescriptionsProcessed: 720,
      topSelling: [
        { name: 'Panadol 500mg', quantity: 1850, revenue: 277500 },
        { name: 'Siddhalepa Balm', quantity: 1320, revenue: 198000 },
        { name: 'ENO Antacid', quantity: 1180, revenue: 177000 },
        { name: 'Vicks Vaporub', quantity: 1050, revenue: 157500 },
        { name: 'Cetirizine 10mg', quantity: 920, revenue: 138000 },
      ],
      categoryBreakdown: [
        { category: 'OTC', sales: 7800, revenue: 1170000 },
        { category: 'Prescription', sales: 5200, revenue: 780000 },
        { category: 'Vitamins', sales: 2200, revenue: 330000 },
      ],
      userGrowth: Array.from({ length: 30 }, (_, i) => ({
        period: `Day ${i + 1}`,
        newUsers: Math.floor(Math.random() * 50) + 15,
      })),
      revenueByCategory: [
        { category: 'Medicines', revenue: 1800000, percentage: 79 },
        { category: 'Groceries', revenue: 480000, percentage: 21 },
      ],
    },
    threeMonths: {
      totalSales: 45200,
      totalRevenue: 6780000,
      totalUsers: 14200,
      activePharmacists: 15,
      totalOrders: 3850,
      prescriptionsProcessed: 2150,
      topSelling: [
        { name: 'Panadol 500mg', quantity: 5420, revenue: 813000 },
        { name: 'Siddhalepa Balm', quantity: 3850, revenue: 577500 },
        { name: 'ENO Antacid', quantity: 3420, revenue: 513000 },
        { name: 'Vicks Vaporub', quantity: 3050, revenue: 457500 },
        { name: 'Cetirizine 10mg', quantity: 2680, revenue: 402000 },
      ],
      categoryBreakdown: [
        { category: 'OTC', sales: 23100, revenue: 3465000 },
        { category: 'Prescription', sales: 15400, revenue: 2310000 },
        { category: 'Vitamins', sales: 6700, revenue: 1005000 },
      ],
      userGrowth: Array.from({ length: 90 }, (_, i) => ({
        period: `Day ${i + 1}`,
        newUsers: Math.floor(Math.random() * 50) + 15,
      })),
      revenueByCategory: [
        { category: 'Medicines', revenue: 5350000, percentage: 79 },
        { category: 'Groceries', revenue: 1430000, percentage: 21 },
      ],
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
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary', fontSize: { xs: '1.5rem', md: '2rem' } }}>
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

  const SimpleBarChart = ({ data, height = 200, dataKey = 'sales' }) => {
    const maxValue = Math.max(...data.map((d) => d[dataKey] || 0));
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'flex-end', gap: 1, px: 1 }}>
        {data.map((item, index) => {
          const heightPercent = ((item[dataKey] || 0) / maxValue) * 100;
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
                {item.period || item.category || item.day}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  };

  const handleExportReport = () => {
    // Mock export functionality
    alert('Report export functionality will be implemented with real data integration');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
          System Analytics & Reports
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Time Period</InputLabel>
            <Select value={timePeriod} label="Time Period" onChange={(e) => setTimePeriod(e.target.value)}>
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="threeMonths">Last 3 Months</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportReport}
            size="small"
          >
            Export Report
          </Button>
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={() => window.print()}
            size="small"
          >
            Print
          </Button>
        </Stack>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<AttachMoney sx={{ fontSize: 28 }} />}
            title="Total Revenue"
            value={formatCurrency(currentData.totalRevenue)}
            subtitle="Gross earnings"
            trend={15.8}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<ShoppingCart sx={{ fontSize: 28 }} />}
            title="Total Orders"
            value={currentData.totalOrders.toLocaleString()}
            subtitle={`${currentData.totalSales} items sold`}
            trend={12.3}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<People sx={{ fontSize: 28 }} />}
            title="Total Users"
            value={currentData.totalUsers.toLocaleString()}
            subtitle={`${currentData.activePharmacists} active pharmacists`}
            trend={8.5}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<LocalPharmacy sx={{ fontSize: 28 }} />}
            title="Prescriptions"
            value={currentData.prescriptionsProcessed}
            subtitle="Processed this period"
            trend={6.2}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Revenue and Sales Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Revenue Trend
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Daily revenue over the selected period
              </Typography>
              <SimpleBarChart data={currentData.userGrowth.slice(0, 14)} height={250} dataKey="newUsers" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Revenue by Product Type
              </Typography>
              <Box sx={{ mt: 2 }}>
                {currentData.revenueByCategory.map((cat, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {cat.category}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {cat.percentage}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={cat.percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: index === 0 ? 'primary.main' : 'success.main',
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {formatCurrency(cat.revenue)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Category Breakdown and Top Selling */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Sales by Category
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
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Top Selling Products
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        Quantity
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
                            sx={{ mr: 1 }}
                          />
                          {item.name}
                        </TableCell>
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
        </Grid>
      </Grid>

      {/* User Growth Chart */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            User Growth
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            New user registrations over time
          </Typography>
          <SimpleBarChart data={currentData.userGrowth.slice(0, 14)} height={200} dataKey="newUsers" />
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminAnalytics;

