import React from 'react';
import { Grid, Card, Typography } from '@mui/material';
import MedicineCard from './MedicineCard';

const MedicineGrid = ({ filteredMedicines, onAddToCart, searchTerm, loading }) => {
  return (
    <Grid container spacing={3}>
      {filteredMedicines.map((medicine) => {
        const medicineId = medicine._id?.toString() || medicine.id?.toString() || Math.random().toString();
        return (
          <Grid item xs={12} sm={6} md={4} key={medicineId}>
            <MedicineCard medicine={medicine} onAdd={onAddToCart} />
          </Grid>
        );
      })}
      {!loading && filteredMedicines.length === 0 ? (
        <Grid item xs={12}>
          <Card sx={{ mt: 4, p: 4, textAlign: 'center', width: '100%' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchTerm ? 'No medicines found' : 'No medicines available'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try different keywords or browse all categories.' : 'Please check back later or contact support.'}
            </Typography>
          </Card>
        </Grid>
      ) : null}
    </Grid>
  );
};

export default MedicineGrid;
