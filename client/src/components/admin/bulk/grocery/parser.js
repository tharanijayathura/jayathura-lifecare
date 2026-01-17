export const parseGroceries = (inputText) => {
  const lines = inputText.trim().split('\n').filter(line => line.trim());
  const groceries = [];
  const errors = [];

  lines.forEach((line, index) => {
    const parts = line.split('|').map(p => p.trim());

    if (parts.length < 4) {
      errors.push(`Line ${index + 1}: Insufficient fields. Need at least 4 fields (Name, Description, Price, Unit).`);
      return;
    }

    const [name, description = '', price, unit = 'item', stock = '0', minStock = '10'] = parts;

    if (!name) {
      errors.push(`Line ${index + 1}: Name is required`);
      return;
    }

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock) || 0;
    const minStockNum = parseInt(minStock) || 10;

    if (isNaN(priceNum) || priceNum < 0) {
      errors.push(`Line ${index + 1}: Invalid price. Must be a positive number.`);
      return;
    }

    groceries.push({
      name,
      description: description || '',
      price: priceNum,
      unit: unit || 'item',
      stock: stockNum,
      minStock: minStockNum,
    });
  });

  return { groceries, errors };
};
