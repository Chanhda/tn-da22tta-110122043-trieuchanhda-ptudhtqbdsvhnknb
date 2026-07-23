import { type HeritageDocument } from '@/lib/heritage-repository';

export interface LatLng {
  latitude: number;
  longitude: number;
}

const PROVINCE_COORDINATES: Record<string, LatLng> = {
  'tp. hồ chí minh': { latitude: 10.7905, longitude: 106.6835 },
  'sài gòn': { latitude: 10.7905, longitude: 106.6835 },
  'hồ chí minh': { latitude: 10.7905, longitude: 106.6835 },
  'sóc trăng': { latitude: 9.6025, longitude: 105.9723 },
  'trà vinh': { latitude: 9.9333, longitude: 106.3333 },
  'bạc liêu': { latitude: 9.2942, longitude: 105.7278 },
  'an giang': { latitude: 10.5369, longitude: 105.2195 },
  'kiên giang': { latitude: 10.0150, longitude: 104.9961 },
  'cần thơ': { latitude: 10.0371, longitude: 105.7883 },
  'vĩnh long': { latitude: 10.2532, longitude: 105.9722 },
  'cà mau': { latitude: 9.1769, longitude: 105.1524 },
  'hậu giang': { latitude: 9.7844, longitude: 105.4700 },
};

// Specific well-known sites
const SPECIFIC_HERITAGE_COORDINATES: Record<string, LatLng> = {
  'chua-chantarangsay': { latitude: 10.7905, longitude: 106.6835 },
  'chua-doi': { latitude: 9.5886, longitude: 105.9803 },
  'le-hoi-ooc-om-bok': { latitude: 9.6025, longitude: 105.9723 },
  'ro-bam': { latitude: 9.9333, longitude: 106.3333 },
  'ghe-ngo': { latitude: 9.9483, longitude: 106.3483 },
};

export function getHeritageCoordinates(heritage: HeritageDocument, index: number): LatLng {
  // 1. If explicit location is specified
  if (heritage.location?.lat && heritage.location?.lng) {
    return {
      latitude: heritage.location.lat,
      longitude: heritage.location.lng,
    };
  }

  // 2. Check well-known IDs
  const idLower = heritage.id.toLowerCase();
  if (SPECIFIC_HERITAGE_COORDINATES[idLower]) {
    return SPECIFIC_HERITAGE_COORDINATES[idLower];
  }

  // 3. Fallback to Province coordinates
  const provLower = (heritage.province ?? '').toLowerCase().trim();
  const baseCoords = PROVINCE_COORDINATES[provLower] ?? { latitude: 9.8, longitude: 106.1 };

  // If using province default, offset slightly by index to prevent absolute overlapping
  // offset pattern creates a small grid: e.g. -0.015, 0, +0.015
  const row = index % 3 - 1; // -1, 0, 1
  const col = Math.floor(index / 3) % 3 - 1; // -1, 0, 1
  
  // Apply a small offset (approx 1.5km - 2.5km)
  const offsetLatitude = baseCoords.latitude + (row * 0.012) + (col * 0.005);
  const offsetLongitude = baseCoords.longitude + (col * 0.012) + (row * 0.005);

  return {
    latitude: offsetLatitude,
    longitude: offsetLongitude,
  };
}
