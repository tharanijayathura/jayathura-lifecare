import React, { createContext, useContext, useMemo, useState } from 'react';

const CatalogContext = createContext(null);

const STORAGE_KEYS = {
  medicines: 'lifecare_medicines',
  groceries: 'lifecare_groceries',
};

const defaultMedicines = [
  {
    id: 'med-panadol-500',
    name: 'Panadol 500mg',
    brand: 'GSK',
    category: 'otc',
    description: 'Fast acting pain relief tablet for fever and headaches.',
    price: 50,
    unit: 'tablet',
    stock: 120,
    requiresPrescription: false,
    isActive: true,
    image:
      'https://images.unsplash.com/photo-1580281780460-82d277b0fb12?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'med-vitc-1000',
    name: 'Vitamin C 1000mg',
    brand: 'Cee',
    category: 'vitamins',
    description: 'Immune support supplement for daily wellness.',
    price: 45,
    unit: 'tablet',
    stock: 80,
    requiresPrescription: false,
    isActive: true,
    image:
      'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'med-siddhalepa',
    name: 'Siddhalepa Balm',
    brand: 'Siddhalepa',
    category: 'herbal',
    description: 'Ayurvedic balm for muscle aches, colds, and congestion.',
    price: 120,
    unit: 'jar',
    stock: 55,
    requiresPrescription: false,
    isActive: true,
    image:
      'https://images.unsplash.com/photo-1509803874385-db7c23652552?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'med-vicks-inhaler',
    name: 'Vicks Inhaler',
    brand: 'Vicks',
    category: 'non-medical',
    description: 'Portable nasal inhaler for fast relief from stuffy noses.',
    price: 150,
    unit: 'inhaler',
    stock: 65,
    requiresPrescription: false,
    isActive: true,
    image:
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80',
  },
];

const defaultGroceries = [
  {
    id: 'gro-horlicks',
    name: 'Horlicks Malt Drink',
    description: 'Classic malt drink mix – 400g pack.',
    price: 870,
    unit: 'pack',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'gro-glucose',
    name: 'Glucose-D',
    description: 'Instant energy drink powder – 500g.',
    price: 540,
    unit: 'pack',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=600&q=80',
  },
];

const readFromStorage = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.warn('Failed to read catalog data:', error);
    return fallback;
  }
};

const writeToStorage = (key, data) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to persist catalog data:', error);
  }
};

const makeId = (prefix) => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

export const CatalogProvider = ({ children }) => {
  const [medicines, setMedicines] = useState(() =>
    readFromStorage(STORAGE_KEYS.medicines, defaultMedicines),
  );
  const [groceries, setGroceries] = useState(() =>
    readFromStorage(STORAGE_KEYS.groceries, defaultGroceries),
  );

  const addMedicine = (data) => {
    const newMedicine = {
      ...data,
      id: makeId('med'),
      isActive: data.isActive ?? true,
      stock: Number(data.stock ?? 0),
      price: Number(data.price ?? 0),
      requiresPrescription: Boolean(data.requiresPrescription),
    };
    setMedicines((prev) => {
      const next = [...prev, newMedicine];
      writeToStorage(STORAGE_KEYS.medicines, next);
      return next;
    });
  };

  const updateMedicine = (id, updates) => {
    setMedicines((prev) => {
      const next = prev.map((medicine) =>
        medicine.id === id
          ? {
              ...medicine,
              ...updates,
              price: updates.price !== undefined ? Number(updates.price) : medicine.price,
              stock: updates.stock !== undefined ? Number(updates.stock) : medicine.stock,
              requiresPrescription:
                updates.requiresPrescription !== undefined
                  ? Boolean(updates.requiresPrescription)
                  : medicine.requiresPrescription,
            }
          : medicine,
      );
      writeToStorage(STORAGE_KEYS.medicines, next);
      return next;
    });
  };

  const removeMedicine = (id) => {
    setMedicines((prev) => {
      const next = prev.filter((medicine) => medicine.id !== id);
      writeToStorage(STORAGE_KEYS.medicines, next);
      return next;
    });
  };

  const addGrocery = (data) => {
    const newGrocery = {
      ...data,
      id: makeId('gro'),
      stock: Number(data.stock ?? 0),
      price: Number(data.price ?? 0),
    };
    setGroceries((prev) => {
      const next = [...prev, newGrocery];
      writeToStorage(STORAGE_KEYS.groceries, next);
      return next;
    });
  };

  const updateGrocery = (id, updates) => {
    setGroceries((prev) => {
      const next = prev.map((grocery) =>
        grocery.id === id
          ? {
              ...grocery,
              ...updates,
              price: updates.price !== undefined ? Number(updates.price) : grocery.price,
              stock: updates.stock !== undefined ? Number(updates.stock) : grocery.stock,
            }
          : grocery,
      );
      writeToStorage(STORAGE_KEYS.groceries, next);
      return next;
    });
  };

  const removeGrocery = (id) => {
    setGroceries((prev) => {
      const next = prev.filter((grocery) => grocery.id !== id);
      writeToStorage(STORAGE_KEYS.groceries, next);
      return next;
    });
  };

  const value = useMemo(
    () => ({
      medicines,
      groceries,
      addMedicine,
      updateMedicine,
      removeMedicine,
      addGrocery,
      updateGrocery,
      removeGrocery,
    }),
    [medicines, groceries],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
};

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
};

