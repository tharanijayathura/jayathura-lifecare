import React from 'react';
import { Card, CardContent, Tabs, Tab } from '@mui/material';
import { LocalPharmacy, ShoppingCart } from '@mui/icons-material';
import MedicineCatalog from '../MedicineCatalog.jsx';
import GroceryCatalog from '../GroceryCatalog.jsx';

const CatalogTabs = ({ catalogTab, setCatalogTab, onAddToCart }) => {
  return (
    <Card>
      <CardContent>
        <Tabs value={catalogTab} onChange={(e, newValue) => setCatalogTab(newValue)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tab label="Non Prescription Items" icon={<LocalPharmacy />} />
          <Tab label="Groceries" icon={<ShoppingCart />} />
        </Tabs>
        {catalogTab === 0 ? (
          <MedicineCatalog onAddToCart={onAddToCart} />
        ) : (
          <GroceryCatalog onAddToCart={onAddToCart} />
        )}
      </CardContent>
    </Card>
  );
};

export default CatalogTabs;
