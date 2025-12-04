const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: String,
  category: { 
    type: String, 
    enum: [
      'prescription',           // 1. Prescription Medicines (Rx)
      'otc',                    // 2. Over-the-Counter (OTC) Medicines
      'herbal',                 // 3. Herbal & Ayurvedic Products
      'medical-devices',        // 4. Medical Devices & Equipment
      'personal-care',          // 5. Personal Care & Hygiene
      'groceries',              // 6. Groceries & Snacks
      'baby-care',              // 7. Baby & Infant Care
      'first-aid',              // 8. First Aid & Emergency
      'vitamins',               // 9. Nutritional Supplements & Vitamins
      'seasonal',               // 10. Seasonal & Special Sections
      'dermatology',             // 11. Dermatology & Skin Care Medicines
      'eye-ear-care',           // 12. Eye & Ear Care
      'womens-health',          // 13. Women's Health
      'mens-health',            // 14. Men's Health
      'dental-care',            // 15. Dental Care
      'home-healthcare',        // 16. Home Healthcare
      'fitness-weight',         // 17. Fitness & Weight Management
      'cold-chain',             // 18. Cold Chain / Temperature Sensitive
      'pet-health'              // 19. Pet Health
    ], 
    required: true 
  },
  description: String,
  requiresPrescription: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  
  // Base Unit System - Core stock tracking
  baseUnit: {
    type: String,
    enum: ['tablet', 'capsule', 'ml', 'gram', 'piece'],
    required: true,
    default: 'tablet'
  },
  
  // Packaging Information
  packaging: {
    type: {
      type: String,
      enum: ['blister', 'bottle', 'tube', 'box', 'unit', 'card', 'sachet'],
      default: 'unit'
    },
    qtyPerPack: { 
      type: Number, 
      required: true,
      default: 1,
      min: 1
    },
    packName: String // e.g. '1 card (10 tablets)', '1 bottle (120ml)'
  },
  
  // Pricing
  price: {
    perPack: { 
      type: Number, 
      required: true,
      min: 0
    },
    perUnit: { 
      type: Number,
      default: 0
    }
  },
  
  // Stock Management
  stock: {
    packs: { 
      type: Number, 
      default: 0,
      min: 0
    },
    units: { 
      type: Number,
      default: 0,
      min: 0
    }
  },
  
  minStockUnits: { 
    type: Number, 
    default: 10,
    min: 0
  },
  
  image: String, // URL or base64
  
  // Stock alert system
  stockAlert: {
    isAlerted: { type: Boolean, default: false },
    alertedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    alertedAt: Date,
    alertReason: String
  }
}, { timestamps: true });

// Auto-calculate perUnit price and units before saving
medicineSchema.pre('save', function(next) {
  // Calculate per unit price
  if (this.packaging?.qtyPerPack > 0 && this.price?.perPack > 0) {
    this.price.perUnit = parseFloat((this.price.perPack / this.packaging.qtyPerPack).toFixed(2));
  }
  
  // Calculate total units from packs
  if (this.stock?.packs !== undefined && this.packaging?.qtyPerPack > 0) {
    this.stock.units = this.stock.packs * this.packaging.qtyPerPack;
  }
  
  // Auto-generate pack name if not provided
  if (!this.packaging?.packName && this.packaging?.qtyPerPack) {
    const unitText = this.packaging.qtyPerPack > 1 ? `${this.baseUnit}s` : this.baseUnit;
    this.packaging.packName = `1 ${this.packaging.type} (${this.packaging.qtyPerPack} ${unitText})`;
  }
  
  next();
});

// Virtual to check if stock is low (based on base units)
medicineSchema.virtual('isLowStock').get(function() {
  return this.stock.units <= this.minStockUnits;
});

// Virtual to check if stock is critically low (0 or negative)
medicineSchema.virtual('isOutOfStock').get(function() {
  return this.stock.units <= 0;
});

// Virtual for stock value in LKR
medicineSchema.virtual('stockValue').get(function() {
  return this.stock.packs * this.price.perPack;
});

// Method to get formatted pack name
medicineSchema.methods.getPackDisplay = function() {
  if (this.packaging.packName) {
    return this.packaging.packName;
  }
  return `1 ${this.packaging.type} (${this.packaging.qtyPerPack} ${this.baseUnit}${this.packaging.qtyPerPack > 1 ? 's' : ''})`;
};

module.exports = mongoose.model('Medicine', medicineSchema);