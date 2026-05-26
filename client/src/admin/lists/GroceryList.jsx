import React from 'react';
import { Box, Paper, Grid, Typography, Card, CardContent, CardMedia, Stack, IconButton, Button, Chip } from '@mui/material';
import { AddCircle, Edit, Delete } from '@mui/icons-material';
import ErrorIcon from '@mui/icons-material/Error';

const GroceryList = ({
  groceries,
  loading,
  handleEditGrocery,
  handleDeleteGrocery,
  handleClearAlert,
  isLowStock,
  isOutOfStock,
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        {/* CircularProgress in parent to avoid extra import */}
      </Box>
    );
  }

  return (
    <Grid container spacing={{ xs: 1.5, sm: 2 }}>
      {groceries.length === 0 ? (
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
            <AddCircle color="disabled" sx={{ fontSize: 48 }} />
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              No grocery items yet. Add your first item using the form.
            </Typography>
          </Paper>
        </Grid>
      ) : (
        groceries.map((grocery) => {
          const hasAlert = grocery.stockAlert?.isAlerted || isOutOfStock(grocery);
          const isLow = isLowStock(grocery);
          return (
            <Grid item xs={12} sm={6} md={4} key={grocery._id}>
              <Card sx={{ border: hasAlert ? '2px solid red' : isLow ? '2px solid orange' : '1px solid', borderColor: hasAlert ? 'error.main' : isLow ? 'warning.main' : 'divider', position: 'relative' }}>
                {hasAlert && (
                  <Box sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'error.main', color: 'white', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                    <ErrorIcon sx={{ fontSize: 16 }} />
                  </Box>
                )}
                {grocery.image && (
                  <CardMedia component="img" height="150" image={grocery.image} alt={grocery.name} sx={{ objectFit: 'cover' }} />
                )}
                <CardContent>
                  <Typography variant="h6">{grocery.name}</Typography>
                  <Typography variant="body2" sx={{ my: 1 }}>{grocery.description}</Typography>
                  <Box sx={{ my: 1 }}>
                    <Typography variant="subtitle1" color="primary">Rs. {grocery.price}</Typography>
                  </Box>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" gap={1}>
                    <Chip label={`${grocery.stock || 0} ${grocery.unit || 'item'}(s)`} size="small" color={isOutOfStock(grocery) ? 'error' : isLow ? 'warning' : 'default'} />
                    <Chip label={`Min: ${grocery.minStock || 0}`} size="small" variant="outlined" color="secondary" />
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button size="small" startIcon={<Edit />} onClick={() => handleEditGrocery(grocery)}>Edit</Button>
                    {hasAlert && (
                      <Button size="small" color="success" onClick={() => handleClearAlert(grocery._id, 'grocery')}>Clear Alert</Button>
                    )}
                    <IconButton color="error" size="small" onClick={() => handleDeleteGrocery(grocery._id)}>
                      <Delete />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })
      )}
    </Grid>
  );
};

export default GroceryList;
