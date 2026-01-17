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
      { value: 'dermatology', label: 'Dermatology & Skin Care' },
      { value: 'eye-ear-care', label: 'Eye & Ear Care' },
      { value: 'dental-care', label: 'Dental Care' },
    ]
  },
  {
    groupName: 'Specialized Care',
    categories: [
      { value: 'womens-health', label: "Women's Health" },
      { value: 'mens-health', label: "Men's Health" },
      { value: 'baby-care', label: 'Baby & Infant Care' },
      { value: 'pet-health', label: 'Pet Health' },
    ]
  },
  {
    groupName: 'Medical Equipment',
    categories: [
      { value: 'medical-devices', label: 'Medical Devices' },
      { value: 'home-healthcare', label: 'Home Healthcare' },
      { value: 'first-aid', label: 'First Aid & Emergency' },
    ]
  },
  {
    groupName: 'Lifestyle',
    categories: [
      { value: 'personal-care', label: 'Personal Care & Hygiene' },
      { value: 'fitness-weight', label: 'Fitness & Weight Management' },
      { value: 'seasonal', label: 'Seasonal & Special' },
      { value: 'cold-chain', label: 'Cold Chain Products' },
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
