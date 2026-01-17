import React from 'react';
import { Box, Paper, Grid, TextField, InputAdornment, IconButton, Chip, Typography, Button, Card, CardContent, CardMedia, Stack } from '@mui/material';
import { Search, Clear, Edit, Delete } from '@mui/icons-material';

const GroceryList = ({
  groceries,
  filteredGroceries,
  setSearchTerm,
  searchTerm,
  loading,
  handleEdit,
  handleDelete,
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        {/* CircularProgress in parent to avoid extra import */}
      </Box>
    );
  }

  const totalGroceries = groceries.length;

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search groceries by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <Clear fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              {searchTerm && (
                <Chip label={`Search: "${searchTerm}"`} onDelete={() => setSearchTerm('')} color="secondary" variant="outlined" size="small" />
              )}
              <Chip label={`Total: ${totalGroceries}`} color="primary" variant="outlined" size="small" />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {filteredGroceries.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            Showing <strong>{filteredGroceries.length}</strong> of <strong>{totalGroceries}</strong> items
          </Typography>
          {searchTerm && (
            <Button size="small" onClick={() => setSearchTerm('')} startIcon={<Clear />}>Clear Search</Button>
          )}
        </Box>
      )}

      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
        {filteredGroceries.length === 0 ? (
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
              <Search sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No groceries found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                Try adjusting your search
              </Typography>
              {searchTerm && (
                <Button variant="outlined" onClick={() => setSearchTerm('')} startIcon={<Clear />}>Clear Search</Button>
              )}
            </Paper>
          </Grid>
        ) : (
          filteredGroceries.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card>
                {item.image && (
                  <CardMedia component="img" height="150" image={item.image} alt={item.name} sx={{ objectFit: 'cover' }} />
                )}
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6">{item.name}</Typography>
                    <Chip label={`Rs. ${item.price}`} size="small" color="primary" />
                  </Stack>
                  <Typography variant="body2" sx={{ my: 1 }}>{item.description}</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button size="small" startIcon={<Edit />} onClick={() => handleEdit(item)}>Edit</Button>
                    <IconButton color="error" size="small" onClick={() => handleDelete(item._id)}>
                      <Delete />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default GroceryList;
