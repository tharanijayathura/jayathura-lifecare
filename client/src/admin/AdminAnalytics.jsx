import React, { useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  Stack,
  Divider,
} from '@mui/material';
import {
  People,
  LocalPharmacy,
  AttachMoney,
  ShoppingCart,
  TrendingUp,
  PersonAddAlt1,
} from '@mui/icons-material';

import StatCard from '../components/common/analytics/StatCard.jsx';
import SimpleBarChart from '../components/common/analytics/SimpleBarChart.jsx';
import RevenueByCategory from './analytics/RevenueByCategory.jsx';
import SalesByCategory from './analytics/SalesByCategory.jsx';
import TopSellingTable from './analytics/TopSellingTable.jsx';
import HeaderControls from './analytics/HeaderControls.jsx';

const AdminAnalytics = () => {
  const [timePeriod, setTimePeriod] = useState('month');
  const [reportType, setReportType] = useState('sales');

  // ✅ Keep your exact palette
  const COLORS = {
    bg1: '#ECF4E8',
    bg2: '#CBF3BB',
    green: '#ABE7B2',
    blue: '#93BFC7',
    blue2: '#7AA8B0',
    text: '#2C3E50',
    subtext: '#546E7A',
    border: 'rgba(147,191,199,0.35)',
    glass: 'rgba(255,255,255,0.88)',
  };

  const glassCardSx = {
    borderRadius: 3,
    border: `1px solid ${COLORS.border}`,
    backgroundColor: COLORS.glass,
    backdropFilter: 'blur(10px)',
    boxShadow: '0 14px 34px rgba(44,62,80,0.10)',
    overflow: 'hidden',
  };

  const sectionTitleSx = {
    color: COLORS.text,
    fontSize: '1.05rem',
    mb: 0.75,
  };

  const sectionSubSx = {
    color: COLORS.subtext,
    fontSize: '0.9rem',
    mb: 1.5,
  };

  // Mock data - same as yours
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

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(amount);

  const handleExportReport = () => {
    alert('Report export functionality will be implemented with real data integration');
  };

  // keep charts smaller for performance
  const growthPreview = useMemo(() => currentData.userGrowth.slice(0, 14), [currentData]);

  return (
    <Box
      sx={{
        minHeight: '100%',
        py: { xs: 2, md: 3 },
        px: { xs: 1, md: 2 },
        background: `linear-gradient(135deg, ${COLORS.bg1} 0%, ${COLORS.bg2} 55%, rgba(147,191,199,0.18) 100%)`,
      }}
    >
      <Container maxWidth="xl">
        {/* Header Controls (keep your component) */}
        <Box sx={{ mb: 2 }}>
          <HeaderControls
            timePeriod={timePeriod}
            setTimePeriod={setTimePeriod}
            onExport={handleExportReport}
          />
        </Box>

        {/* Top Stats */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<AttachMoney sx={{ fontSize: 26 }} />}
              title="Total Revenue"
              value={formatCurrency(currentData.totalRevenue)}
              subtitle="Gross earnings"
              trend={15.8}
              color="success"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<ShoppingCart sx={{ fontSize: 26 }} />}
              title="Total Orders"
              value={currentData.totalOrders.toLocaleString()}
              subtitle={`${currentData.totalSales} items sold`}
              trend={12.3}
              color="primary"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<People sx={{ fontSize: 26 }} />}
              title="Total Users"
              value={currentData.totalUsers.toLocaleString()}
              subtitle={`${currentData.activePharmacists} active pharmacists`}
              trend={8.5}
              color="info"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<LocalPharmacy sx={{ fontSize: 26 }} />}
              title="Prescriptions"
              value={currentData.prescriptionsProcessed}
              subtitle="Processed this period"
              trend={6.2}
              color="warning"
            />
          </Grid>
        </Grid>

        {/* Main Row: Trend + Revenue by Category */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={8}>
            <Card sx={glassCardSx}>
              <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <TrendingUp sx={{ color: COLORS.blue2 }} />
                  <Typography sx={sectionTitleSx}>Revenue Trend</Typography>
                </Stack>

                <Typography sx={sectionSubSx}>
                  Daily revenue over the selected period
                </Typography>

                <Box sx={{ mt: 1 }}>
                  {/* keep your chart, just wrapped */}
                  <SimpleBarChart data={growthPreview} height={260} dataKey="newUsers" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={glassCardSx}>
              <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                <RevenueByCategory data={currentData.revenueByCategory} formatCurrency={formatCurrency} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Sales by category + Top selling */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Card sx={glassCardSx}>
              <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                <SalesByCategory breakdown={currentData.categoryBreakdown} formatCurrency={formatCurrency} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={glassCardSx}>
              <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                <TopSellingTable items={currentData.topSelling} formatCurrency={formatCurrency} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* User growth */}
        <Card sx={glassCardSx}>
          <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <PersonAddAlt1 sx={{ color: COLORS.blue2 }} />
              <Typography sx={sectionTitleSx}>User Growth</Typography>
            </Stack>

            <Typography sx={sectionSubSx}>
              New user registrations over time
            </Typography>

            <Divider sx={{ mb: 2, borderColor: COLORS.border }} />

            <SimpleBarChart data={growthPreview} height={220} dataKey="newUsers" />
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminAnalytics;
