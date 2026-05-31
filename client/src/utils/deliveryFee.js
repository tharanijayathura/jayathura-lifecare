// client/src/utils/deliveryFee.js

const CITY_DISTANCES = {
  // Matara District (Local area)
  'kamburupitiya': 0.5,
  'matara': 15,
  'akuressa': 15,
  'hakmana': 12,
  'weligama': 27,
  'dikwella': 32,
  'deniyaya': 50,
  'gandara': 22,
  'devinuwara': 21,
  'dondra': 21,
  'kekanadurra': 14,
  'mirissa': 24,
  'thihagoda': 8,
  'kirinda': 18,
  'yatiyana': 9,
  'mulatiyana': 14,
  'pasgoda': 28,
  
  // Nearby districts
  'galle': 45,
  'hambantota': 90,
  'tangalle': 48,
  'beliatta': 35,
  
  // Major cities
  'colombo': 160,
  'kandy': 220,
  'gampaha': 175,
  'negombo': 195,
  'kalutara': 120,
  'panadura': 135,
  'moratuwa': 140,
  'kurunegala': 240,
  'jaffna': 450,
};

export const getDistanceForCity = (city) => {
  if (!city) return 15; // default fallback
  const normalizedCity = city.trim().toLowerCase().replace(/[^a-z]/g, '');
  const distance = CITY_DISTANCES[normalizedCity];
  return distance !== undefined ? distance : 15;
};

export const calculateDeliveryFee = (city) => {
  const distance = getDistanceForCity(city);
  if (distance > 15) {
    return 350; // Long-distance courier flat rate
  }
  if (distance <= 1) {
    return 100; // Local base rate
  }
  const localFee = 100 + Math.ceil((distance - 1) / 2) * 100;
  return Math.min(localFee, 350); // Cap local rate at flat rate max
};
