/**
 * DAM HIKES - PCT Southbound (SOBO) Route Dataset
 * Cascade Locks, OR (Bridge of the Gods) to Campo, CA (Southern Terminus)
 * Total Distance: ~2,150.0 Miles
 */

export const PCT_SECTIONS = [
  {
    id: 'oregon',
    name: 'Oregon Cascades',
    startMile: 0.0,
    endMile: 430.0,
    color: '#10B981',
    description: 'Bridge of the Gods, Mt. Hood, Jefferson Park, Three Sisters, Crater Lake to Siskiyou Summit.'
  },
  {
    id: 'norcal',
    name: 'Northern California',
    startMile: 430.0,
    endMile: 980.0,
    color: '#0D9488',
    description: 'Marble Mountains, Castle Crags, Mt. Shasta vista, Burney Falls, Lassen Volcanic to Sierra City.'
  },
  {
    id: 'sierra',
    name: 'High Sierra Nevada',
    startMile: 980.0,
    endMile: 1515.0,
    color: '#3B82F6',
    description: 'Lake Tahoe, Tuolumne Meadows, Donohue Pass, Muir Pass, Forester Pass (13,200 ft) to Kennedy Meadows South.'
  },
  {
    id: 'socal',
    name: 'Southern California & Desert',
    startMile: 1515.0,
    endMile: 2150.0,
    color: '#F59E0B',
    description: 'Mojave Desert, LA Aqueduct, San Gabriel Ridge, Mt. Baden-Powell, San Jacinto, Julian to Campo Terminus.'
  }
];

export const MAJOR_LANDMARKS = [
  { mile: 0.0, name: 'Bridge of the Gods / Cascade Locks', elevFt: 180, lat: 45.6625, lng: -121.8950, section: 'oregon' },
  { mile: 37.8, name: 'Lolo Pass / Mt. Hood Vista', elevFt: 3420, lat: 45.4278, lng: -121.7967, section: 'oregon' },
  { mile: 49.2, name: 'Timberline Lodge', elevFt: 6000, lat: 45.3311, lng: -121.7110, section: 'oregon' },
  { mile: 118.0, name: 'Jefferson Park / Mt. Jefferson', elevFt: 5800, lat: 44.7125, lng: -121.7950, section: 'oregon' },
  { mile: 168.2, name: 'McKenzie Pass / Lava Beds', elevFt: 5325, lat: 44.2592, lng: -121.8105, section: 'oregon' },
  { mile: 185.0, name: 'Obsidian Trail / Three Sisters', elevFt: 6100, lat: 44.1750, lng: -121.8420, section: 'oregon' },
  { mile: 338.0, name: 'Mt. Thielsen Creek', elevFt: 6900, lat: 43.1492, lng: -122.0910, section: 'oregon' },
  { mile: 360.5, name: 'Crater Lake Rim Trail', elevFt: 7100, lat: 42.9125, lng: -122.1450, section: 'oregon' },
  { mile: 430.0, name: 'Siskiyou Summit / OR-CA Border', elevFt: 4310, lat: 42.0620, lng: -122.6025, section: 'oregon' },
  { mile: 520.0, name: 'Marble Mountain Wilderness', elevFt: 6600, lat: 41.5280, lng: -123.1850, section: 'norcal' },
  { mile: 642.0, name: 'Castle Crags State Park', elevFt: 2100, lat: 41.1620, lng: -122.3120, section: 'norcal' },
  { mile: 725.0, name: 'Burney Falls', elevFt: 3000, lat: 41.0125, lng: -121.6510, section: 'norcal' },
  { mile: 795.0, name: 'Lassen Volcanic / Drakesbad', elevFt: 5700, lat: 40.4410, lng: -121.4110, section: 'norcal' },
  { mile: 825.0, name: 'PCT Midpoint Marker (1,325 mi NOBO / 825 mi SOBO)', elevFt: 4950, lat: 40.2315, lng: -121.3250, section: 'norcal' },
  { mile: 955.0, name: 'Sierra City / Sierra Buttes', elevFt: 4140, lat: 39.5620, lng: -120.6380, section: 'norcal' },
  { mile: 998.0, name: 'Donner Pass / Truckee', elevFt: 7056, lat: 39.3160, lng: -120.3275, section: 'sierra' },
  { mile: 1050.0, name: 'Desolation Wilderness / Lake Aloha', elevFt: 8115, lat: 38.8650, lng: -120.1420, section: 'sierra' },
  { mile: 1160.0, name: 'Sonora Pass', elevFt: 9624, lat: 38.3280, lng: -119.6370, section: 'sierra' },
  { mile: 1225.0, name: 'Tuolumne Meadows (Yosemite)', elevFt: 8600, lat: 37.8750, lng: -119.3560, section: 'sierra' },
  { mile: 1240.0, name: 'Donohue Pass (11,066 ft)', elevFt: 11066, lat: 37.7635, lng: -119.2450, section: 'sierra' },
  { mile: 1255.0, name: 'Thousand Island Lake / Ansel Adams', elevFt: 9833, lat: 37.7120, lng: -119.1750, section: 'sierra' },
  { mile: 1365.0, name: 'Muir Pass & John Muir Memorial Hut', elevFt: 11955, lat: 37.1125, lng: -118.6690, section: 'sierra' },
  { mile: 1438.0, name: 'Forester Pass Summit (13,200 ft - Highest Point)', elevFt: 13200, lat: 36.6942, lng: -118.3735, section: 'sierra' },
  { mile: 1455.0, name: 'Crabtree Meadow / Mt. Whitney Spur', elevFt: 10640, lat: 36.5650, lng: -118.3480, section: 'sierra' },
  { mile: 1515.0, name: 'Kennedy Meadows South', elevFt: 6200, lat: 36.0125, lng: -118.1250, section: 'sierra' },
  { mile: 1635.0, name: 'Tehachapi Pass Wind Farm', elevFt: 3793, lat: 35.1050, lng: -118.2850, section: 'socal' },
  { mile: 1720.0, name: 'LA Aqueduct Night Section', elevFt: 2650, lat: 34.8250, lng: -118.3850, section: 'socal' },
  { mile: 1770.0, name: 'Vasquez Rocks / Agua Dulce', elevFt: 2500, lat: 34.4980, lng: -118.3210, section: 'socal' },
  { mile: 1820.0, name: 'Mt. Baden-Powell Summit (9,399 ft)', elevFt: 9399, lat: 34.3585, lng: -117.7650, section: 'socal' },
  { mile: 1910.0, name: 'Deep Creek Hot Springs', elevFt: 3000, lat: 34.3410, lng: -117.1750, section: 'socal' },
  { mile: 2025.0, name: 'Mt. San Jacinto / Idyllwild', elevFt: 8800, lat: 33.7420, lng: -116.7150, section: 'socal' },
  { mile: 2105.0, name: 'Scissors Crossing / Anza-Borrego', elevFt: 2250, lat: 33.0980, lng: -116.4800, section: 'socal' },
  { mile: 2130.0, name: 'Mount Laguna Pine House', elevFt: 5900, lat: 32.8680, lng: -116.4180, section: 'socal' },
  { mile: 2150.0, name: 'Campo Southern Terminus (US/Mexico Border)', elevFt: 2915, lat: 32.5897, lng: -116.4680, section: 'socal' }
];

export const PCT_ROUTE_POINTS = [
  // --- OREGON (Mile 0 - 430) ---
  [45.6625, -121.8950, 180, 0.0],
  [45.6410, -121.8820, 1100, 4.2],
  [45.6020, -121.8650, 2400, 8.5],
  [45.5650, -121.8480, 3750, 13.5],
  [45.5230, -121.8210, 3100, 22.0],
  [45.4780, -121.8050, 3350, 30.4],
  [45.4278, -121.7967, 3420, 37.8],
  [45.3850, -121.7580, 4800, 43.1],
  [45.3311, -121.7110, 6000, 49.2],
  [45.2890, -121.6850, 4300, 58.0],
  [45.2150, -121.6620, 3900, 72.0],
  [45.1420, -121.6890, 4100, 86.5],
  [45.0350, -121.7320, 4950, 102.5],
  [44.8210, -121.7750, 5300, 110.0],
  [44.7125, -121.7950, 5800, 118.0],
  [44.5820, -121.8150, 4950, 132.0],
  [44.4250, -121.8020, 4817, 145.0],
  [44.3210, -121.8110, 5100, 157.0],
  [44.2592, -121.8105, 5325, 168.2],
  [44.1750, -121.8420, 6100, 185.0],
  [44.0850, -121.8150, 6550, 201.0],
  [43.9850, -121.8050, 4900, 212.0],
  [43.8420, -121.8550, 5200, 232.0],
  [43.7250, -121.9120, 5700, 255.0],
  [43.6050, -122.0350, 5128, 272.0],
  [43.5120, -122.1150, 6400, 290.0],
  [43.3850, -122.0850, 5800, 315.0],
  [43.1492, -122.0910, 6900, 338.0],
  [42.9125, -122.1450, 7100, 360.5],
  [42.8650, -122.1650, 6000, 366.0],
  [42.6120, -122.2550, 5100, 388.0],
  [42.3450, -122.3850, 5200, 410.0],
  [42.0620, -122.6025, 4310, 430.0],

  // --- NORTHERN CALIFORNIA (Mile 430 - 980) ---
  [41.9150, -122.8450, 5800, 455.0],
  [41.7920, -123.1250, 1400, 485.0],
  [41.5280, -123.1850, 6600, 520.0],
  [41.3850, -122.9850, 5900, 550.0],
  [41.2450, -122.7150, 6700, 585.0],
  [41.1620, -122.3120, 2100, 642.0],
  [41.2150, -122.1850, 5200, 670.0],
  [41.1150, -121.8450, 4100, 700.0],
  [41.0125, -121.6510, 3000, 725.0],
  [40.8450, -121.5120, 4400, 755.0],
  [40.6120, -121.4450, 5400, 778.0],
  [40.4410, -121.4110, 5700, 795.0],
  [40.3120, -121.3650, 4500, 815.0],
  [40.2315, -121.3250, 4950, 825.0],
  [40.0150, -121.2450, 2218, 860.0],
  [39.8850, -120.9850, 5600, 885.0],
  [39.7120, -120.7850, 6400, 920.0],
  [39.5620, -120.6380, 4140, 955.0],

  // --- HIGH SIERRA NEVADA (Mile 980 - 1515) ---
  [39.3160, -120.3275, 7056, 998.0],
  [39.1850, -120.2450, 7800, 1020.0],
  [38.8650, -120.1420, 8115, 1050.0],
  [38.7950, -120.0350, 7382, 1065.0],
  [38.6950, -119.9850, 8573, 1090.0],
  [38.5450, -119.8150, 8730, 1120.0],
  [38.3280, -119.6370, 9624, 1160.0],
  [38.1250, -119.5150, 9800, 1185.0],
  [37.8750, -119.3560, 8600, 1225.0],
  [37.7635, -119.2450, 11066, 1240.0],
  [37.7120, -119.1750, 9833, 1255.0],
  [37.6320, -119.0850, 7600, 1270.0],
  [37.4950, -118.9650, 10750, 1295.0],
  [37.3850, -118.8950, 7800, 1320.0],
  [37.2850, -118.8250, 10910, 1335.0],
  [37.1125, -118.6690, 11955, 1365.0],
  [37.0250, -118.5450, 12100, 1385.0],
  [36.9150, -118.4450, 12050, 1402.0],
  [36.7950, -118.4050, 11926, 1418.0],
  [36.6942, -118.3735, 13200, 1438.0],
  [36.5650, -118.3480, 10640, 1455.0],
  [36.4150, -118.2550, 11140, 1480.0],
  [36.0125, -118.1250, 6200, 1515.0],

  // --- SOUTHERN CALIFORNIA & DESERT (Mile 1515 - 2150) ---
  [35.8250, -118.0850, 5500, 1545.0],
  [35.6650, -118.0250, 5246, 1570.0],
  [35.4120, -118.1150, 4800, 1600.0],
  [35.1050, -118.2850, 3793, 1635.0],
  [34.9850, -118.3150, 4200, 1665.0],
  [34.8950, -118.3750, 2900, 1700.0],
  [34.8250, -118.3850, 2650, 1720.0],
  [34.6120, -118.4150, 3400, 1745.0],
  [34.4980, -118.3210, 2500, 1770.0],
  [34.4150, -118.1850, 2700, 1785.0],
  [34.3585, -117.7650, 9399, 1820.0],
  [34.3120, -117.6550, 7380, 1835.0],
  [34.3100, -117.4450, 3000, 1860.0],
  [34.2950, -117.3150, 3400, 1885.0],
  [34.3410, -117.1750, 3000, 1910.0],
  [34.2650, -116.8950, 6750, 1945.0],
  [34.0950, -116.7850, 3200, 1975.0],
  [33.9150, -116.6950, 1450, 1995.0],
  [33.7420, -116.7150, 8800, 2025.0],
  [33.5650, -116.6050, 4900, 2050.0],
  [33.2850, -116.6350, 3130, 2080.0],
  [33.0980, -116.4800, 2250, 2105.0],
  [32.8680, -116.4180, 5900, 2130.0],
  [32.6950, -116.5150, 3100, 2142.0],
  [32.5897, -116.4680, 2915, 2150.0]
];

export function getRoutePointForMile(mile) {
  if (mile <= 0) return PCT_ROUTE_POINTS[0];
  if (mile >= 2150) return PCT_ROUTE_POINTS[PCT_ROUTE_POINTS.length - 1];

  for (let i = 0; i < PCT_ROUTE_POINTS.length - 1; i++) {
    const p1 = PCT_ROUTE_POINTS[i];
    const p2 = PCT_ROUTE_POINTS[i + 1];
    if (mile >= p1[3] && mile <= p2[3]) {
      const ratio = (mile - p1[3]) / (p2[3] - p1[3]);
      return [
        p1[0] + (p2[0] - p1[0]) * ratio,
        p1[1] + (p2[1] - p1[1]) * ratio,
        Math.round(p1[2] + (p2[2] - p1[2]) * ratio),
        mile
      ];
    }
  }
  return PCT_ROUTE_POINTS[PCT_ROUTE_POINTS.length - 1];
}
