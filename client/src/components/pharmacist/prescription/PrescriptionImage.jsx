import React from 'react';
import { Card, CardContent, Typography, Box, Alert, Button, Stack, Divider, List, ListItem, ListItemText } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import { getPublicFileUrl } from '../../../services/api';

const PrescriptionImage = ({ prescription }) => {
  const fileUrl = getPublicFileUrl(prescription.imageUrl);
  const isPdf = prescription.mimeType === 'application/pdf' || (prescription.imageUrl || '').toLowerCase().endsWith('.pdf');
  const activities = Array.isArray(prescription.activities) ? prescription.activities : [];

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 1 }}>
          <Typography variant="h6">Prescription {isPdf ? 'Document' : 'Image'}</Typography>
          {fileUrl && (
            <Button component="a" href={fileUrl} target="_blank" rel="noreferrer" size="small" startIcon={<OpenInNew />}>
              Open
            </Button>
          )}
        </Stack>
        <Box sx={{ textAlign: 'center', p: 2 }}>
          {isPdf ? (
            <Box
              component="iframe"
              src={fileUrl}
              title="Prescription PDF"
              sx={{ width: '100%', height: 420, border: '1px solid #ddd', borderRadius: 1 }}
            />
          ) : (
            <Box
              component="img"
              src={fileUrl}
              alt="Prescription"
              sx={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain', border: '1px solid #ddd', borderRadius: 1 }}
            />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Patient: {prescription.patientId?.name || 'N/A'}
        </Typography>
        {prescription.originalName && (
          <Typography variant="body2" color="text.secondary">
            File: {prescription.originalName}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          Submitted: {new Date(prescription.createdAt).toLocaleString()}
        </Typography>
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            View the prescription {isPdf ? 'document' : 'image'} and manually select medicines. The patient can also add OTC items to this order.
          </Typography>
        </Alert>
        {activities.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Prescription Activity
            </Typography>
            <List dense disablePadding>
              {activities.map((activity, index) => (
                <ListItem key={`${activity.type}-${activity.createdAt || index}`} disableGutters sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={activity.type.replace(/-/g, ' ')}
                    secondary={`${activity.note || 'No details'}${activity.createdAt ? ` • ${new Date(activity.createdAt).toLocaleString()}` : ''}`}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PrescriptionImage;
