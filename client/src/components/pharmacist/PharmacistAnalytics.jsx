import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { LocalPharmacy, AttachMoney, ShoppingCart, Assessment } from '@mui/icons-material';
import StatCard from '../common/analytics/StatCard.jsx';
import SimpleBarChart from '../common/analytics/SimpleBarChart.jsx';
import HeaderControls from './analytics/HeaderControls.jsx';
import CategoryBreakdown from './analytics/CategoryBreakdown.jsx';
import TopSellingTable from './analytics/TopSellingTable.jsx';

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


  return (
    <Box>
      <HeaderControls timePeriod={timePeriod} setTimePeriod={setTimePeriod} title="Sales Analytics" />

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
              <SimpleBarChart data={currentData.dailySales.slice(0, 14)} height={250} dataKey="sales" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <CategoryBreakdown breakdown={currentData.categoryBreakdown} formatCurrency={formatCurrency} />
        </Grid>
      </Grid>

      {/* Top Selling Medicines */}
      <TopSellingTable items={currentData.topSelling} formatCurrency={formatCurrency} />
    </Box>
  );
};

export default PharmacistAnalytics;

