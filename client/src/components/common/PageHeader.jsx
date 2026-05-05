// client/src/components/common/PageHeader.jsx
import React from 'react';
import { Box, IconButton, Typography, Stack, useTheme, useMediaQuery } from '@mui/material';
import { ArrowBack, Home, CalendarToday } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PageHeader = ({ title, subtitle, showBack = true, showHome = true, backPath }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const COLORS = {
    primary: '#1e293b',
    secondary: '#93BFC7',
    border: 'rgba(147, 191, 199, 0.2)',
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: { xs: 3, md: 4 },
        py: 2,
        px: { xs: 1, md: 0 },
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
        {(showBack || showHome) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {showBack && (
              <IconButton
                onClick={handleBack}
                size="small"
                sx={{ 
                  bgcolor: 'white', 
                  border: `1px solid ${COLORS.border}`,
                  padding: '6px',
                  '&:hover': { bgcolor: '#f8fafc', borderColor: COLORS.secondary } 
                }}
              >
                <ArrowBack sx={{ fontSize: 18, color: COLORS.primary }} />
              </IconButton>
            )}
            {showHome && (
              <IconButton
                onClick={() => navigate('/')}
                size="small"
                sx={{ 
                  bgcolor: 'white', 
                  border: `1px solid ${COLORS.border}`,
                  padding: '6px',
                  '&:hover': { bgcolor: '#f8fafc', borderColor: COLORS.secondary } 
                }}
              >
                <Home sx={{ fontSize: 18, color: COLORS.primary }} />
              </IconButton>
            )}
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 850, 
              color: COLORS.primary, 
              lineHeight: 1,
              letterSpacing: '-0.01em',
              fontSize: { xs: '1rem', md: '1.15rem' }
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#64748b', 
                fontWeight: 600,
                mt: 0.5,
                lineHeight: 1
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      {!isMobile && (
        <Box sx={{ 
          px: 2, 
          py: 0.75,
          borderRadius: '10px', 
          bgcolor: '#f8fafc',
          border: `1px solid ${COLORS.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <CalendarToday sx={{ fontSize: 13, color: COLORS.secondary }} />
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', letterSpacing: 0.5 }}>
            {currentDate.toUpperCase()}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PageHeader;
