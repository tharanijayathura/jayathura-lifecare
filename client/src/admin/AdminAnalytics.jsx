// client/src/admin/AdminAnalytics.jsx
import React, { useMemo, useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  Stack,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  People,
  LocalPharmacy,
  AttachMoney,
  ShoppingCart,
  TrendingUp,
  PersonAddAlt1,
  LocalShipping,
  AdminPanelSettings,
  Receipt,
  Autorenew
} from '@mui/icons-material';

import { adminAPI } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import StatCard from '../components/common/analytics/StatCard.jsx';
import SimpleBarChart from '../components/common/analytics/SimpleBarChart.jsx';
import RevenueByCategory from './analytics/RevenueByCategory.jsx';
import SalesByCategory from './analytics/SalesByCategory.jsx';
import TopSellingTable from './analytics/TopSellingTable.jsx';
import HeaderControls from './analytics/HeaderControls.jsx';

const AdminAnalytics = () => {
  const { showNotification } = useNotification();
  const [timePeriod, setTimePeriod] = useState('month');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminAPI.getAnalytics(timePeriod);
      setAnalyticsData(response.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to fetch live database analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timePeriod]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(amount);

  const handleExportReport = () => {
    if (!analyticsData) {
      showNotification('No analytics data available to export.', { type: 'error' });
      return;
    }

    const reportContent = `
======================================================
           JAYATHURA LIFECARE ANALYTICS REPORT
======================================================
TIME PERIOD:  ${timePeriod.toUpperCase()}
EXPORTED AT:  ${new Date().toLocaleString()}
------------------------------------------------------
EXECUTIVE SUMMARY:
- Gross Revenue:         Rs. ${analyticsData.totalRevenue.toFixed(2)}
- Total Orders Placed:   ${analyticsData.totalOrders}
- Total Items Sold:      ${analyticsData.totalSales}
- Registered Accounts:  ${analyticsData.totalUsers}
- Active Pharmacists:    ${analyticsData.activePharmacists}
- Prescriptions Filled:  ${analyticsData.prescriptionsProcessed}
------------------------------------------------------
TOP SELLING PRODUCTS:
${analyticsData.topSelling.map((item, i) => `${i+1}. ${item.name} (${item.quantity} units) - Rs. ${item.revenue.toFixed(2)}`).join('\n')}
------------------------------------------------------
REVENUE BY CLASS:
${analyticsData.revenueByCategory.map(item => `- ${item.category}: Rs. ${item.revenue.toFixed(2)} (${item.percentage}%)`).join('\n')}
------------------------------------------------------
ORDER TYPE SALES VOLUMES:
${analyticsData.categoryBreakdown.map(item => `- ${item.category}: ${item.sales} orders (Rs. ${item.revenue.toFixed(2)})`).join('\n')}
======================================================
Prepared by Jayathura LifeCare Management Dashboard.
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JLC_Analytics_Report_${timePeriod}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Analytics report exported successfully!', { type: 'success' });
  };

  const growthPreview = useMemo(() => {
    return analyticsData?.userGrowth || [];
  }, [analyticsData]);

  const revenuePreview = useMemo(() => {
    return analyticsData?.revenueTrend || [];
  }, [analyticsData]);

  if (loading && !analyticsData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', gap: 2 }}>
        <CircularProgress size={40} sx={{ color: COLORS.blue2 }} />
        <Typography sx={{ color: COLORS.subtext, fontWeight: 700 }}>Querying database statistics...</Typography>
      </Box>
    );
  }

  const currentData = analyticsData || {
    totalRevenue: 0,
    totalOrders: 0,
    totalSales: 0,
    totalUsers: 0,
    activePharmacists: 0,
    prescriptionsProcessed: 0,
    topSelling: [{ name: 'No sales', quantity: 0, revenue: 0 }],
    categoryBreakdown: [{ category: 'OTC', sales: 0, revenue: 0 }],
    revenueByCategory: [{ category: 'Medicines', revenue: 0, percentage: 100 }]
  };

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
        {/* Error alerting */}
        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>{error}</Alert>}

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

        {/* Secondary Stats Row */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<People sx={{ fontSize: 24 }} />}
              title="Patients Registry"
              value={(currentData.totalPatients || 0).toLocaleString()}
              subtitle="Registered patients"
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<LocalShipping sx={{ fontSize: 24 }} />}
              title="Delivery Couriers"
              value={(currentData.totalCouriers || 0).toLocaleString()}
              subtitle="Active agents"
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<LocalPharmacy sx={{ fontSize: 24 }} />}
              title="Medicines Catalog"
              value={(currentData.totalMedicines || 0).toLocaleString()}
              subtitle="Stock templates"
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<Receipt sx={{ fontSize: 24 }} />}
              title="Total Invoices"
              value={(currentData.totalInvoices || 0).toLocaleString()}
              subtitle="Billed accounts"
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
                  <Typography sx={sectionTitleSx}>Revenue trend</Typography>
                </Stack>

                <Typography sx={sectionSubSx}>
                  Daily gross revenue over the selected period
                </Typography>

                <Box sx={{ mt: 1 }}>
                  <SimpleBarChart data={revenuePreview} height={260} dataKey="revenue" />
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
              <Typography sx={sectionTitleSx}>User Growth Summary</Typography>
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
