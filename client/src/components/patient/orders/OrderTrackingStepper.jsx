import React from 'react';
import { 
  Box, 
  Stepper, 
  Step, 
  StepLabel, 
  StepConnector, 
  Typography, 
  stepConnectorClasses,
  styled
} from '@mui/material';
import { 
  Check, 
  LocalShipping, 
  Store, 
  ReceiptLong, 
  Home
} from '@mui/icons-material';

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#ABE7B2',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#ABE7B2',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: '#7AA8B0',
  }),
  '& .QontoStepIcon-completedIcon': {
    color: '#ABE7B2',
    zIndex: 1,
    fontSize: 24,
  },
  '& .QontoStepIcon-circle': {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

const steps = [
  { label: 'Order Placed', icon: <ReceiptLong /> },
  { label: 'Confirmed', icon: <Check /> },
  { label: 'Processing', icon: <Store /> },
  { label: 'In Transit', icon: <LocalShipping /> },
  { label: 'Delivered', icon: <Home /> },
];

const OrderTrackingStepper = ({ status, history = [] }) => {
  const getActiveStep = (status) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'processing': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const activeStep = getActiveStep(status);

  return (
    <Box sx={{ width: '100%', py: 4 }}>
      <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel StepIconComponent={QontoStepIcon}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                  {step.label}
                </Typography>
                {history.find(h => h.status === step.label.toLowerCase().replace(' ', '_')) && (
                  <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>
                    {new Date(history.find(h => h.status === step.label.toLowerCase().replace(' ', '_')).timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                )}
              </Box>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {history.length > 0 && (
        <Box sx={{ mt: 4, px: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>Latest Activity</Typography>
          {history.slice().reverse().map((h, i) => (
            <Box key={i} sx={{ display: 'flex', mb: 2, borderLeft: i === 0 ? '2px solid #ABE7B2' : '2px solid #eaeaf0', pl: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{h.message || h.status.replace('_', ' ').toUpperCase()}</Typography>
                <Typography variant="caption" color="text.secondary">{h.location} • {new Date(h.timestamp).toLocaleString()}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default OrderTrackingStepper;
