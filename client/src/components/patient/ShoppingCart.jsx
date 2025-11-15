import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import { Delete, ShoppingCart as CartIcon } from '@mui/icons-material';

const ShoppingCart = ({ cartItems, onRemoveItem, onCheckout }) => {
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Function 9: removeItem
  const handleRemoveItem = (index) => {
    onRemoveItem(index);
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CartIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Shopping Cart (Function 8 & 9)</Typography>
        </Box>

        {cartItems.length === 0 ? (
          <Typography color="text.secondary" textAlign="center">
            Your cart is empty
          </Typography>
        ) : (
          <>
            <List>
              {cartItems.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={item.medicineName}
                    secondary={`Qty: ${item.quantity} × Rs. ${item.price}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      onClick={() => handleRemoveItem(index)}
                      color="error"
                    >
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

            <Button
              fullWidth
              variant="contained"
              onClick={onCheckout}
            >
              Proceed to Checkout
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ShoppingCart;