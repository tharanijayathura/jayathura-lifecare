// client/src/components/common/PageHeader.jsx
import React from 'react';
import { Box, IconButton, Typography, Button } from '@mui/material';
import { ArrowBack, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PageHeader = ({ title, subtitle, showBack = true, showHome = true, backPath }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1); // Go back in history
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mb: 3,
        flexWrap: 'wrap',
      }}
    >
      {(showBack || showHome) && (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {showBack && (
            <IconButton
              onClick={handleBack}
              sx={{
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': { bgcolor: 'primary.light' },
              }}
              aria-label="go back"
            >
              <ArrowBack />
            </IconButton>
          )}
          {showHome && (
            <IconButton
              onClick={() => navigate('/')}
              sx={{
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': { bgcolor: 'primary.light' },
              }}
              aria-label="go home"
            >
              <Home />
            </IconButton>
          )}
        </Box>
      )}
      <Box sx={{ flexGrow: 1 }}>
        {title && (
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader;

