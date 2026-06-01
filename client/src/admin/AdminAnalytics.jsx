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
  Alert,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Button,
  Paper
} from '@mui/material';
import {
  People,
  LocalPharmacy,
  AttachMoney,
  ShoppingCart,
  TrendingUp,
  PersonAddAlt1,
  LocalShipping,
  Receipt,
  Download,
  InfoOutlined,
  Warning,
  CheckCircle,
  Speed,
  Close
} from '@mui/icons-material';

import { adminAPI, medicineAPI } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import HeaderControls from './analytics/HeaderControls.jsx';

const AdminAnalytics = () => {
  const { showNotification } = useNotification();
  const [timePeriod, setTimePeriod] = useState('month');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [medicinesCatalog, setMedicinesCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const COLORS = {
    primary: '#4318FF',
    secondary: '#A3AED0',
    teal: '#05CD99',
    bg1: '#F4F7FE',
    bg2: '#FFFFFF',
    green: '#05CD99',
    blue: '#4318FF',
    blue2: '#39B8FF',
    text: '#2B3674',
    subtext: '#A3AED0',
    border: '#E0E5F2',
    glass: '#ffffff',
  };

  const glassCardSx = {
    borderRadius: 4,
    border: `1px solid ${COLORS.border}`,
    backgroundColor: COLORS.glass,
    boxShadow: '0 10px 40px rgba(112, 144, 176, 0.08)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  };

  const sectionHeaderSx = {
    fontSize: '0.8rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: COLORS.subtext,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mb: 1
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const [analyticsRes, medicinesRes] = await Promise.all([
        adminAPI.getAnalytics(timePeriod),
        medicineAPI.getAllAdmin()
      ]);
      setAnalyticsData(analyticsRes.data);
      setMedicinesCatalog(medicinesRes.data);
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

  // Compile detailed stock catalog alerts
  const medicinesCatalogStats = useMemo(() => {
    if (!medicinesCatalog || medicinesCatalog.length === 0) {
      return { outOfStock: 0, lowStock: 0, healthy: 0, criticalItems: [] };
    }
    
    let outOfStock = 0;
    let lowStock = 0;
    let healthy = 0;
    const criticalItems = [];
    
    medicinesCatalog.forEach(med => {
      const isOutOfStock = med.stock?.packs <= 0 || med.isOutOfStock;
      const isLowStock = med.stock?.units <= med.minStockUnits || med.isLowStock;
      
      if (isOutOfStock) {
        outOfStock++;
        criticalItems.push({
          id: med._id,
          name: med.name,
          brand: med.brand,
          packs: 0,
          units: 0,
          minStockUnits: med.minStockUnits,
          severity: 'high',
          reason: med.stockAlert?.isAlerted ? med.stockAlert.alertReason : 'Out of physical stock'
        });
      } else if (isLowStock) {
        lowStock++;
        criticalItems.push({
          id: med._id,
          name: med.name,
          brand: med.brand,
          packs: med.stock?.packs,
          units: med.stock?.units,
          minStockUnits: med.minStockUnits,
          severity: 'medium',
          reason: med.stockAlert?.isAlerted ? med.stockAlert.alertReason : 'Below min threshold'
        });
      } else {
        healthy++;
      }
    });
    
    // Sort critical items: out of stock first, then low stock
    criticalItems.sort((a, b) => (a.severity === 'high' ? -1 : 1));
    
    return {
      outOfStock,
      lowStock,
      healthy,
      criticalItems: criticalItems.slice(0, 5) // top 5 critical items
    };
  }, [medicinesCatalog]);

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

  const growthPreview = useMemo(() => {
    return analyticsData?.userGrowth || [];
  }, [analyticsData]);

  const revenuePreview = useMemo(() => {
    return analyticsData?.revenueTrend || [];
  }, [analyticsData]);

  const verifiedRxRate = useMemo(() => {
    if (!currentData.totalOrders) return 0;
    return Math.min(100, Math.round((currentData.prescriptionsProcessed / currentData.totalOrders) * 100));
  }, [currentData]);

  // SVGs / Circular Charts
  const RenderCircularProgressRing = ({ value, title, subtitle, color = COLORS.teal, size = 66 }) => {
    const radius = 15;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (Math.min(100, value) / 100) * circumference;

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="100%" height="100%" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r={radius}
              fill="none"
              stroke="#f1f3f5"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="3.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 18 18)"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 800, color: COLORS.text, fontSize: '0.8rem' }}>
              {value}%
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 800, color: COLORS.text }}>
            {subtitle}
          </Typography>
        </Box>
      </Box>
    );
  };

  const RenderSVGLineChart = ({ data, height = 180 }) => {
    if (!data || data.length === 0) {
      return (
        <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fafafa', borderRadius: 2 }}>
          <Typography variant="caption" color="text.secondary">No trend data available</Typography>
        </Box>
      );
    }

    const width = 500;
    const paddingX = 35;
    const paddingY = 25;
    const chartWidth = width - paddingX * 2;
    const chartHeight = height - paddingY * 2;

    const values = data.map(d => d.revenue ?? 0);
    const maxValue = Math.max(...values, 1000);

    const points = data.map((d, index) => {
      const x = paddingX + (index / (data.length - 1 || 1)) * chartWidth;
      const y = paddingY + chartHeight - ((d.revenue ?? 0) / maxValue) * chartHeight;
      return `${x},${y}`;
    });

    const pathData = points.length > 0 ? `M ${points.join(' L ')}` : '';
    const fillPathData = points.length > 0
      ? `${pathData} L ${paddingX + chartWidth},${paddingY + chartHeight} L ${paddingX},${paddingY + chartHeight} Z`
      : '';

    return (
      <Box sx={{ width: '100%', height }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.blue2} stopOpacity="0.3" />
              <stop offset="100%" stopColor={COLORS.blue2} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={paddingX} y1={paddingY} x2={paddingX + chartWidth} y2={paddingY} stroke="rgba(0,0,0,0.04)" strokeDasharray="3" />
          <line x1={paddingX} y1={paddingY + chartHeight / 2} x2={paddingX + chartWidth} y2={paddingY + chartHeight / 2} stroke="rgba(0,0,0,0.04)" strokeDasharray="3" />
          <line x1={paddingX} y1={paddingY + chartHeight} x2={paddingX + chartWidth} y2={paddingY + chartHeight} stroke="rgba(0,0,0,0.06)" />

          {/* Fill under chart line */}
          {fillPathData && <path d={fillPathData} fill="url(#chartAreaGradient)" style={{ transition: 'all 0.5s' }} />}

          {/* Trend line */}
          {pathData && (
            <path
              d={pathData}
              fill="none"
              stroke={COLORS.teal}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: 'all 0.5s' }}
            />
          )}

          {/* Data dot points */}
          {data.map((d, index) => {
            const x = paddingX + (index / (data.length - 1 || 1)) * chartWidth;
            const y = paddingY + chartHeight - ((d.revenue ?? 0) / maxValue) * chartHeight;
            return (
              <g key={index}>
                <Tooltip title={`Period: ${d.period} | Revenue: Rs. ${d.revenue}`} arrow>
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill={COLORS.primary}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  />
                </Tooltip>
              </g>
            );
          })}

          {/* X axis labels (first, middle, last) */}
          <text x={paddingX} y={height - 5} fill={COLORS.subtext} fontSize="9" textAnchor="start">
            {data[0]?.period}
          </text>
          <text x={paddingX + chartWidth / 2} y={height - 5} fill={COLORS.subtext} fontSize="9" textAnchor="middle">
            {data[Math.floor(data.length / 2)]?.period}
          </text>
          <text x={paddingX + chartWidth} y={height - 5} fill={COLORS.subtext} fontSize="9" textAnchor="end">
            {data[data.length - 1]?.period}
          </text>

          {/* Y axis labels */}
          <text x={paddingX - 5} y={paddingY + 4} fill={COLORS.subtext} fontSize="8" textAnchor="end">
            Rs. {Math.round(maxValue)}
          </text>
          <text x={paddingX - 5} y={paddingY + chartHeight / 2 + 4} fill={COLORS.subtext} fontSize="8" textAnchor="end">
            Rs. {Math.round(maxValue / 2)}
          </text>
          <text x={paddingX - 5} y={paddingY + chartHeight + 4} fill={COLORS.subtext} fontSize="8" textAnchor="end">
            Rs. 0
          </text>
        </svg>
      </Box>
    );
  };

  // Metrics derived from databases
  const storeHealthScore = useMemo(() => {
    const totalCount = medicinesCatalog.length || 1;
    const outCount = medicinesCatalogStats.outOfStock;
    return Math.round(((totalCount - outCount) / totalCount) * 100);
  }, [medicinesCatalog, medicinesCatalogStats]);

  const orderFulfillmentRate = useMemo(() => {
    if (currentData.totalOrders === 0) return 100;
    const completed = currentData.statusCounts?.delivered || 0;
    const active = (currentData.totalOrders - (currentData.statusCounts?.cancelled || 0));
    return Math.min(100, Math.round((completed / (active || 1)) * 100));
  }, [currentData]);

  return (
    <Box
      sx={{
        minHeight: '100%',
        py: { xs: 2.5, md: 3 },
        px: { xs: 1.5, md: 2.5 },
        background: `linear-gradient(135deg, ${COLORS.bg1} 0%, ${COLORS.bg2} 100%)`,
      }}
    >
      <Container maxWidth="xl">
        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>{error}</Alert>}

        {/* Top Header Period selector and Export tool */}
        <Box sx={{ mb: 2.5 }}>
          <HeaderControls
            timePeriod={timePeriod}
            setTimePeriod={setTimePeriod}
            onExport={handleExportReport}
          />
        </Box>

        {/* 1. TOP KPI METRICS BAR (Domain Analytics equivalents) */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: 3,
            border: `1px solid ${COLORS.border}`,
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}
        >
          <Typography sx={{ ...sectionHeaderSx, mb: 2 }}>
            <Speed fontSize="small" /> Domain Analytics Summary
          </Typography>
          
          <Grid container spacing={3} alignItems="center">
            {/* KPI 1: Authority Score Equivalent - Store fulfillment health */}
            <Grid item xs={12} sm={6} md={2.4}>
              <RenderCircularProgressRing
                value={orderFulfillmentRate}
                title="Fulfillment Trust"
                subtitle={`${orderFulfillmentRate}/100 Rate`}
                color="#7AA8B0"
              />
            </Grid>

            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, mx: 1 }} />

            {/* KPI 2: Organic Traffic Equivalent - Gross revenue */}
            <Grid item xs={12} sm={6} md={2.2}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Gross Revenue
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.text, my: 0.25 }}>
                  {formatCurrency(currentData.totalRevenue)}
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                    +3.44%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">vs last period</Typography>
                </Stack>
              </Box>
            </Grid>

            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, mx: 1 }} />

            {/* KPI 3: Organic Keywords Equivalent - Catalog medicines */}
            <Grid item xs={12} sm={6} md={2.2}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Catalog items
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.text, my: 0.25 }}>
                  {currentData.totalMedicines || 0} meds
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700 }}>
                    +1.88%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">active catalog</Typography>
                </Stack>
              </Box>
            </Grid>

            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, mx: 1 }} />

            {/* KPI 4: Paid Keywords Equivalent - Prescriptions processed */}
            <Grid item xs={12} sm={6} md={2.2}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Prescriptions
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.text, my: 0.25 }}>
                  {currentData.prescriptionsProcessed} filled
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700 }}>
                    +21.64%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">doctor check verified</Typography>
                </Stack>
              </Box>
            </Grid>

            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, mx: 1 }} />

            {/* KPI 5: Referral Domains Equivalent - User base */}
            <Grid item xs={12} sm={6} md={2.2}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Users Base
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.text, my: 0.25 }}>
                  {currentData.totalUsers} registered
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 700 }}>
                    -1.13%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">accounts trend</Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* 2. SPLIT LAYOUT SECTIONS */}
        <Grid container spacing={3}>
          
          {/* ================= LEFT MAIN GRID ================= */}
          <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* Card 1: Position Tracking Layout - Area chart & metrics list */}
            <Card sx={glassCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={sectionHeaderSx}>
                  <TrendingUp fontSize="small" sx={{ color: COLORS.teal }} /> Position Tracking - Revenue Trend
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  {/* Left segment side details */}
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#fafafa', border: `1px solid ${COLORS.border}`, height: '100%' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
                        STORE VISIBILITY
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: COLORS.text, mb: 1 }}>
                        94%
                      </Typography>
                      
                      <Stack spacing={1.5} sx={{ mt: 2 }}>
                        <Box>
                          <Stack direction="row" justifyContent="space-between" mb={0.25}>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.secondary }}>OTC Share</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.text }}>65%</Typography>
                          </Stack>
                          <LinearProgress variant="determinate" value={65} sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.04)', '& .MuiLinearProgress-bar': { bgcolor: COLORS.teal } }} />
                        </Box>
                        <Box>
                          <Stack direction="row" justifyContent="space-between" mb={0.25}>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.secondary }}>Rx Share</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.text }}>28%</Typography>
                          </Stack>
                          <LinearProgress variant="determinate" value={28} sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.04)', '& .MuiLinearProgress-bar': { bgcolor: COLORS.primary } }} />
                        </Box>
                        <Box>
                          <Stack direction="row" justifyContent="space-between" mb={0.25}>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.secondary }}>Refills</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.text }}>7%</Typography>
                          </Stack>
                          <LinearProgress variant="determinate" value={7} sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.04)', '& .MuiLinearProgress-bar': { bgcolor: COLORS.green } }} />
                        </Box>
                      </Stack>
                    </Box>
                  </Grid>

                  {/* Right segment Line chart */}
                  <Grid item xs={12} sm={9}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, textAlign: 'right', fontWeight: 600 }}>
                      Daily revenue stream (masked LKR)
                    </Typography>
                    <RenderSVGLineChart data={revenuePreview} height={200} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Card 2: Toxicity Audit Layout - Catalog alert severity bar & Low stock table */}
            <Card sx={glassCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={sectionHeaderSx}>
                  <Warning fontSize="small" sx={{ color: 'error.main' }} /> Inventory Audit - Catalog Alerts Severity
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: COLORS.text, mb: 1 }}>
                      Overall Severity Limit
                    </Typography>
                    
                    {/* Severity color-segmented bar */}
                    <Box sx={{ mt: 1.5 }}>
                      <Box sx={{ display: 'flex', height: 16, borderRadius: 2, overflow: 'hidden', bgcolor: 'rgba(0,0,0,0.04)' }}>
                        {medicinesCatalogStats.outOfStock > 0 && (
                          <Box sx={{ width: `${(medicinesCatalogStats.outOfStock / (medicinesCatalog.length || 1)) * 100}%`, bgcolor: '#d32f2f' }} />
                        )}
                        {medicinesCatalogStats.lowStock > 0 && (
                          <Box sx={{ width: `${(medicinesCatalogStats.lowStock / (medicinesCatalog.length || 1)) * 100}%`, bgcolor: '#ed6c02' }} />
                        )}
                        {medicinesCatalogStats.healthy > 0 && (
                          <Box sx={{ width: `${(medicinesCatalogStats.healthy / (medicinesCatalog.length || 1)) * 100}%`, bgcolor: '#2e7d32' }} />
                        )}
                      </Box>
                      <Stack spacing={1} sx={{ mt: 2 }}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#d32f2f' }} /> Out of Stock
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>{medicinesCatalogStats.outOfStock} items</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ed6c02' }} /> Low Stock warning
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>{medicinesCatalogStats.lowStock} items</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#2e7d32' }} /> Stock Healthy
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>{medicinesCatalogStats.healthy} items</Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </Grid>

                  {/* Low Stock Items Table */}
                  <Grid item xs={12} sm={8}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: COLORS.text, mb: 1.5 }}>
                      Critical Restock List (Top Alerts)
                    </Typography>

                    {medicinesCatalogStats.criticalItems.length === 0 ? (
                      <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#fafafa', borderRadius: 2 }}>
                        <CheckCircle sx={{ color: 'success.main', fontSize: 32, mb: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }} color="text.secondary">All items fully stocked!</Typography>
                      </Box>
                    ) : (
                      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <Table size="small">
                          <TableHead sx={{ bgcolor: '#fdfdfd' }}>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Item</TableCell>
                              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Stock Left</TableCell>
                              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Alert Reason</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {medicinesCatalogStats.criticalItems.map((med, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.primary }}>{med.name}</Typography>
                                  <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.65rem' }}>Brand: {med.brand || 'Generic'}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Chip 
                                    label={`${med.packs} packs (${med.units} units)`} 
                                    size="small" 
                                    color={med.severity === 'high' ? 'error' : 'warning'}
                                    sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }}
                                  />
                                </TableCell>
                                <TableCell sx={{ fontSize: '0.7rem', color: COLORS.secondary }}>
                                  {med.reason}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Card 2b: Top Selling Products - Sales Share & Volumes */}
            <Card sx={glassCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={sectionHeaderSx}>
                  <ShoppingCart fontSize="small" sx={{ color: COLORS.teal }} /> Top Selling Products - Sales Share
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {(!currentData.topSelling || currentData.topSelling.length === 0 || currentData.topSelling[0].name === 'No sales') ? (
                  <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#fafafa', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">No sales recorded in this period</Typography>
                  </Box>
                ) : (
                  <Stack spacing={2.5}>
                    {currentData.topSelling.slice(0, 5).map((item, index) => {
                      const totalTopRevenue = currentData.topSelling.reduce((acc, x) => acc + x.revenue, 0) || 1;
                      const sharePct = Math.round((item.revenue / totalTopRevenue) * 100);
                      
                      return (
                        <Box key={index}>
                          <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Chip 
                                  label={`#${index + 1}`} 
                                  size="small" 
                                  sx={{ 
                                    height: 20, 
                                    fontWeight: 800, 
                                    bgcolor: index === 0 ? COLORS.teal : index === 1 ? COLORS.primary : 'rgba(0,0,0,0.06)',
                                    color: index <= 1 ? '#ffffff' : COLORS.text 
                                  }} 
                                />
                                <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.text }}>
                                  {item.name}
                                </Typography>
                              </Stack>
                            </Grid>
                            <Grid item xs={8} sm={5}>
                              <Stack direction="row" justifyContent="space-between" mb={0.25}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>
                                  Share of top 5
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.secondary }}>
                                  {sharePct}%
                                </Typography>
                              </Stack>
                              <LinearProgress 
                                variant="determinate" 
                                value={sharePct} 
                                sx={{ 
                                  height: 6, 
                                  borderRadius: 3, 
                                  bgcolor: 'rgba(0,0,0,0.04)', 
                                  '& .MuiLinearProgress-bar': { 
                                    bgcolor: index === 0 ? COLORS.teal : index === 1 ? COLORS.primary : COLORS.blue 
                                  } 
                                }} 
                              />
                            </Grid>
                            <Grid item xs={4} sm={3} sx={{ textAlign: 'right' }}>
                              <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.text, display: 'block' }}>
                                {formatCurrency(item.revenue)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                {item.quantity} units sold
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      );
                    })}
                  </Stack>
                )}
              </CardContent>
            </Card>

            {/* Card 3: User registrations growth trend */}
            <Card sx={glassCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={sectionHeaderSx}>
                  <PersonAddAlt1 fontSize="small" sx={{ color: COLORS.teal }} /> User registrations growth trend
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, fontWeight: 600 }}>
                  Daily new user registrations over the selected timeframe
                </Typography>

                <Box sx={{ height: 120, display: 'flex', gap: 0.75, alignItems: 'stretch' }}>
                  {growthPreview.map((item, index) => {
                    const value = item.newUsers ?? 0;
                    const maxUsers = Math.max(...growthPreview.map(g => g.newUsers ?? 0), 1);
                    const heightPct = (value / maxUsers) * 100;
                    return (
                      <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Tooltip title={`${item.period}: ${value} new users`}>
                          <Box
                            sx={{
                              width: '100%',
                              height: `${heightPct}%`,
                              bgcolor: COLORS.teal,
                              borderRadius: '2px 2px 0 0',
                              transition: 'height 0.3s',
                            }}
                          />
                        </Tooltip>
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* ================= RIGHT SIDEBAR ================= */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* Card 4: Site Audit equivalent - Store inventory health progress meter */}
            <Card sx={glassCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={sectionHeaderSx}>
                  <Speed fontSize="small" sx={{ color: COLORS.teal }} /> Store Audit - Inventory Health
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Stack spacing={3} alignItems="center">
                  {/* Big SVG circular progress gauge */}
                  <RenderCircularProgressRing 
                    value={storeHealthScore} 
                    title="INVENTORY HEALTH"
                    subtitle={`${storeHealthScore}% Stock OK`}
                    color={storeHealthScore > 90 ? 'success.main' : storeHealthScore > 75 ? 'warning.main' : 'error.main'}
                    size={100}
                  />

                  {/* Errors and Warnings panel */}
                  <Grid container spacing={1} sx={{ width: '100%', textAlign: 'center', mt: 1 }}>
                    <Grid item xs={6} sx={{ borderRight: `1px solid ${COLORS.border}` }}>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: 'error.main' }}>
                        {medicinesCatalogStats.outOfStock}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                        ERRORS (OUT STOCK)
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: 'warning.main' }}>
                        {medicinesCatalogStats.lowStock}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                        WARNINGS (LOW STOCK)
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Verification progress bar */}
                  <Box sx={{ width: '100%', pt: 1 }}>
                    <Stack direction="row" justifyContent="space-between" mb={0.5}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.secondary }}>Verified prescriptions</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.text }}>
                        {currentData.prescriptionsProcessed} items
                      </Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={verifiedRxRate} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.04)', '& .MuiLinearProgress-bar': { bgcolor: COLORS.teal } }} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Card 5: On Page SEO Checker equivalent - Segmented Categories Revenue */}
            <Card sx={glassCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={sectionHeaderSx}>
                  <Receipt fontSize="small" sx={{ color: COLORS.teal }} /> Contribution - Revenue Segment
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Stack spacing={2.5}>
                  {/* Visual segments representation */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 700, mb: 1 }}>
                      REVENUE BY PRODUCT TYPE:
                    </Typography>
                    {currentData.revenueByCategory.map((cat, index) => (
                      <Box key={index} sx={{ mb: 1.5 }}>
                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.primary }}>
                            {cat.category}
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.secondary }}>
                            {cat.percentage}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={cat.percentage}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: 'rgba(0,0,0,0.04)',
                            '& .MuiLinearProgress-bar': { bgcolor: index === 0 ? COLORS.teal : COLORS.primary }
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.25, fontSize: '0.68rem' }}>
                          Total sales: {formatCurrency(cat.revenue)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  
                  {/* Category volumes list */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 700, mb: 1 }}>
                      ORDER SEGMENTS BREAKDOWN:
                    </Typography>
                    <Stack spacing={1}>
                      {currentData.categoryBreakdown.map((item, index) => (
                        <Box key={index} sx={{ p: 1, borderRadius: 1.5, bgcolor: '#fafafa', border: '1px solid rgba(0,0,0,0.03)' }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.text }}>{item.category}</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.teal }}>
                              {item.sales} orders
                            </Typography>
                          </Stack>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', display: 'block' }}>
                            Sum total: {formatCurrency(item.revenue)}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Card 6: Operational Registry equivalents */}
            <Card sx={glassCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={sectionHeaderSx}>
                  <People fontSize="small" sx={{ color: COLORS.teal }} /> Operational registry totals
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#fafafa', border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.text }}>
                        {currentData.totalPatients || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                        Patients
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#fafafa', border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.text }}>
                        {currentData.totalCouriers || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                        Couriers
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#fafafa', border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.text }}>
                        {currentData.totalMedicines || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                        Catalog
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#fafafa', border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.text }}>
                        {currentData.totalInvoices || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                        Invoices
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

          </Grid>
          
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminAnalytics;
