export const parseGroceries = (inputText) => {
  const lines = inputText.trim().split('\n').filter(line => line.trim());
  const groceries = [];
  const errors = [];

  lines.forEach((line, index) => {
    const parts = line.split('|').map(p => p.trim());

    if (parts.length < 6) {
      errors.push(`Line ${index + 1}: Insufficient fields. Need at least 6 fields.`);
      return;
    }

    const [name, description = '', price, unit, stock, minStock = '10'] = parts;

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock);
    const minStockNum = parseInt(minStock);

    if (!name) {
      errors.push(`Line ${index + 1}: Name is required`);
      return;
    }
    if (isNaN(priceNum) || priceNum < 0) {
      errors.push(`Line ${index + 1}: Invalid price. Must be a positive number.`);
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      errors.push(`Line ${index + 1}: Invalid stock. Must be a non-negative number.`);
      return;
    }

    groceries.push({
      name,
      description,
      price: priceNum,
      unit,
      stock: stockNum,
      minStock: minStockNum,
    });
  });

  return { groceries, errors };
};
