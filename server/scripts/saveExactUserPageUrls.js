const dns = require('dns');
const mongoose = require('mongoose');
require('dotenv').config();

const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
if (mongoUrl && mongoUrl.includes('mongodb+srv://')) {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
}

const Medicine = require('../models/Medicine');

// Exact webpage URLs provided by the user (both A-C and the newly provided ones)
const userPageUrls = {
  // A-C
  'ACC-0031': 'https://gaganapharmacy.lk/product/accu-chek-active-test-strips-10-strips/',
  'AML-0010': 'https://healthplusnigeria.com/products/teva-amlodipine-5mg-x28',
  'AMO-0006': 'https://wellonapharma.com/product/finished/amoxicillin-tablets-500mg',
  'ASP-0048': 'https://storeofhealth.com/products/aspirin-cardio-100mg-2x-30-tablets-bayer',
  'ATO-0008': 'https://wellonapharma.com/product/finished/atorvastatin-tablets-20mg',
  'AZI-0013': 'https://dmdskinsciences.com/products/rx-azitritec-azithromycin-500mg-tablet-3s?srsltid=AfmBOopKxHf9F1vpP-u-jg2Nikjdz22nXM35Do_SXECH9Hhr4B6lYWWk',
  'BET-0034': 'https://www.indiamart.com/proddetail/betadine-cleansing-solution-50ml-18043406662.html?srsltid=AfmBOork4ZuvX_0x58v2CpWlOb22Ltw0uOwHHWIkNGfLkTHL3aUnKUO-',
  'BRA-0030': 'https://www.braunhealthcare.com/uk_en/thermometer/digital-stick-age-precision/',
  'CAL-0020': 'https://www.alpropharmacy.com/products/mpi-calcium-carbonate-500mg-100x10s?srsltid=AfmBOorkBQX1vSRG_b496kgJELMD4rxNYmmO7k1BF8MsIWBg9lhoGlmz',
  'CEN-0021': 'https://en.wikipedia.org/wiki/Centrum_%28multivitamin%29',
  'CET-0025': 'https://www.daraz.lk/products/cetaphil-gentle-skin-cleanser-gentle-face-wash-for-dry-sensitive-skin-250ml-i163100412.html',
  'CET-0016': 'https://www.iqdoctor.co.uk/treatments/allergies/cetirizine-10mg-tablets/?srsltid=AfmBOorRabyYOrQbx3R9HcFDGpQZ-VNDsdrNZzaKKSPEKf3pBM5fHcdw',
  'CIP-0012': 'https://www.indiamart.com/proddetail/ciprofloxacin-500-mg-tablets-23258810433.html?srsltid=AfmBOopHrZBEPZ4I-DMdB5w1unGnqPhr4q9Ap58jO5jgO66-J1oLl9zY',
  'CLE-0027': 'https://www.cleareyes.com/eye-drops/multi-symptom-relief/clear-eyes-triple-action-relief-eye-drops',
  'CLO-0046': 'https://entirelypetspharmacy.com/clopidogrel-tablets-75mg-500-count.html?srsltid=AfmBOoqxw5wUw4xN-oV8sVp3AAFW-Z5LGm2ir2M0f3XvDgm9nxsdj_hM',
  'COL-0024': 'https://egrocery.asia/colgate-maximum-cavities-protection-toothpaste-100g.html',

  // D-Z
  'DET-0033': 'https://www.al-dawaa.com/en/p/201935/dettol-liquid-antiseptic-250-ml?srsltid=AfmBOoqJkl0HdsHYhh-O5yM-aE9YPCcsfBSwThKJyDXAuKfdFoe4qn7F',
  'DET-0041': 'https://glomark.lk/dettol-hand-sanitizer-fresh-50ml/p/12389?srsltid=AfmBOorhLSSqUSxRcPL0kXKYbInJ5WPIpuE4alS6BpNSDiomPfR5Rr8P',
  'ENO-0003': 'https://www.kogland.com/eno-lemon-sachet-5g?srsltid=AfmBOor22-3NHIeupvit3XqNY1XDENI3mEIhi3mOF8rKpdKgMCpiKL2i',
  'FOL-0037': 'https://products.pharmamt.com/product/folic-acid-tablets-5mg/',
  'FRO-0043': 'https://uk.frontline.com/products/frontline-spot-flea-and-tick-treatment-dogs',
  'HYD-0026': 'https://nowonsuper.lk/product/hydrocortisone-cream-bp-1-hydrosone-15g/',
  'IBU-0015': 'https://www.indiamart.com/proddetail/ibuprofen-tablet-400mg-2855090150262.html?srsltid=AfmBOorkVxlfITDP2ZmHAEC4K9-A0T1vQ4clD0vl8Q15vGwV-__MWF8U',
  'JEE-0005': 'https://www.facebook.com/100063617800113/posts/jeewani-use-for-the-oral-rehydration-therapy-the-international-composition-of-or/104376267895284/',
  'JOI-0052': 'https://www.amazon.com/Glucosamine-Chondroitin-Turmeric-MSM-Boswellia/dp/B01M5DEMWI',
  'LAN-0044': 'https://medplusnig.com/product/lantus-solosta-insulin-5pens-8Jt4I9?srsltid=AfmBOooLVwskbjv9cV7zESnMqQamDe6O8pdmaiILJjh4wT1O5XR9wETM',
  'LIN-0042': 'https://www.ebay.com/itm/185901831006',
  'MET-0007': 'https://spmc.gov.lk/products/biguanide/-metformin-tablets-bp500mg-blister',
  'PAN-0001': 'https://www.panadol.com/en-lk/products/panadol.html',
  'MUL-0050': 'https://appeton.com/49-appeton-baby-drops.php',
  'SAL-0049': 'https://www.gosupps.com/salicylic-acid-ointment-25g-0-9-oz-5-ointment-0-88-ounce-pack-of-1.html',
  'SID-0002': 'https://serandib.co.nz/product/siddhalepa-herbal-ayurvedic-balm-50g/',
  'VIT-0018': 'https://www.essentials.lk/products/kirkland-signature-vitamin-c-500mg-chewable-500-tablets?srsltid=AfmBOooLc3A1_NNAl8jlx3T4o_9gTjxONhd8Lzn2WuoJhruXuGH82uBW',
  'VIT-0019': 'https://greenlife.sg/products/vegan-vitamin-d3-1000iu-100-tablets?srsltid=AfmBOopQo3b4IYgqagjsJoIT38wqlWMDfuRBB9-8adVKSfZ28pFGAUSU',
  'WOO-0035': 'https://www.daraz.lk/products/woodwards-gripe-water-130ml-non-alcoholic-i202411082.html',
  'WHE-0045': 'https://www.edgenutrition.life/',
  'WAX-0028': 'https://osudpotro.com/waxsol-10-ml-ear-drop'
};

async function saveExactUrls() {
  try {
    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB\n');

    let updatedCount = 0;
    for (const [code, pageUrl] of Object.entries(userPageUrls)) {
      const result = await Medicine.updateOne({ code }, { image: pageUrl });
      if (result.matchedCount > 0) {
        console.log(`✅ Set exact webpage URL for ${code}`);
        updatedCount++;
      } else {
        console.log(`⚠️ Code ${code} not found in database!`);
      }
    }

    console.log(`\n🎉 Success! Stored exact page URLs for ${updatedCount} medicines in the database.`);
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error during update:', error);
    process.exit(1);
  }
}

saveExactUrls();
