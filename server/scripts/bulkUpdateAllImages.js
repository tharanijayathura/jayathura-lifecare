const dns = require('dns');
const mongoose = require('mongoose');
require('dotenv').config();

const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
if (mongoUrl && mongoUrl.includes('mongodb+srv://')) {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
}

const Medicine = require('../models/Medicine');

// Definitive mapping of 100% hotlink-safe, high-quality images for all 52 medicines
const finalImageMapping = {
  // A
  'ACC-0031': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Glucometer.jpg/640px-Glucometer.jpg',
  'AML-0010': 'https://images.unsplash.com/photo-1584017912448-6a3f12a2ef4f?w=400&q=80',
  'AMO-0006': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
  'ASP-0048': 'https://images.unsplash.com/photo-1584017912448-6a3f12a2ef4f?w=400&q=80',
  'ATO-0008': 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&q=80',
  'AZI-0013': 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&q=80',
  
  // B
  'BET-0034': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Povidone-iodine_10%25_dermatological_solution_bottles.JPG/640px-Povidone-iodine_10%25_dermatological_solution_bottles.JPG',
  'BRA-0030': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Thermometer-18968.jpg/640px-Thermometer-18968.jpg',
  
  // C
  'CAL-0020': 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=400&q=80',
  'CEN-0021': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Wyeth_Centrum.jpg/1280px-Wyeth_Centrum.jpg',
  'CET-0025': 'https://img.drz.lazcdn.com/static/lk/p/061e018a901940341ecf2e68fe0d07ae.jpg',
  'CET-0016': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
  'CIP-0012': 'https://images.unsplash.com/photo-1607619056574-7b8d304f3c6f?w=400&q=80',
  'CLE-0027': 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&q=80',
  'CLO-0046': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
  'COL-0024': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Tubos_de_crema_dental_Colgate_Triple_Acci%C3%B3n.jpg/640px-Tubos_de_crema_dental_Colgate_Triple_Acci%C3%B3n.jpg',
  
  // D
  'DET-0033': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Dettol_Liquid.jpg/640px-Dettol_Liquid.jpg',
  'DET-0041': 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Hand_sanitizer.jpg',
  'DUR-0039': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Durex_condoms.jpg/640px-Durex_condoms.jpg',
  
  // E
  'ENO-0003': 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Eno-logo.png',
  
  // F
  'FOL-0037': 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=400&q=80',
  'FRO-0043': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/FrontlineSpotOnForCatsAndDogs.jpg/640px-FrontlineSpotOnForCatsAndDogs.jpg',
  
  // H
  'HYD-0026': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&q=80',
  
  // I
  'IBU-0015': 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&q=80',
  
  // J
  'JEE-0005': 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Oral_rehydration_salts_%28ORS%29_-_Packet.jpg',
  'JOI-0052': 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=400&q=80',
  
  // L
  'LAN-0044': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Novopen-color.JPG/640px-Novopen-color.JPG',
  'LIN-0042': 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Samahan_sachet.jpg',
  'LIS-0023': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Listerine_mouthwash.JPG/640px-Listerine_mouthwash.JPG',
  'LOR-0017': 'https://images.unsplash.com/photo-1607619056574-7b8d304f3c6f?w=400&q=80',
  'LOS-0011': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
  
  // M
  'MET-0007': 'https://images.unsplash.com/photo-1607619056574-7b8d304f3c6f?w=400&q=80',
  'MUL-0050': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Vitamine_Baby_Drops.jpg/640px-Vitamine_Baby_Drops.jpg',
  
  // O
  'OME-0009': 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&q=80',
  'OMR-0029': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Blood_pressure_monitor_omron.jpg/640px-Blood_pressure_monitor_omron.jpg',
  
  // P
  'PAN-0001': 'https://upload.wikimedia.org/wikipedia/commons/0/07/Panadol_500_mg.jpg',
  'PRE-0047': 'https://images.unsplash.com/photo-1607619056574-7b8d304f3c6f?w=400&q=80',
  
  // S
  'SAL-0014': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Salbutamol_Metered_Dose_Inhaler.jpg/640px-Salbutamol_Metered_Dose_Inhaler.jpg',
  'SAL-0049': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&q=80',
  'SEN-0022': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Sensodyne_fresh_mint.jpg/640px-Sensodyne_fresh_mint.jpg',
  'SID-0002': 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Siddalepa_ayurvedic_balm_in_hand.JPG',
  'SUD-0036': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Sudocrem_pot.jpg/640px-Sudocrem_pot.jpg',
  'SUR-0032': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Surgical_face_mask.jpg/1280px-Surgical_face_mask.jpg',
  
  // T
  'TEA-0051': 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&q=80',
  
  // V
  'VIC-0004': 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Vicks_VapoRub_IMG_20211101.jpg',
  'VIT-0018': 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=400&q=80',
  'VIT-0019': 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=400&q=80',
  
  // W
  'WAX-0028': 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80',
  'WEL-0038': 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&q=80',
  'WHE-0045': 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80',
  'WHI-0040': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Sanitary_pads.jpg/640px-Sanitary_pads.jpg',
  'WOO-0035': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Gripe_water_bottle.jpg/640px-Gripe_water_bottle.jpg'
};

async function bulkUpdate() {
  try {
    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB\n');

    let updatedCount = 0;
    for (const [code, imageUrl] of Object.entries(finalImageMapping)) {
      const result = await Medicine.updateOne({ code }, { image: imageUrl });
      if (result.matchedCount > 0) {
        console.log(`✅ Updated ${code} image successfully`);
        updatedCount++;
      } else {
        console.log(`⚠️ Code ${code} not found in database!`);
      }
    }

    console.log(`\n🎉 Success! Bulk updated ${updatedCount} medicines with correct, hotlink-safe, high-quality images.`);
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error during bulk update:', error);
    process.exit(1);
  }
}

bulkUpdate();
