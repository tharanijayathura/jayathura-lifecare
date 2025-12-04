// Medicines list formatted for bulk import
// Format: Name | Brand | Category | BaseUnit | Packaging | QtyPerPack | Price | StockPacks | MinStock | RequiresPrescription | Description
// 
// Available Categories:
// prescription, otc, herbal, medical-devices, personal-care, groceries, baby-care, first-aid,
// vitamins, seasonal, dermatology, eye-ear-care, womens-health, mens-health, dental-care,
// home-healthcare, fitness-weight, cold-chain, pet-health

export const fullMedicineList = `Amoxicillin 500mg Capsules | GlaxoSmithKline | prescription | capsule | blister | 10 | 450.00 | 100 | 20 | true | Antibiotic for bacterial infections
Metformin 500mg Tablets | Cipla | prescription | tablet | blister | 10 | 180.00 | 150 | 30 | true | Diabetes medication
Atorvastatin 20mg Tablets | Pfizer | prescription | tablet | blister | 10 | 650.00 | 80 | 15 | true | Cholesterol lowering drug
Losartan 50mg Tablets | Unilever | prescription | tablet | blister | 10 | 320.00 | 120 | 25 | true | Blood pressure medication
Salbutamol Inhaler 100mcg | AstraZeneca | prescription | piece | box | 200 | 1250.00 | 50 | 10 | true | Asthma relief inhaler
Omeprazole 20mg Capsules | Sun Pharma | prescription | capsule | blister | 10 | 280.00 | 110 | 20 | true | Acid reflux/GERD treatment
Ciprofloxacin 500mg Tablets | Bayer | prescription | tablet | blister | 10 | 380.00 | 90 | 15 | true | Antibiotic for UTIs
Levothyroxine 50mcg Tablets | Merck | prescription | tablet | blister | 10 | 220.00 | 70 | 10 | true | Thyroid hormone replacement
Sertraline 50mg Tablets | Pfizer | prescription | tablet | blister | 10 | 520.00 | 60 | 10 | true | Antidepressant
Insulin Glargine Pen | Sanofi | prescription | piece | box | 1 | 4500.00 | 25 | 5 | true | Long-acting insulin
Panadol Extra 500mg | GlaxoSmithKline | otc | tablet | blister | 10 | 120.00 | 200 | 30 | false | Pain & fever relief
Aspirin 300mg Tablets | Bayer | otc | tablet | box | 30 | 180.00 | 150 | 20 | false | Pain relief, anti-inflammatory
Bisolvon Cough Syrup | Boehringer | otc | ml | bottle | 100 | 320.00 | 80 | 15 | false | Chesty cough syrup
Strepsils Lozenges | Reckitt Benckiser | otc | piece | box | 16 | 280.00 | 120 | 25 | false | Sore throat relief
Ibuprofen 200mg Tablets | Unilever | otc | tablet | blister | 10 | 95.00 | 180 | 30 | false | Pain & inflammation relief
Dulcolax 5mg Tablets | Sanofi | otc | tablet | blister | 10 | 220.00 | 100 | 20 | false | Constipation relief
Imodium Capsules | Johnson & Johnson | otc | capsule | box | 6 | 180.00 | 130 | 25 | false | Anti-diarrheal
Antacid Tablets | Link | otc | tablet | tube | 12 | 85.00 | 160 | 30 | false | Heartburn & indigestion
Cetirizine 10mg Tablets | Cipla | otc | tablet | blister | 10 | 110.00 | 140 | 25 | false | Allergy relief
Voltaren Emulgel | Novartis | otc | gram | tube | 50 | 850.00 | 60 | 10 | false | Topical pain relief
Navaratne Oil | Damsara | herbal | ml | bottle | 50 | 680.00 | 25 | 5 | false | Traditional herbal oil for aches
Kothala Himbutu Tea | Siddhalepa | herbal | gram | box | 20 | 720.00 | 30 | 8 | false | Diabetes management
Triphala Powder | Arya | herbal | gram | box | 100 | 350.00 | 40 | 10 | false | Digestive detox powder
Madhu Bindu Arishta | Herbal Hills | herbal | ml | bottle | 200 | 420.00 | 20 | 5 | false | Blood sugar regulator
Digital Thermometer | Omron | medical-devices | piece | box | 1 | 1200.00 | 30 | 5 | false | Electronic body thermometer
Blood Pressure Monitor | Beurer | medical-devices | piece | box | 1 | 8500.00 | 15 | 3 | false | Automatic BP machine
Nebulizer Machine | Omron | medical-devices | piece | box | 1 | 12500.00 | 10 | 2 | false | Asthma/breathing treatment
Glucometer Kit | Accu-Chek | medical-devices | piece | box | 1 | 4500.00 | 20 | 4 | false | Blood sugar testing
Infrared Thermometer | Dr. Morepen | medical-devices | piece | box | 1 | 3500.00 | 25 | 5 | false | Non-contact thermometer
Stethoscope | 3M Littmann | medical-devices | piece | box | 1 | 8500.00 | 12 | 2 | false | Medical examination
First Aid Kit | Link | medical-devices | piece | box | 1 | 2800.00 | 25 | 5 | false | Comprehensive first aid
Weighing Scale | HealthSense | medical-devices | piece | box | 1 | 2200.00 | 30 | 6 | false | Digital body weight scale
Hot Water Bottle | Rubbermaid | medical-devices | piece | box | 1 | 850.00 | 40 | 8 | false | Pain relief heat therapy
Wheelchair | Invacare | medical-devices | piece | box | 1 | 25000.00 | 5 | 1 | false | Mobility aid
Dettol Antiseptic Liquid | Reckitt Benckiser | personal-care | ml | bottle | 100 | 380.00 | 80 | 15 | false | Antiseptic disinfectant
Lifebuoy Soap | Unilever | personal-care | gram | box | 125 | 85.00 | 200 | 40 | false | Antibacterial soap
Colgate Toothpaste | Colgate-Palmolive | personal-care | gram | tube | 150 | 420.00 | 150 | 30 | false | Cavity protection
Sanitary Pads (Regular) | Kotex | personal-care | piece | box | 8 | 280.00 | 120 | 25 | false | Feminine hygiene
Gillette Razor Blades | P&G | personal-care | piece | box | 5 | 650.00 | 90 | 18 | false | Shaving blades
Nivea Body Lotion | Beiersdorf | personal-care | ml | bottle | 200 | 850.00 | 70 | 14 | false | Moisturizing lotion
Head & Shoulders Shampoo | P&G | personal-care | ml | bottle | 200 | 780.00 | 65 | 13 | false | Anti-dandruff shampoo
Vaseline Petroleum Jelly | Unilever | personal-care | gram | box | 100 | 320.00 | 110 | 22 | false | Skin protectant
Cotton Buds | Johnson & Johnson | personal-care | piece | box | 200 | 180.00 | 140 | 28 | false | Ear cleaning/swabs
Closeup Toothpaste | Unilever | personal-care | gram | tube | 120 | 320.00 | 130 | 26 | false | Fresh breath toothpaste
Pampers Diapers (M) | P&G | baby-care | piece | box | 30 | 1250.00 | 80 | 16 | false | Baby diapers
Johnson's Baby Shampoo | Johnson & Johnson | baby-care | ml | bottle | 200 | 580.00 | 70 | 14 | false | Gentle baby shampoo
Baby Vaseline | Unilever | baby-care | gram | box | 50 | 320.00 | 100 | 20 | false | Baby skin protectant
Himalaya Baby Powder | Himalaya | baby-care | gram | bottle | 100 | 280.00 | 90 | 18 | false | Talc-free powder
Gripe Water | Woodward's | baby-care | ml | bottle | 100 | 380.00 | 60 | 12 | false | Colic relief for infants
Baby Wipes (Fragrance Free) | Johnson & Johnson | baby-care | piece | box | 80 | 450.00 | 110 | 22 | false | Cleaning wipes
NAN Pro 1 Formula | Nestle | baby-care | gram | box | 400 | 1850.00 | 35 | 7 | false | Infant formula
Baby Soap | Johnson & Johnson | baby-care | gram | box | 75 | 180.00 | 150 | 30 | false | Mild baby soap
Baby Oil | Johnson & Johnson | baby-care | ml | bottle | 100 | 420.00 | 80 | 16 | false | Moisturizing baby oil
Teething Gel | Dentinox | baby-care | gram | tube | 10 | 580.00 | 50 | 10 | false | Soothes teething pain
Band-Aid Plasters | Johnson & Johnson | first-aid | piece | box | 20 | 220.00 | 100 | 20 | false | Adhesive bandages
Crepe Bandage | Band-Aid | first-aid | piece | box | 1 | 180.00 | 80 | 16 | false | Elastic support bandage
Cotton Wool | Johnson & Johnson | first-aid | gram | box | 100 | 120.00 | 150 | 30 | false | Sterilized cotton
Betadine Solution | Mundipharma | first-aid | ml | bottle | 50 | 280.00 | 70 | 14 | false | Antiseptic solution
Burnol Cream | GlaxoSmithKline | first-aid | gram | tube | 30 | 220.00 | 90 | 18 | false | Burn relief cream
Sterile Gauze | Smith & Nephew | first-aid | piece | box | 10 | 180.00 | 120 | 24 | false | Wound dressing
Tourniquet | 3M | first-aid | piece | box | 1 | 850.00 | 40 | 8 | false | Bleeding control
Instant Cold Pack | Medi | first-aid | piece | box | 1 | 320.00 | 60 | 12 | false | Sports injury cold therapy
CPR Face Shield | Laerdal | first-aid | piece | box | 1 | 580.00 | 30 | 6 | false | Emergency resuscitation
First Aid Manual | St. John Ambulance | first-aid | piece | box | 1 | 650.00 | 25 | 5 | false | Emergency procedures guide
Vitamin C 500mg | Nature's Best | vitamins | tablet | box | 60 | 850.00 | 80 | 16 | false | Immune support
Calcium + D3 | Cenovis | vitamins | tablet | box | 60 | 1250.00 | 60 | 12 | false | Bone health
Multivitamin Capsules | Blackmores | vitamins | capsule | box | 60 | 1850.00 | 50 | 10 | false | Daily nutrition
Iron + Folic Acid | HealthAid | vitamins | tablet | box | 30 | 680.00 | 70 | 14 | false | Anemia prevention
Vitamin B Complex | Nature's Way | vitamins | tablet | box | 90 | 950.00 | 65 | 13 | false | Energy metabolism
Cod Liver Oil Capsules | Seven Seas | vitamins | capsule | box | 100 | 1250.00 | 55 | 11 | false | Omega-3 & vitamins
Zinc 50mg Tablets | Solgar | vitamins | tablet | box | 90 | 1150.00 | 45 | 9 | false | Immune & skin health
Vitamin E 400IU | Now Foods | vitamins | capsule | box | 60 | 950.00 | 50 | 10 | false | Antioxidant
Probiotic Capsules | BioGaia | vitamins | capsule | box | 30 | 2200.00 | 35 | 7 | false | Gut health
Glucosamine + Chondroitin | Schiff | vitamins | tablet | box | 90 | 2800.00 | 30 | 6 | false | Joint health
Anti-Dengue Kit | Link | seasonal | piece | box | 1 | 1500.00 | 40 | 8 | false | Mosquito repellent + thermometer
Mosquito Repellent Spray | Good Knight | seasonal | ml | bottle | 100 | 450.00 | 90 | 18 | false | Mosquito protection
Flu & Cold Combo Pack | GlaxoSmithKline | seasonal | piece | box | 1 | 850.00 | 60 | 12 | false | Multi-symptom relief
Allergy Relief Pack | Cipla | seasonal | piece | box | 1 | 1200.00 | 45 | 9 | false | Seasonal allergy bundle
Travel Medicine Kit | TravelSafe | seasonal | piece | box | 1 | 2200.00 | 25 | 5 | false | Motion sickness + diarrhea relief
Festival First Aid Kit | Band-Aid | seasonal | piece | box | 1 | 950.00 | 50 | 10 | false | Burns, cuts, sprains
Monsoon Health Pack | Himalaya | seasonal | piece | box | 1 | 1250.00 | 35 | 7 | false | Immunity boosters
Back-to-School Pack | Johnson & Johnson | seasonal | piece | box | 1 | 1800.00 | 30 | 6 | false | Sanitizer, bandages, wipes
Wedding Emergency Kit | Kotex | seasonal | piece | box | 1 | 850.00 | 40 | 8 | false | Stain removal, safety pins
Sports Event Kit | Medi | seasonal | piece | box | 1 | 3200.00 | 20 | 4 | false | Strains, sprains, hydration
Cetaphil Gentle Cleanser | Galderma | dermatology | ml | bottle | 250 | 1850.00 | 40 | 8 | false | Sensitive skin cleanser
Betnovate Cream | GlaxoSmithKline | dermatology | gram | tube | 15 | 320.00 | 70 | 14 | false | Steroid cream for eczema
Acne-Aid Soap | Stiefel | dermatology | gram | box | 75 | 280.00 | 90 | 18 | false | Anti-acne cleansing soap
Eucerin Lotion | Beiersdorf | dermatology | ml | bottle | 200 | 2200.00 | 35 | 7 | false | Intensive moisturizer
Benzoyl Peroxide Gel | La Roche-Posay | dermatology | gram | tube | 30 | 1250.00 | 50 | 10 | false | Acne treatment gel
Hydrocortisone Cream | Unilever | dermatology | gram | tube | 15 | 180.00 | 110 | 22 | false | Itch & rash relief
Sunscreen Lotion SPF 50 | Nivea | dermatology | ml | bottle | 100 | 950.00 | 65 | 13 | false | Sun protection
Antifungal Cream | Canesten | dermatology | gram | tube | 20 | 320.00 | 85 | 17 | false | Athlete's foot, ringworm
Calamine Lotion | GlaxoSmithKline | dermatology | ml | bottle | 100 | 280.00 | 95 | 19 | false | Soothing for skin irritation
Scar Reduction Gel | Mederma | dermatology | gram | tube | 20 | 1850.00 | 30 | 6 | false | Reduces scar appearance
Artificial Tears | Refresh | eye-ear-care | ml | bottle | 10 | 450.00 | 80 | 16 | false | Dry eye relief
Contact Lens Solution | Bausch & Lomb | eye-ear-care | ml | bottle | 120 | 850.00 | 60 | 12 | false | Lens cleaning & storage
Ear Drops (Wax Removal) | Otex | eye-ear-care | ml | bottle | 10 | 380.00 | 90 | 18 | false | Ear wax softener
Antibiotic Eye Ointment | Cipla | eye-ear-care | gram | tube | 5 | 280.00 | 70 | 14 | false | Eye infection treatment
Reading Glasses (+1.5) | Vision Express | eye-ear-care | piece | box | 1 | 850.00 | 50 | 10 | false | Magnifying glasses
Eye Wash | Optrex | eye-ear-care | ml | bottle | 100 | 580.00 | 65 | 13 | false | Eye irrigation
Antihistamine Eye Drops | Alcon | eye-ear-care | ml | bottle | 5 | 650.00 | 55 | 11 | false | Allergy eye relief
Ear Pain Relief Drops | Similasan | eye-ear-care | ml | bottle | 10 | 420.00 | 75 | 15 | false | Natural earache relief
Eye Vitamins | Ocuvite | eye-ear-care | tablet | box | 60 | 1850.00 | 40 | 8 | false | Macular health support
Eye Patch | 3M | eye-ear-care | piece | box | 10 | 280.00 | 85 | 17 | false | Post-surgery/protection
Oral Contraceptive Pills | Bayer | womens-health | tablet | blister | 21 | 650.00 | 45 | 9 | false | Birth control pills
Pregnancy Test Kit | Clearblue | womens-health | piece | box | 1 | 580.00 | 60 | 12 | false | Early pregnancy detection
Folic Acid Tablets | Folvite | womens-health | tablet | box | 90 | 450.00 | 80 | 16 | false | Pre-pregnancy supplement
Menopause Support | Remifemin | womens-health | tablet | box | 60 | 1850.00 | 35 | 7 | false | Menopausal symptom relief
Vaginal Antifungal Cream | Canesten | womens-health | piece | box | 1 | 850.00 | 50 | 10 | false | Yeast infection treatment
Breast Pump | Medela | womens-health | piece | box | 1 | 8500.00 | 15 | 3 | false | Electric breast pump
Iron Supplements (Prenatal) | Pregnacare | womens-health | tablet | box | 30 | 1250.00 | 40 | 8 | false | Pregnancy vitamins
Urinary Tract Infection Relief | Uricalm | womens-health | tablet | box | 30 | 950.00 | 55 | 11 | false | UTI symptom relief
Menstrual Cup | Mooncup | womens-health | piece | box | 1 | 2200.00 | 25 | 5 | false | Reusable menstrual product
Osteoporosis Calcium | Caltrate | womens-health | tablet | box | 60 | 1450.00 | 45 | 9 | false | Bone density support
Finasteride 1mg | Merck | mens-health | tablet | blister | 10 | 850.00 | 40 | 8 | false | Hair loss treatment
Sildenafil 50mg | Pfizer | mens-health | tablet | blister | 4 | 1250.00 | 30 | 6 | false | Erectile dysfunction
Prostate Support | Saw Palmetto | mens-health | capsule | box | 60 | 1850.00 | 35 | 7 | false | Prostate health
Men's Multivitamin | Centrum | mens-health | tablet | box | 90 | 2200.00 | 40 | 8 | false | Complete men's nutrition
Anti-Baldness Lotion | Minoxidil | mens-health | ml | bottle | 60 | 1850.00 | 25 | 5 | false | Topical hair regrowth
Testosterone Support | GNC | mens-health | capsule | box | 90 | 2800.00 | 20 | 4 | false | Energy & vitality
Shaving Cream | Gillette | mens-health | gram | tube | 200 | 650.00 | 70 | 14 | false | Shaving preparation
Athlete's Foot Spray | Scholl | mens-health | ml | bottle | 100 | 580.00 | 60 | 12 | false | Fungal infection treatment
Male Fertility Supplement | Profertil | mens-health | capsule | box | 30 | 3200.00 | 18 | 4 | false | Sperm health support
Beard Oil | Ustraa | mens-health | ml | bottle | 30 | 850.00 | 45 | 9 | false | Beard conditioning
Sensodyne Toothpaste | GlaxoSmithKline | dental-care | gram | tube | 100 | 850.00 | 80 | 16 | false | Sensitivity toothpaste
Oral-B Toothbrush | P&G | dental-care | piece | box | 1 | 320.00 | 120 | 24 | false | Manual toothbrush
Listerine Mouthwash | Johnson & Johnson | dental-care | ml | bottle | 250 | 650.00 | 70 | 14 | false | Antiseptic mouthwash
Dental Floss | Colgate | dental-care | piece | box | 50 | 280.00 | 95 | 19 | false | Waxed dental floss
Denture Adhesive Cream | Fixodent | dental-care | gram | tube | 40 | 850.00 | 45 | 9 | false | Denture secure cream
Teeth Whitening Strips | Crest | dental-care | piece | box | 14 | 2850.00 | 30 | 6 | false | At-home teeth whitening
Mouth Ulcer Gel | Orajel | dental-care | gram | tube | 10 | 420.00 | 65 | 13 | false | Pain relief for sores
Interdental Brushes | TePe | dental-care | piece | box | 8 | 580.00 | 55 | 11 | false | Cleaning between teeth
Fluoride Mouth Rinse | Colgate | dental-care | ml | bottle | 250 | 450.00 | 60 | 12 | false | Cavity prevention
Temporary Filling Kit | Dentemp | dental-care | piece | box | 1 | 1250.00 | 25 | 5 | false | Emergency dental repair
Pulse Oximeter | ChoiceMMed | home-healthcare | piece | box | 1 | 4500.00 | 25 | 5 | false | Blood oxygen monitor
Steam Inhaler | Omron | home-healthcare | piece | box | 1 | 6500.00 | 20 | 4 | false | Congestion relief
Bed Pan | Carex | home-healthcare | piece | box | 1 | 1250.00 | 35 | 7 | false | Patient care equipment
Urine Collection Bag | Bard | home-healthcare | piece | box | 10 | 850.00 | 45 | 9 | false | Medical drainage system
Walking Stick | Drive Medical | home-healthcare | piece | box | 1 | 850.00 | 50 | 10 | false | Mobility aid
Commode Chair | Invacare | home-healthcare | piece | box | 1 | 12500.00 | 12 | 3 | false | Toilet chair for patients
Heating Pad | Sunbeam | home-healthcare | piece | box | 1 | 2200.00 | 30 | 6 | false | Pain relief heat therapy
Air Purifier | Philips | home-healthcare | piece | box | 1 | 18500.00 | 10 | 2 | false | Clean air for allergies
Patient Lift | Handi-Move | home-healthcare | piece | box | 1 | 35000.00 | 5 | 1 | false | Moving immobile patients
Medical Alert System | LifeCall | home-healthcare | piece | box | 1 | 12500.00 | 15 | 3 | false | Fall detection & alert
Protein Powder (Whey) | Optimum Nutrition | fitness-weight | gram | box | 907 | 8500.00 | 25 | 5 | false | Muscle recovery protein
Meal Replacement Shake | Herbalife | fitness-weight | gram | box | 750 | 6500.00 | 30 | 6 | false | Weight loss shake
Fat Burner Capsules | MuscleTech | fitness-weight | capsule | box | 60 | 4500.00 | 35 | 7 | false | Thermogenic weight loss
BCAA Powder | BSN | fitness-weight | gram | box | 30 | 5800.00 | 28 | 6 | false | Branched-chain amino acids
Digital Body Fat Scale | Tanita | fitness-weight | piece | box | 1 | 12500.00 | 18 | 4 | false | Body composition scale
Resistance Bands | TheraBand | fitness-weight | piece | box | 5 | 2200.00 | 40 | 8 | false | Exercise bands
Pre-Workout Supplement | Cellucor | fitness-weight | gram | box | 30 | 6500.00 | 22 | 5 | false | Energy & focus
Weight Management Tea | Lipton | fitness-weight | gram | box | 25 | 850.00 | 60 | 12 | false | Metabolism support
Yoga Mat | Reebok | fitness-weight | piece | box | 1 | 3200.00 | 35 | 7 | false | Exercise mat
Appetite Suppressant | SlimFast | fitness-weight | capsule | box | 60 | 3800.00 | 32 | 7 | false | Hunger control
Insulin (Regular) | Novo Nordisk | cold-chain | piece | box | 1 | 1250.00 | 40 | 8 | false | Short-acting insulin
Hepatitis B Vaccine | GlaxoSmithKline | cold-chain | piece | box | 1 | 1850.00 | 25 | 5 | false | Hepatitis B immunization
Growth Hormone | Eli Lilly | cold-chain | piece | box | 1 | 12500.00 | 12 | 3 | false | Human growth hormone
Botulinum Toxin | Allergan | cold-chain | piece | box | 1 | 18500.00 | 8 | 2 | false | Cosmetic/therapeutic
Certain Antibiotics | Pfizer | cold-chain | piece | box | 1 | 850.00 | 30 | 6 | false | Azithromycin injection
IVF Medications | Merck | cold-chain | piece | box | 5 | 12500.00 | 15 | 3 | false | Fertility treatment
Rabies Vaccine | Sanofi | cold-chain | piece | box | 1 | 2200.00 | 20 | 4 | false | Rabies prevention
Cold Pack | Polar Tech | cold-chain | piece | box | 1 | 450.00 | 50 | 10 | false | Temperature maintenance
Vaccine Carrier | B Medical | cold-chain | piece | box | 1 | 8500.00 | 12 | 3 | false | Portable cold storage
Temperature Data Logger | DeltaTrak | cold-chain | piece | box | 1 | 12500.00 | 10 | 2 | false | Cold chain monitoring
Frontline Plus | Boehringer | pet-health | piece | box | 3 | 2200.00 | 35 | 7 | false | Flea & tick treatment
Pet Vitamins | Nutri-Vet | pet-health | tablet | box | 60 | 1250.00 | 40 | 8 | false | Pet multivitamin
Deworming Tablets | Bayer | pet-health | tablet | box | 2 | 580.00 | 50 | 10 | false | Intestinal worm treatment
Pet Shampoo | Davis | pet-health | ml | bottle | 500 | 850.00 | 45 | 9 | false | Skin condition treatment
Pet Ear Cleaner | Virbac | pet-health | ml | bottle | 100 | 650.00 | 55 | 11 | false | Ear hygiene for pets
Joint Supplement for Dogs | Cosequin | pet-health | tablet | box | 90 | 3200.00 | 30 | 6 | false | Dog joint health
Pet Dental Care | Greenies | pet-health | piece | box | 12 | 950.00 | 65 | 13 | false | Oral care chews
Pet Calming Aid | Pet Naturals | pet-health | piece | box | 30 | 1850.00 | 38 | 8 | false | Anxiety relief
Pet Eye Drops | Optixcare | pet-health | ml | bottle | 15 | 1250.00 | 42 | 9 | false | Dry eye relief
Pet First Aid Kit | RC Pet Products | pet-health | piece | box | 1 | 2800.00 | 25 | 5 | false | Emergency care for pets`;
