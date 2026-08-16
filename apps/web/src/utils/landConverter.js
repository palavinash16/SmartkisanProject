// Land Unit Conversion Utilities for Indian Agriculture

export const LAND_UNITS = [
  { code: 'acres', label: 'Acres (एकड़)', symbol: 'Acres' },
  { code: 'bigha', label: 'Pucca Bigha (पक्का बीघा)', symbol: 'Bigha' },
  { code: 'biswa', label: 'Biswa (बिस्वा)', symbol: 'Biswa' },
  { code: 'hectare', label: 'Hectare (हेक्टेयर)', symbol: 'Ha' },
  { code: 'sqyards', label: 'Square Yards (गज़)', symbol: 'Sq.Yd' }
];

// Conversion factors relative to 1 Acre
// 1 Acre = 1.6 Pucca Bigha = 32 Biswa = 0.404686 Hectares = 4840 Sq. Yards
export function convertLandArea(value, fromUnit) {
  const val = parseFloat(value) || 0;
  
  // Convert from input unit to base unit (Acres)
  let acres = 0;
  switch (fromUnit) {
    case 'acres':
      acres = val;
      break;
    case 'bigha':
      acres = val / 1.6; // 1 Acre = 1.6 Pucca Bigha
      break;
    case 'biswa':
      acres = val / 32; // 1 Bigha = 20 Biswa -> 1 Acre = 32 Biswa
      break;
    case 'hectare':
      acres = val * 2.47105; // 1 Hectare = 2.47105 Acres
      break;
    case 'sqyards':
      acres = val / 4840; // 1 Acre = 4840 Sq. Yards
      break;
    default:
      acres = val;
  }

  // Calculate all relative units from Acres
  const bigha = acres * 1.6;
  const biswa = acres * 32;
  const hectare = acres * 0.404686;
  const sqyards = acres * 4840;
  const sqfeet = acres * 43560;

  return {
    acres: parseFloat(acres.toFixed(2)),
    bigha: parseFloat(bigha.toFixed(2)),
    biswa: parseFloat(biswa.toFixed(1)),
    hectare: parseFloat(hectare.toFixed(3)),
    sqyards: Math.round(sqyards),
    sqfeet: Math.round(sqfeet),
    formattedText: `${acres.toFixed(2)} Acres ≈ ${bigha.toFixed(2)} Bigha (${biswa.toFixed(1)} Biswa)`
  };
}
