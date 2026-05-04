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
    { label: 'Dashboard', value: 0, icon: <Assessment fontSize="small" /> },
    { label: 'Prescriptions', value: 1, icon: <Assignment fontSize="small" /> },
    { label: 'Orders', value: 2, icon: <ShoppingCart fontSize="small" /> },
    { label: 'Inventory', value: 3, icon: <Description fontSize="small" /> },
    { label: 'Patients', value: 4, icon: <Person fontSize="small" /> },
    { label: 'Delivery', value: 5, icon: <LocalShipping fontSize="small" /> },
    { label: 'Chat', value: 6, icon: <Chat fontSize="small" /> },
    { label: 'Instructions', value: 7, icon: <AudioFile fontSize="small" /> },
    { label: 'Reports', value: 8, icon: <DailyReportIcon fontSize="small" /> },
    { label: 'Profile', value: 9, icon: <Person fontSize="small" /> },
    { label: 'New Order', value: 10, icon: <PointOfSale fontSize="small" /> },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Reset selections when switching tabs
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
          onUpdate={() => {
            // Refresh prescriptions list if needed
            setSelectedPrescription(null);
          }}
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
      case 0:
        return <DashboardOverview />;
      case 1:
        return (
          <PendingPrescriptions
            onSelectPrescription={setSelectedPrescription}
          />
        );
      case 2:
        return (
          <ActiveOrders
            onSelectOrder={setSelectedOrder}
          />
        );
      case 3:
        return <InventoryManagement showLowStockSection={true} />;
      case 4:
        return (
          <PatientDirectory
            onSelectPatient={setSelectedPatient}
          />
        );
      case 5:
        return <DeliveryAssignment />;
      case 6:
        return <ChatDashboard />;
      case 7:
        return <AudioInstructions />;
      case 8:
        return <DailyReport />;
      case 9:
        return <PharmacistProfile />;
      case 10:
        return <ManualOrderPlacement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, px: { xs: 1, sm: 2 } }}>
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons={isMobile ? 'auto' : false}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: 4,
            '& .MuiTab-root': {
              minHeight: 72,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: 'text.secondary',
              '&.Mui-selected': {
                color: '#7AA8B0',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#7AA8B0',
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} iconPosition="top" value={tab.value} />
          ))}
        </Tabs>

        <Box>{renderContent()}</Box>
      </Paper>
    </Container>
  );
};

export default PharmacistDashboard;

