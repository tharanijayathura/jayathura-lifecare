export const medicineExampleFormat = `Azithromycin 500mg | Zithrocin | prescription | tablet | blister | 3 | 760.00 | 25 | 10 | true | Strong antibiotic for respiratory infections.
Cefixime 200mg | Suprax | prescription | tablet | blister | 10 | 1450.00 | 15 | 20 | true | Treats UTIs and respiratory infections.`;

export const medicineFormatHelp = `Format: Name | Brand | Category | BaseUnit | Packaging | QtyPerPack | Price | StockPacks | MinStock | RequiresPrescription | Description

Fields:
- Name: Medicine/Product name (required)
- Brand: Brand name (optional)
- Category: prescription, otc, herbal, medical-devices, personal-care, groceries, baby-care, first-aid, vitamins, seasonal, dermatology, eye-ear-care, womens-health, mens-health, dental-care, home-healthcare, fitness-weight, cold-chain, pet-health (required)
- BaseUnit: tablet, capsule, ml, gram, piece (required)
- Packaging: blister, bottle, tube, box, unit, card, sachet (required)
- QtyPerPack: Quantity per pack (required, number)
- Price: Price per pack in LKR (required, number)
- StockPacks: Number of packs in stock (optional, default: 0)
- MinStock: Minimum stock units for alert (optional, default: 10)
- RequiresPrescription: true or false (optional, default: false)
- Description: Product description (optional)

Separate each item with a new line.`;