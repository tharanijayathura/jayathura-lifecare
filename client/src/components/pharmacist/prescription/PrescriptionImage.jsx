import React from 'react';
import { Paper, Typography, Box, Button, Stack, Divider, List, ListItem, ListItemText, Chip } from '@mui/material';
import { OpenInNew, Description, History } from '@mui/icons-material';
import { getPublicFileUrl } from '../../../services/api';

const PrescriptionImage = ({ prescription }) => {
  const fileUrl = getPublicFileUrl(prescription.imageUrl);
  const isPdf = prescription.mimeType === 'application/pdf' || (prescription.imageUrl || '').toLowerCase().endsWith('.pdf');
  const activities = Array.isArray(prescription.activities) ? prescription.activities : [];

  const COLORS = {
    green1: '#ECF4E8',
    green2: '#CBF3BB',
    green3: '#ABE7B2',
    blue1: '#93BFC7',
    blue2: '#7AA8B0',
    text: '#1e293b',
    subtext: '#64748b',
    border: 'rgba(147, 191, 199, 0.25)',
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: `1px solid ${COLORS.border}`, bgcolor: 'white' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 900, color: COLORS.text, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Description sx={{ color: COLORS.blue2 }} /> Source Document
        </Typography>
        {fileUrl && (
          <Button 
            component="a" 
            href={fileUrl} 
            target="_blank" 
            rel="noreferrer" 
            size="small" 
            startIcon={<OpenInNew />}
            sx={{ borderRadius: 2, fontWeight: 700, color: COLORS.blue2 }}
          >
            Fullscreen
          </Button>
        )}
      </Stack>

      <Box sx={{ 
        textAlign: 'center', 
        p: 1, 
        bgcolor: '#f8fafc', 
        borderRadius: 5, 
        border: '1px solid #f1f5f9',
        overflow: 'hidden',
        minHeight: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {isPdf ? (
          <Box
            component="iframe"
            src={fileUrl}
            title="Prescription PDF"
            sx={{ width: '100%', height: 450, border: 0 }}
          />
        ) : (
          <Box
            component="img"
            src={fileUrl}
            alt="Prescription"
            sx={{ maxWidth: '100%', maxHeight: 450, objectFit: 'contain', borderRadius: 2 }}
          />
        )}
      </Box>

      <Box sx={{ mt: 3 }}>
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ color: COLORS.subtext, fontWeight: 600 }}>FILE NAME</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>{prescription.originalName || 'upload_file.jpg'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ color: COLORS.subtext, fontWeight: 600 }}>UPLOAD DATE</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>{new Date(prescription.createdAt).toLocaleString()}</Typography>
          </Box>
        </Stack>

        {activities.length > 0 && (
          <>
            <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
            <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: COLORS.blue2, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <History fontSize="small" /> ACTIVITY LOG
            </Typography>
            <List dense disablePadding>
              {activities.slice(0, 3).map((activity, index) => (
                <ListItem key={index} disableGutters sx={{ py: 1, px: 2, mb: 1, bgcolor: '#f8fafc', borderRadius: 3 }}>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: COLORS.text, textTransform: 'capitalize' }}>
                        {activity.type.replace(/-/g, ' ')}
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.subtext }}>
                        {activity.note} • {new Date(activity.createdAt).toLocaleTimeString()}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default PrescriptionImage;
