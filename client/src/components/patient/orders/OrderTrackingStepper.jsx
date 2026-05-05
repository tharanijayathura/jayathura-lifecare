import React from 'react';
import { 
  Box, 
  Stepper, 
  Step, 
  StepLabel, 
  StepConnector, 
  Typography, 
  stepConnectorClasses,
  styled,
  Avatar,
  Stack
} from '@mui/material';
import { 
  Check, 
  LocalShipping, 
  Store, 
  ReceiptLong, 
  Home,
  PendingActions,
  FactCheck
} from '@mui/icons-material';

const COLORS = {
  green1: '#ECF4E8',
  green2: '#CBF3BB',
  green3: '#ABE7B2',
  blue1: '#93BFC7',
  blue2: '#7AA8B0',
  text: '#1e293b',
  subtext: '#64748b',
  border: 'rgba(147, 191, 199, 0.25)',
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient( 95deg, ${COLORS.blue2} 0%, ${COLORS.green3} 100%)`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient( 95deg, ${COLORS.blue2} 0%, ${COLORS.green3} 100%)`,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#e2e8f0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: '#f1f5f9',
  zIndex: 1,
  color: '#94a3b8',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'all 0.3s ease',
  ...(ownerState.active && {
    backgroundColor: COLORS.blue2,
    color: '#fff',
    boxShadow: '0 4px 15px rgba(122, 168, 176, 0.4)',
    transform: 'scale(1.1)',
  }),
  ...(ownerState.completed && {
    backgroundColor: COLORS.green3,
    color: '#1e293b',
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className, icon } = props;

  const icons = {
    1: <ReceiptLong />,
    2: <FactCheck />,
    3: <Store />,
    4: <LocalShipping />,
    5: <Home />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(icon)]}
    </ColorlibStepIconRoot>
  );
}

const steps = [
  { label: 'Placed', status: 'pending' },
  { label: 'Confirmed', status: 'confirmed' },
  { label: 'Processing', status: 'processing' },
  { label: 'Shipped', status: 'out_for_delivery' },
  { label: 'Delivered', status: 'delivered' },
];

const OrderTrackingStepper = ({ status, history = [] }) => {
  const getActiveStep = (status) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'processing': return 2;
      case 'ready': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const activeStep = getActiveStep(status);

  return (
    <Box sx={{ width: '100%', py: 4 }}>
      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              <Box sx={{ mt: 1 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 800, 
                    display: 'block',
                    color: index <= activeStep ? COLORS.text : COLORS.subtext,
                    fontSize: '0.75rem'
                  }}
                >
                  {step.label}
                </Typography>
                {history.find(h => h.status === step.status) && (
                  <Typography variant="caption" sx={{ fontSize: '0.65rem', color: COLORS.subtext, fontWeight: 500 }}>
                    {new Date(history.find(h => h.status === step.status).timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                )}
              </Box>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {history.length > 0 && (
        <Box sx={{ mt: 6, p: 3, borderRadius: 6, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 3, color: COLORS.text, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.7rem' }}>
            Tracking Timeline
          </Typography>
          <Stack spacing={0}>
            {history.slice().reverse().map((h, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 3, position: 'relative', pb: 3 }}>
                {i < history.length - 1 && (
                  <Box sx={{ position: 'absolute', left: 8, top: 20, bottom: -10, width: 2, bgcolor: '#e2e8f0' }} />
                )}
                <Box sx={{ 
                  width: 18, 
                  height: 18, 
                  borderRadius: '50%', 
                  bgcolor: i === 0 ? COLORS.green3 : '#e2e8f0', 
                  border: i === 0 ? `4px solid ${COLORS.green1}` : 'none',
                  zIndex: 1,
                  mt: 0.5
                }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 800, color: i === 0 ? COLORS.text : COLORS.subtext, fontSize: '0.9rem' }}>
                    {h.message || h.status.replace('_', ' ').toUpperCase()}
                  </Typography>
                  <Typography variant="caption" sx={{ color: COLORS.subtext, display: 'block', mt: 0.5 }}>
                    {h.location ? `${h.location} • ` : ''}{new Date(h.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default OrderTrackingStepper;
