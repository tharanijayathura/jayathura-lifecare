const dns = require('dns');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
if (mongoUrl && mongoUrl.includes('mongodb+srv://')) {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
}

const Medicine = require('../models/Medicine');

async function listAllMedicines() {
  try {
    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB\n');

    const medicines = await Medicine.find().sort({ name: 1 });
    console.log(`Found ${medicines.length} medicines.`);

    let markdown = `# List of Medicines in Stock\n\n`;
    markdown += `Please review the list of medicines below. If you want to update any image, please provide the new image URL under the **New Image URL** column or supply a mapping.\n\n`;
    markdown += `| Medicine ID | Code | Medicine Name | Brand | Category | Current Image | New Image URL |\n`;
    markdown += `| --- | --- | --- | --- | --- | --- | --- |\n`;

    for (const med of medicines) {
      const currentImage = med.image ? `[View current image](${med.image})` : 'None';
      markdown += `| \`${med._id}\` | \`${med.code || 'N/A'}\` | **${med.name}** | ${med.brand || 'N/A'} | \`${med.category}\` | ${currentImage} | |\n`;
    }

    const artifactDir = `C:\\Users\\Tharani jayathura\\.gemini\\antigravity\\brain\\fade63f2-2e19-4fef-a91f-eec97fff39e0`;
    const targetFile = path.join(artifactDir, 'medicines_list.md');
    
    fs.writeFileSync(targetFile, markdown, 'utf8');
    console.log(`✅ Written markdown list to ${targetFile}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

listAllMedicines();
