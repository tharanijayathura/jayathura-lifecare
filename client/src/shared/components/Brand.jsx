import React from 'react';
import { Box, Typography } from '@mui/material';
import symbolImage from '../../assets/medical-symbol.png';

const Brand = ({ size = 28, textVariant = 'h6', color = '#2C3E50', gap = 1 }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap }}>
      <Box component="img" src={symbolImage} alt="Jayathura LifeCare" sx={{ height: size }} />
      <Typography variant={textVariant} sx={{ fontWeight: 700, color }}>
        Jayathura LifeCare
      </Typography>
    </Box>
  );
};

export default Brand;
