// Admin constants and initial form states

export const MEDICINE_CATEGORY_GROUPS = [
  {
    groupName: 'Medicines',
    categories: [
      { value: 'prescription', label: 'Prescription (Rx)' },
      { value: 'otc', label: 'Over-the-Counter (OTC)' },
      { value: 'herbal', label: 'Herbal & Ayurvedic' },
    ]
  },
  {
    groupName: 'Health & Wellness',
    categories: [
      { value: 'vitamins', label: 'Vitamins & Supplements' },
      { value: 'personal-care', label: 'Personal Care & Hygiene' },
      { value: 'baby-care', label: 'Baby & Infant Care' },
    ]
  },
  {
    groupName: 'Medical Equipment',
    categories: [
      { value: 'medical-devices', label: 'Medical Devices & Equipment' },
      { value: 'first-aid', label: 'First Aid & Emergency' },
    ]
  }
];

export const MEDICINE_CATEGORIES = MEDICINE_CATEGORY_GROUPS.flatMap(group => group.categories);

export const BASE_UNITS = [
  { value: 'tablet', label: 'Tablet' },
  { value: 'capsule', label: 'Capsule' },
  { value: 'ml', label: 'Milliliter (ml)' },
  { value: 'gram', label: 'Gram (g)' },
  { value: 'piece', label: 'Piece' },
];

export const PACKAGING_TYPES = [
  { value: 'blister', label: 'Blister' },
  { value: 'card', label: 'Card' },
  { value: 'bottle', label: 'Bottle' },
  { value: 'tube', label: 'Tube' },
  { value: 'box', label: 'Box' },
  { value: 'sachet', label: 'Sachet' },
  { value: 'unit', label: 'Unit' },
];

export const initialMedicineForm = {
  name: '',
  brand: '',
  category: 'otc',
  description: '',
  baseUnit: 'tablet',
  packaging: {
    type: 'unit',
    qtyPerPack: 1,
    packName: '',
  },
  price: {
    perPack: '',
  },
  stock: {
    packs: '',
  },
  minStockUnits: 10,
  requiresPrescription: false,
  image: null,
  imageUrl: '',
};

export const initialGroceryForm = {
  name: '',
  description: '',
  price: '',
  unit: 'item',
  stock: '',
  minStock: '10',
  image: null,
  imageUrl: '',
};

export const MEDICINE_TEMPLATES = [
  {
    name: 'Panadol 500mg',
    brand: 'GSK',
    category: 'otc',
    description: 'For relief of pain and fever. Contains paracetamol.',
    baseUnit: 'tablet',
    packagingType: 'card',
    packagingQtyPerPack: 12,
    requiresPrescription: false,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300'
  },
  {
    name: 'Amoxicillin 250mg',
    brand: 'SPC Sri Lanka',
    category: 'prescription',
    description: 'Broad-spectrum penicillin antibiotic used to treat bacterial infections.',
    baseUnit: 'capsule',
    packagingType: 'blister',
    packagingQtyPerPack: 10,
    requiresPrescription: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300'
  },
  {
    name: 'Metformin 500mg',
    brand: 'USV',
    category: 'prescription',
    description: 'Oral diabetes medicine that helps control blood sugar levels in type 2 diabetes.',
    baseUnit: 'tablet',
    packagingType: 'blister',
    packagingQtyPerPack: 10,
    requiresPrescription: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300'
  },
  {
    name: 'Atorvastatin 10mg',
    brand: 'Pfizer',
    category: 'prescription',
    description: 'Statin medication used to prevent cardiovascular disease and lower lipids.',
    baseUnit: 'tablet',
    packagingType: 'blister',
    packagingQtyPerPack: 10,
    requiresPrescription: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300'
  },
  {
    name: 'Omeprazole 20mg',
    brand: 'Astron',
    category: 'prescription',
    description: 'Proton pump inhibitor (PPI) used to reduce stomach acid and treat reflux.',
    baseUnit: 'capsule',
    packagingType: 'blister',
    packagingQtyPerPack: 10,
    requiresPrescription: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300'
  },
  {
    name: 'Cetirizine 10mg',
    brand: 'SPC Sri Lanka',
    category: 'otc',
    description: 'Antihistamine used to treat allergies, hay fever, and hives.',
    baseUnit: 'tablet',
    packagingType: 'blister',
    packagingQtyPerPack: 10,
    requiresPrescription: false,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300'
  },
  {
    name: 'Siddhalepa Balm 50g',
    brand: 'Siddhalepa',
    category: 'herbal',
    description: 'Ayurvedic herbal balm for relief of colds, flu, headaches, and muscle pains.',
    baseUnit: 'piece',
    packagingType: 'bottle',
    packagingQtyPerPack: 1,
    requiresPrescription: false,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300'
  },
  {
    name: 'ENO Antacid Powder',
    brand: 'GSK',
    category: 'otc',
    description: 'Fruit salt antacid powder providing rapid relief from acidity and indigestion.',
    baseUnit: 'piece',
    packagingType: 'sachet',
    packagingQtyPerPack: 1,
    requiresPrescription: false,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300'
  },
  {
    name: 'Vitamin C 500mg Chewable',
    brand: 'Lanka Hospitals',
    category: 'vitamins',
    description: 'Chewable dietary supplement containing ascorbic acid to support immune function.',
    baseUnit: 'tablet',
    packagingType: 'bottle',
    packagingQtyPerPack: 100,
    requiresPrescription: false,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300'
  },
  {
    name: 'Salbutamol Inhaler 100mcg',
    brand: 'Cipla',
    category: 'prescription',
    description: 'Reliever inhaler providing rapid relief for asthma and breathing spasms.',
    baseUnit: 'piece',
    packagingType: 'unit',
    packagingQtyPerPack: 1,
    requiresPrescription: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300'
  }
];
