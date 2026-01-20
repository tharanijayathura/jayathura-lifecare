import React from 'react';
import { Card, CardContent, Tabs, Tab } from '@mui/material';
import { LocalPharmacy, Favorite } from '@mui/icons-material';
import MedicineCatalog from '../MedicineCatalog.jsx';

const CatalogTabs = ({ catalogTab, setCatalogTab, onAddToCart }) => {
  return (
    <Card>
      <CardContent>
        <Tabs value={catalogTab} onChange={(e, newValue) => setCatalogTab(newValue)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tab label="Non Prescription Items" icon={<LocalPharmacy />} />
          <Tab label="Frequently Used Items" icon={<Favorite />} />
        </Tabs>
        {catalogTab === 0 ? (
          <MedicineCatalog onAddToCart={onAddToCart} />
        ) : (
          <MedicineCatalog
            onAddToCart={onAddToCart}
            filterFrequentlyUsed={true}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CatalogTabs;
