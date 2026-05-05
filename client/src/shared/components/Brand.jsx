import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import symbolImage from '../../assets/medical-symbol.png';

const Brand = ({ size = 32, textVariant = 'h6', color = '#1e293b', gap = 1.5 }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={gap}>
      <Box 
        sx={{ 
          p: 0.5, 
          borderRadius: 3, 
          bgcolor: '#ECF4E8', 
          display: 'flex',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}
      >
        <Box 
          component="img" 
          src={symbolImage} 
          alt="Jayathura LifeCare" 
          sx={{ height: size, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' }} 
        />
      </Box>
      <Box>
        <Typography 
          variant={textVariant} 
          sx={{ 
            fontWeight: 900, 
            color,
            lineHeight: 1,
            letterSpacing: -0.5
          }}
        >
          Jayathura
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            fontWeight: 800, 
            color: '#93BFC7', 
            textTransform: 'uppercase', 
            letterSpacing: 1.5,
            display: 'block',
            mt: 0.2
          }}
        >
          LifeCare
        </Typography>
      </Box>
    </Stack>
  );
};

export default Brand;
