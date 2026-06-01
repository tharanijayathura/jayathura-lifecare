const dns = require('dns');
const mongoose = require('mongoose');
require('dotenv').config();

const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
if (mongoUrl && mongoUrl.includes('mongodb+srv://')) {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
}

const Medicine = require('../models/Medicine');

// Direct, high-quality image URLs for the first 16 medicines (A-C)
const realImageUrls = {
  'ACC-0031': 'https://gaganapharmacy.lk/wp-content/uploads/2021/02/Accu-Chek-Active-10.jpg',
  'AML-0010': 'https://healthplusnigeria.com/cdn/shop/files/Teva_20Amlodipine_205mg_20x28_20_281_29_225dda1b-0952-4d11-8c0a-6ea57a0655fb.webp?v=1775644064',
  'AMO-0006': 'https://wellonapharma.com/admincms/product_img/product_resize_img/amoxicillin-tablets_1732540129.jpg',
  'ASP-0048': 'https://storeofhealth.com/cdn/shop/products/aspirin-cardio-100mg-30-comprimate-bayer-10022258_1200x1200.jpg?v=1597619087',
  'ATO-0008': 'https://wellonapharma.com/admincms/product_img/product_resize_img/atorvastatin-20mg-tablets_1619445277.jpg',
  'AZI-0013': 'https://dmdskinsciences.com/cdn/shop/files/azythromycinbox.jpg?v=1747206824',
  'BET-0034': 'https://sukitha.com/wp-content/uploads/2020/11/Betadine-Solution-50ml.jpg',
  'BRA-0030': 'https://www.braunhealthcare.com/media/catalog/product/b/r/braun_prt1000_1.jpg',
  'CAL-0020': 'https://www.alpropharmacy.com/cdn/shop/files/00130417_L_1.jpg?v=1767198893',
  'CEN-0021': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Wyeth_Centrum.jpg/1280px-Wyeth_Centrum.jpg',
  'CET-0025': 'https://img.drz.lazcdn.com/static/lk/p/061e018a901940341ecf2e68fe0d07ae.jpg_720x720q80.jpg_.webp',
  'CET-0016': 'https://www.iqdoctor.co.uk/product_images/cetirizine-10mg-tablets.png',
  'CIP-0012': 'https://5.imimg.com/data5/SELLER/Default/2021/3/IL/GQ/RN/31683360/vitcipcin-500-500x500.jpeg',
  'CLE-0027': 'https://www.cleareyes.com/sites/cleareyes/files/products/clear-eyes-triple-action-relief.png',
  'CLO-0046': 'https://s.turbifycdn.com/aah/yhst-135855760451349/clopidogrel-tablets-75mg-500-count-manufacture-may-vary-46.jpg',
  'COL-0024': 'https://egrocery.asia/wp-content/uploads/2021/11/Colgate-Maximum-Cavities-Protection-Toothpaste-100g.jpg'
};

async function updateRealImages() {
  try {
    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB\n');

    let updatedCount = 0;
    for (const [code, directUrl] of Object.entries(realImageUrls)) {
      const result = await Medicine.updateOne({ code }, { image: directUrl });
      if (result.matchedCount > 0) {
        console.log(`✅ Set direct image URL for ${code}`);
        updatedCount++;
      } else {
        console.log(`⚠️ Code ${code} not found in database!`);
      }
    }

    console.log(`\n🎉 Success! Resolved and updated ${updatedCount} medicines with direct image URLs.`);
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error during database update:', error);
    process.exit(1);
  }
}

updateRealImages();
