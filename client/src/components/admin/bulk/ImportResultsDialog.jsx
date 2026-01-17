import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Alert, Typography } from '@mui/material';

const ImportResultsDialog = ({ open, results, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Import Results</DialogTitle>
      <DialogContent>
        {results && (
          <Box>
            {results.success.length > 0 && (
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Successfully imported ({results.success.length}):
                </Typography>
                {results.success.map((name, index) => (
                  <Typography key={index} variant="body2" component="div">
                    ✓ {name}
                  </Typography>
                ))}
              </Alert>
            )}
            {results.failed.length > 0 && (
              <Alert severity="error">
                <Typography variant="subtitle2" gutterBottom>
                  Failed to import ({results.failed.length}):
                </Typography>
                {results.failed.map((item, index) => (
                  <Typography key={index} variant="body2" component="div">
                    ✗ {item.name}: {item.error}
                  </Typography>
                ))}
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportResultsDialog;
