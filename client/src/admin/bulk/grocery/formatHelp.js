export const groceryExampleFormat = `Milk Powder 500g | Kothmale - Full cream milk powder for cooking & drinks. | 1200.00 | g | 50 | 10
Chocolate Bar 50g | Cadbury - Popular milk chocolate bar. | 250.00 | g | 60 | 10`;

export const groceryFormatHelp = `Format: Name | Description | Price | Unit | Stock | MinStock

Fields:
- Name: Grocery item name (required)
- Description: Item description with brand info (optional)
- Price: Price in LKR (required, number)
- Unit: Unit of measurement - g, ml, piece, kg, liter, etc. (required)
- Stock: Current stock quantity (optional, default: 0)
- MinStock: Minimum stock for alert (optional, default: 10)

Separate each grocery item with a new line.`;