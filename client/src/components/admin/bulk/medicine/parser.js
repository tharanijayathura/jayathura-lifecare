export const parseMedicines = (inputText) => {
  const lines = inputText.trim().split('\n').filter(line => line.trim());
  const medicines = [];
  const errors = [];

  lines.forEach((line, index) => {
    const parts = line.split('|').map(p => p.trim());

    if (parts.length < 7) {
      errors.push(`Line ${index + 1}: Insufficient fields. Need at least 7 fields.`);
      return;
    }

    const [name, brand, category, baseUnit, packaging, qtyPerPack, price, stockPacks = '0', minStock = '10', requiresPrescription = 'false', ...descriptionParts] = parts;
    const description = descriptionParts.join('|').trim();

    const validCategories = [
      'prescription', 'otc', 'herbal', 'medical-devices', 'personal-care',
      'groceries', 'baby-care', 'first-aid', 'vitamins', 'seasonal',
      'dermatology', 'eye-ear-care', 'womens-health', 'mens-health',
      'dental-care', 'home-healthcare', 'fitness-weight', 'cold-chain', 'pet-health'
    ];
    const validBaseUnits = ['tablet', 'capsule', 'ml', 'gram', 'piece'];
    const validPackaging = ['blister', 'bottle', 'tube', 'box', 'unit', 'card', 'sachet'];

    if (!name) {
      errors.push(`Line ${index + 1}: Name is required`);
      return;
    }
    if (!validCategories.includes(category.toLowerCase())) {
      errors.push(`Line ${index + 1}: Invalid category. Must be one of: ${validCategories.join(', ')}`);
      return;
    }
    if (!validBaseUnits.includes(baseUnit.toLowerCase())) {
      errors.push(`Line ${index + 1}: Invalid base unit. Must be one of: ${validBaseUnits.join(', ')}`);
      return;
    }
    if (!validPackaging.includes(packaging.toLowerCase())) {
      errors.push(`Line ${index + 1}: Invalid packaging. Must be one of: ${validPackaging.join(', ')}`);
      return;
    }

    const qty = parseInt(qtyPerPack);
    const priceNum = parseFloat(price);
    const stock = parseInt(stockPacks) || 0;
    const minStockNum = parseInt(minStock) || 10;
    const requiresPresc = requiresPrescription.toLowerCase() === 'true';

    if (isNaN(qty) || qty < 1) {
      errors.push(`Line ${index + 1}: Invalid quantity per pack. Must be a positive number.`);
      return;
    }
    if (isNaN(priceNum) || priceNum < 0) {
      errors.push(`Line ${index + 1}: Invalid price. Must be a positive number.`);
      return;
    }

    medicines.push({
      name,
      brand: brand || '',
      category: category.toLowerCase(),
      baseUnit: baseUnit.toLowerCase(),
      packaging: { type: packaging.toLowerCase(), qtyPerPack: qty },
      price: { perPack: priceNum },
      stock: { packs: stock },
      minStockUnits: minStockNum,
      requiresPrescription: requiresPresc,
      description: description || '',
    });
  });

  return { medicines, errors };
};
