import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  Container,
  Box,
  Paper,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Typography,
  Divider,
} from '@mui/material';
import {
  Assessment,
  Assignment,
  ShoppingCart,
  Description,
  Person,
  LocalShipping,
  Chat,
  AudioFile,
  BarChart as AnalyticsIcon,
  PointOfSale,
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  ArrowBack,
} from '@mui/icons-material';

import DashboardOverview from './DashboardOverview';
import PendingPrescriptions from './PendingPrescriptions';
import PrescriptionDetail from './PrescriptionDetail';
import ActiveOrders from './ActiveOrders';
import OrderPreparation from './OrderPreparation';
import InventoryManagement from './InventoryManagement';
import PatientDirectory from './PatientDirectory';
import PatientProfile from './PatientProfile';
import DeliveryAssignment from './DeliveryAssignment';
import ChatDashboard from './ChatDashboard';
import AudioInstructions from './AudioInstructions';
import PharmacistProfile from './PharmacistProfile';
import ManualOrderPlacement from './ManualOrderPlacement';
import PharmacistAnalytics from './PharmacistAnalytics';

const PharmacistDashboard = forwardRef((props, ref) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Expose navigation methods to parent (PharmacistPortal header dropdown)
  useImperativeHandle(ref, () => ({
    goToProfile: () => setActiveTab(9),
    goToTab: (n) => {
      setActiveTab(n);
      setSelectedPrescription(null);
      setSelectedOrder(null);
      setSelectedPatient(null);
    },
  }));

  const COLORS = {
    green1: '#ECF4E8',
    green2: '#CBF3BB',
    green3: '#ABE7B2',
    blue1: '#93BFC7',
    blue2: '#7AA8B0',
    text: '#1e293b',
    subtext: '#64748b',
    border: 'rgba(147, 191, 199, 0.2)',
  };

  const navItems = [
    { label: 'Overview', value: 0, icon: <Assessment /> },
    { label: 'Prescriptions', value: 1, icon: <Assignment /> },
    { label: 'Active Orders', value: 2, icon: <ShoppingCart /> },
    { label: 'Inventory', value: 3, icon: <Description /> },
    { label: 'Patients', value: 4, icon: <Person /> },
    { label: 'Delivery', value: 5, icon: <LocalShipping /> },
    { label: 'Chat', value: 6, icon: <Chat /> },
    { label: 'Analytics', value: 8, icon: <AnalyticsIcon /> },
    { label: 'New Order', value: 10, icon: <PointOfSale /> },
  ];

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    setSelectedPrescription(null);
    setSelectedOrder(null);
    setSelectedPatient(null);
    setMobileOpen(false);
  };

  const renderContent = () => {
    if (selectedPrescription) {
      return (
        <Box>
          <IconButton 
            onClick={() => setSelectedPrescription(null)} 
            sx={{ mb: 2, bgcolor: 'white', border: '1px solid rgba(0,0,0,0.05)' }}
          >
            <ArrowBack />
          </IconButton>
          <PrescriptionDetail
            prescription={selectedPrescription}
            open={!!selectedPrescription}
            onClose={() => setSelectedPrescription(null)}
            onUpdate={() => {
              // We do not close the detail view on updates (like adding/removing items).
              // Remounting PendingPrescriptions when selectedPrescription becomes null will auto-refresh the queue.
            }}
          />
        </Box>
      );
    }

    if (selectedOrder) {
      return (
        <OrderPreparation
          order={selectedOrder}
          onBack={() => setSelectedOrder(null)}
        />
      );
    }

    if (selectedPatient) {
      return (
        <PatientProfile
          patient={selectedPatient}
          onBack={() => setSelectedPatient(null)}
        />
      );
    }

    switch (activeTab) {
      case 0: return <DashboardOverview onNavigate={handleTabChange} />;
      case 1: return <PendingPrescriptions onSelectPrescription={setSelectedPrescription} />;
      case 2: return <ActiveOrders onSelectOrder={setSelectedOrder} />;
      case 3: return <InventoryManagement />;
      case 4: return <PatientDirectory onSelectPatient={setSelectedPatient} />;
      case 5: return <DeliveryAssignment />;
      case 6: return <ChatDashboard />;
      case 7: return <AudioInstructions />;
      case 8: return <PharmacistAnalytics />;
      case 9: return <PharmacistProfile />;
      case 10: return <ManualOrderPlacement />;
      default: return <DashboardOverview onNavigate={handleTabChange} />;
    }
  };

  const activeLabel = navItems.find((item) => item.value === activeTab)?.label || 'Profile';

  const sidebarWidth = sidebarCollapsed ? 76 : 260;

  const SidebarContent = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
      {/* Sidebar Header toggle button */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: sidebarCollapsed ? 'center' : 'space-between', 
        p: 2.5,
        borderBottom: `1px solid ${COLORS.border}`
      }}>
        {!sidebarCollapsed && (
          <Typography sx={{ fontWeight: 900, color: COLORS.text, fontSize: '0.9rem', letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Navigation
          </Typography>
        )}
        {!isMobile && (
          <IconButton 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            sx={{ color: COLORS.blue2, bgcolor: '#f8fafc', '&:hover': { bgcolor: COLORS.green1 } }}
          >
            {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        )}
      </Box>

      {/* Nav List */}
      <List sx={{ px: 1.5, py: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.8 }}>
        {navItems.map((item) => {
          const isSelected = activeTab === item.value;
          const button = (
            <ListItemButton
              onClick={() => handleTabChange(item.value)}
              sx={{
                minHeight: 48,
                borderRadius: 3,
                px: sidebarCollapsed ? 1.5 : 2,
                justifyContent: sidebarCollapsed ? 'center' : 'initial',
                bgcolor: isSelected ? COLORS.blue2 : 'transparent',
                color: isSelected ? 'white' : '#64748b',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: isSelected ? COLORS.blue2 : '#f1f5f9',
                  color: isSelected ? 'white' : COLORS.blue2,
                  '& .MuiListItemIcon-root': {
                    color: isSelected ? 'white' : COLORS.blue2,
                    transform: 'scale(1.05)',
                  }
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: sidebarCollapsed ? 0 : 36,
                  justifyContent: 'center',
                  color: isSelected ? 'white' : '#64748b',
                  transition: 'all 0.2s',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!sidebarCollapsed && (
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{
                    fontSize: '0.85rem',
                    fontWeight: isSelected ? 800 : 600,
                    letterSpacing: '-0.1px'
                  }}
                />
              )}
            </ListItemButton>
          );

          return (
            <ListItem key={item.value} disablePadding sx={{ display: 'block' }}>
              {sidebarCollapsed ? (
                <Tooltip title={item.label} placement="right" arrow>
                  {button}
                </Tooltip>
              ) : (
                button
              )}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* ── Desktop Sidebar ── */}
      {!isMobile && (
        <Paper
          elevation={0}
          sx={{
            width: sidebarWidth,
            flexShrink: 0,
            borderRight: `1px solid ${COLORS.border}`,
            bgcolor: 'white',
            borderRadius: 0,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <SidebarContent />
        </Paper>
      )}

      {/* ── Mobile Sliding Drawer ── */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: { width: 260, borderRight: 'none', boxShadow: '10px 0 30px rgba(0,0,0,0.05)' }
          }}
        >
          <SidebarContent />
        </Drawer>
      )}

      {/* ── Main Content Area ── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          p: { xs: 2.5, md: 4 },
          width: { md: `calc(100% - ${sidebarWidth}px)` },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {/* Mobile menu trigger top bar */}
        {isMobile && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: 'white',
              border: `1px solid ${COLORS.border}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <IconButton 
                edge="start" 
                onClick={() => setMobileOpen(true)}
                sx={{ color: COLORS.blue2, bgcolor: '#f1f5f9' }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, color: COLORS.text }}>
                {activeLabel}
              </Typography>
            </Stack>
          </Paper>
        )}

        <Box sx={{ 
          animation: 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(8px)' },
            to: { opacity: 1, transform: 'translateY(0)' }
          }
        }}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
});

export default PharmacistDashboard;
