import React from 'react';
import { Card, CardContent, Box, Typography, Chip } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const StatCard = ({ icon, title, value, subtitle, trend, color = 'primary' }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}.light`, color: `${color}.main` }}>{icon}</Box>
        {typeof trend === 'number' && (
          <Chip icon={trend > 0 ? <TrendingUp /> : <TrendingDown />} label={`${trend > 0 ? '+' : ''}${trend}%`} size="small" color={trend > 0 ? 'success' : 'error'} sx={{ fontSize: '0.75rem' }} />
        )}
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>{value}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>{title}</Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>{subtitle}</Typography>
      )}
    </CardContent>
  </Card>
);

export default StatCard;
