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

const PharmacistDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const tabs = [
    { label: 'Dashboard', value: 0 },
    { label: 'Prescriptions', value: 1 },
    { label: 'Orders', value: 2 },
    { label: 'Inventory', value: 3 },
    { label: 'Low Stock', value: 4 },
    { label: 'Patients', value: 5 },
    { label: 'Delivery', value: 6 },
    { label: 'Chat', value: 7 },
    { label: 'Audio Instructions', value: 8 },
    { label: 'Reports', value: 9 },
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
        return <InventoryManagement />;
      case 4:
        return <LowStockAlerts />;
      case 5:
        return (
          <PatientDirectory
            onSelectPatient={setSelectedPatient}
          />
        );
      case 6:
        return <DeliveryAssignment />;
      case 7:
        return <ChatDashboard />;
      case 8:
        return <AudioInstructions />;
      case 9:
        return <DailyReport />;
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
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons={isMobile ? 'auto' : false}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: 3,
            '& .MuiTab-root': {
              fontSize: { xs: '0.7rem', sm: '0.875rem', md: '0.9rem' },
              minWidth: { xs: 80, sm: 100 },
              px: { xs: 1, sm: 2 },
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>

        <Box>{renderContent()}</Box>
      </Paper>
    </Container>
  );
};

export default PharmacistDashboard;

