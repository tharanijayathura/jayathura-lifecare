import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  FormControlLabel,
  Switch,
  Tooltip,
  Chip,
  Stack,
} from '@mui/material';
import { Delete, ShoppingCart as CartIcon } from '@mui/icons-material';

const ShoppingCart = ({ cartItems, onRemoveItem, onSubmitOrder, latestPrescription }) => {
  const [attachPrescription, setAttachPrescription] = useState(false);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (!latestPrescription) {
      setAttachPrescription(false);
    }
  }, [latestPrescription]);

  const handleRemoveItem = (index) => {
    onRemoveItem(index);
  };

  const handleSendToPharmacist = () => {
    onSubmitOrder?.({
      attachPrescription: attachPrescription && !!latestPrescription,
    });
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CartIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Shopping Cart</Typography>
        </Box>

        {cartItems.length === 0 ? (
          <Typography color="text.secondary" textAlign="center">
            Your cart is empty
          </Typography>
        ) : (
          <>
            <List>
              {cartItems.map((item, index) => (
                <ListItem key={`${item.itemId}-${index}`} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={item.image}
                      alt={item.name}
                      sx={{ width: 48, height: 48 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle1">{item.name}</Typography>
                        <Chip label={item.itemType} size="small" color="info" />
                      </Stack>
                    }
                    secondary={`Qty: ${item.quantity} × Rs. ${item.price} (${item.unit})`}
                  />
                  <ListItemSecondaryAction>
                    <Typography variant="subtitle2" sx={{ mr: 2 }}>
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </Typography>
                    <IconButton edge="end" onClick={() => handleRemoveItem(index)} color="error">
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">Rs. {totalAmount.toFixed(2)}</Typography>
            </Box>

            <Tooltip
              title={
                latestPrescription ? 'Attach the most recent prescription to this request' : 'Upload a prescription first'
              }
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={attachPrescription && !!latestPrescription}
                    onChange={(e) => setAttachPrescription(e.target.checked)}
                    disabled={!latestPrescription}
                  />
                }
                label={
                  latestPrescription
                    ? `Attach prescription (${latestPrescription.fileName || latestPrescription.id})`
                    : 'No prescription available'
                }
              />
            </Tooltip>

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleSendToPharmacist}
              disabled={cartItems.length === 0}
            >
              Send to Pharmacist
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ShoppingCart;
