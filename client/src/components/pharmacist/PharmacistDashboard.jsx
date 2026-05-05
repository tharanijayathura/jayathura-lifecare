import React, { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DashboardOverview from './DashboardOverview';
import PendingPrescriptions from './PendingPrescriptions';
import PrescriptionDetail from './PrescriptionDetail';
import ActiveOrders from './ActiveOrders';
import OrderPreparation from './OrderPreparation';
import InventoryManagement from './InventoryManagement';
import LowStockAlerts from './LowStockAlerts';
import PatientDirectory from './PatientDirectory';
import PatientProfile from './PatientProfile';
import DeliveryAssignment from './DeliveryAssignment';
import ChatDashboard from './ChatDashboard';
import DailyReport from './DailyReport';
import AudioInstructions from './AudioInstructions';
import PharmacistProfile from './PharmacistProfile';
import ManualOrderPlacement from './ManualOrderPlacement';

import {
  Assessment,
  Assignment,
  ShoppingCart,
  Description,
  Person,
  LocalShipping,
  Chat,
  AudioFile,
  BarChart as DailyReportIcon,
  PointOfSale
} from '@mui/icons-material';

const PharmacistDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const tabs = [
    { label: 'Overview', value: 0, icon: <Assessment /> },
    { label: 'Prescriptions', value: 1, icon: <Assignment /> },
    { label: 'Active Orders', value: 2, icon: <ShoppingCart /> },
    { label: 'Inventory', value: 3, icon: <Description /> },
    { label: 'Patients', value: 4, icon: <Person /> },
    { label: 'Delivery', value: 5, icon: <LocalShipping /> },
    { label: 'Chat', value: 6, icon: <Chat /> },
    { label: 'Audio Guides', value: 7, icon: <AudioFile /> },
    { label: 'Reports', value: 8, icon: <DailyReportIcon /> },
    { label: 'New Order', value: 10, icon: <PointOfSale /> },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue !== 1) setSelectedPrescription(null);
    if (newValue !== 2) setSelectedOrder(null);
    if (newValue !== 5) setSelectedPatient(null);
  };

  const renderContent = () => {
    if (selectedPrescription) {
      return (
        <PrescriptionDetail
          prescription={selectedPrescription}
          open={!!selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
          onUpdate={() => setSelectedPrescription(null)}
        />
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
      case 0: return <DashboardOverview />;
      case 1: return <PendingPrescriptions onSelectPrescription={setSelectedPrescription} />;
      case 2: return <ActiveOrders onSelectOrder={setSelectedOrder} />;
      case 3: return <InventoryManagement showLowStockSection={true} />;
      case 4: return <PatientDirectory onSelectPatient={setSelectedPatient} />;
      case 5: return <DeliveryAssignment />;
      case 6: return <ChatDashboard />;
      case 7: return <AudioInstructions />;
      case 8: return <DailyReport />;
      case 9: return <PharmacistProfile />;
      case 10: return <ManualOrderPlacement />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f8fafc',
      pt: { xs: 2, md: 4 },
      pb: 8
    }}>
      <Container maxWidth="xl">
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 1, md: 2 }, 
            borderRadius: 6, 
            bgcolor: 'white',
            border: '1px solid rgba(147, 191, 199, 0.2)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
            mb: 4
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 1,
              '& .MuiTabs-indicator': { display: 'none' },
              '& .MuiTabs-flexContainer': { gap: 1.5 },
              '& .MuiTab-root': {
                minHeight: 52,
                borderRadius: 4,
                px: 3,
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#64748b',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#f1f5f9',
                  color: '#7AA8B0'
                },
                '&.Mui-selected': {
                  bgcolor: '#7AA8B0',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(122, 168, 176, 0.3)'
                }
              }
            }}
          >
            {tabs.map((tab) => (
              <Tab 
                key={tab.value} 
                label={tab.label} 
                icon={tab.icon} 
                iconPosition="start" 
                value={tab.value}
                sx={{ minWidth: 'auto' }}
              />
            ))}
          </Tabs>
        </Paper>

        <Box sx={{ 
          animation: 'fadeIn 0.5s ease-out',
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(10px)' },
            to: { opacity: 1, transform: 'translateY(0)' }
          }
        }}>
          {renderContent()}
        </Box>
      </Container>
    </Box>
  );
};

export default PharmacistDashboard;

