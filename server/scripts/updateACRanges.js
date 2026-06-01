const dns = require('dns');
const mongoose = require('mongoose');
require('dotenv').config();

const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
if (mongoUrl && mongoUrl.includes('mongodb+srv://')) {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
}

const Medicine = require('../models/Medicine');

const exactUserUrls = {
  'ACC-0031': 'https://gaganapharmacy.lk/product/accu-chek-active-test-strips-10-strips/',
  'AML-0010': 'https://healthplusnigeria.com/products/teva-amlodipine-5mg-x28',
  'AMO-0006': 'https://wellonapharma.com/product/finished/amoxicillin-tablets-500mg',
  'ASP-0048': 'https://storeofhealth.com/products/aspirin-cardio-100mg-2x-30-tablets-bayer',
  'ATO-0008': 'https://wellonapharma.com/product/finished/atorvastatin-tablets-20mg',
  'AZI-0013': 'https://dmdskinsciences.com/products/rx-azitritec-azithromycin-500mg-tablet-3s?srsltid=AfmBOopKxHf9F1vpP-u-jg2Nikjdz22nXM35Do_SXECH9Hhr4B6lYWWk',
  'BET-0034': 'https://sukitha.com/shop/home-medicine/betadine-solution-50ml/?srsltid=AfmBOorAU8p6a-C186MLo1BpMGUbDxu88rwxdG-2Q4Mc83iyFU96Tjhm',
  'BRA-0030': 'https://www.braunhealthcare.com/uk_en/thermometer/digital-stick/',
  'CAL-0020': 'https://www.alpropharmacy.com/products/mpi-calcium-carbonate-500mg-100x10s?srsltid=AfmBOorkBQX1vSRG_b496kgJELMD4rxNYmmO7k1BF8MsIWBg9lhoGlmz',
  'CEN-0021': 'https://en.wikipedia.org/wiki/Centrum_%28multivitamin%29',
  'CET-0025': 'https://www.daraz.lk/products/cetaphil-gentle-skin-cleanser-gentle-face-wash-for-dry-sensitive-skin-250ml-i163100412.html',
  'CET-0016': 'https://www.iqdoctor.co.uk/treatments/allergies/cetirizine-10mg-tablets/?srsltid=AfmBOorRabyYOrQbx3R9HcFDGpQZ-VNDsdrNZzaKKSPEKf3pBM5fHcdw',
  'CIP-0012': 'https://www.indiamart.com/proddetail/ciprofloxacin-500-mg-tablets-23258810433.html?srsltid=AfmBOopHrZBEPZ4I-DMdB5w1unGnqPhr4q9Ap58jO5jgO66-J1oLl9zY',
  'CLE-0027': 'https://www.cleareyes.com/eye-drops/multi-symptom-relief/clear-eyes-triple-action-relief-eye-drops',
  'CLO-0046': 'https://entirelypetspharmacy.com/clopidogrel-tablets-75mg-500-count.html?srsltid=AfmBOoqxw5wUw4xN-oV8sVp3AAFW-Z5LGm2ir2M0f3XvDgm9nxsdj_hM',
  'COL-0024': 'https://egrocery.asia/colgate-maximum-cavities-protection-toothpaste-100g.html'
};

async function updateAC() {
  try {
    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB\n');

    let updatedCount = 0;
    for (const [code, userUrl] of Object.entries(exactUserUrls)) {
      const result = await Medicine.updateOne({ code }, { image: userUrl });
      if (result.matchedCount > 0) {
        console.log(`✅ Set exact user URL for ${code}`);
        updatedCount++;
      } else {
        console.log(`⚠️ Code ${code} not found in database!`);
      }
    }

    console.log(`\n🎉 Success! Updated ${updatedCount} medicines with your exact provided URLs.`);
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error during update:', error);
    process.exit(1);
  }
}

updateAC();
