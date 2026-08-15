/**
 * DAM HIKES - PCT Southbound (SOBO) Route & Elevation Dataset
 */

export const START_MILE = 2150;
export const START_DATE = "2026-08-14";
export const START_NAME = "Cascade Locks, OR";
export const TRAIL_NAME = "2150 South";

export const PCT_WAYPOINTS = [
  { name: "Cascade Locks", mile: 2150, lat: 45.6626, lon: -121.9006, state: "OR" },
  { name: "Wahtum Lake", mile: 2128, lat: 45.581, lon: -121.795, state: "OR" },
  { name: "Timberline Lodge", mile: 2097, lat: 45.3311, lon: -121.711, state: "OR" },
  { name: "Olallie Lake", mile: 2048, lat: 44.814, lon: -121.789, state: "OR" },
  { name: "Santiam Pass", mile: 2001, lat: 44.425, lon: -121.849, state: "OR" },
  { name: "Elk Lake", mile: 1955, lat: 43.979, lon: -121.805, state: "OR" },
  { name: "Willamette Pass", mile: 1903, lat: 43.6, lon: -122.037, state: "OR" },
  { name: "Crater Lake", mile: 1823, lat: 42.911, lon: -122.148, state: "OR" },
  { name: "Fish Lake", mile: 1762, lat: 42.377, lon: -122.319, state: "OR" },
  { name: "Callahan's", mile: 1717, lat: 42.081, lon: -122.606, state: "OR" },
  { name: "Oregon / California", mile: 1692, lat: 42.005, lon: -122.907, state: "CA" },
  { name: "Seiad Valley", mile: 1655, lat: 41.843, lon: -123.193, state: "CA" },
  { name: "Etna Summit", mile: 1600, lat: 41.39, lon: -122.994, state: "CA" },
  { name: "Castle Crags", mile: 1499, lat: 41.146, lon: -122.317, state: "CA" },
  { name: "Burney Falls", mile: 1418, lat: 41.021, lon: -121.652, state: "CA" },
  { name: "Drakesbad", mile: 1331, lat: 40.443, lon: -121.397, state: "CA" },
  { name: "Belden", mile: 1286, lat: 40.006, lon: -121.249, state: "CA" },
  { name: "Sierra City", mile: 1195, lat: 39.563, lon: -120.637, state: "CA" },
  { name: "Donner Pass", mile: 1157, lat: 39.317, lon: -120.327, state: "CA" },
  { name: "Echo Lake", mile: 1092, lat: 38.834, lon: -120.044, state: "CA" },
  { name: "Sonora Pass", mile: 1017, lat: 38.328, lon: -119.637, state: "CA" },
  { name: "Tuolumne Meadows", mile: 942, lat: 37.875, lon: -119.367, state: "CA" },
  { name: "Reds Meadow", mile: 906, lat: 37.616, lon: -119.074, state: "CA" },
  { name: "Muir Trail Ranch", mile: 855, lat: 37.22, lon: -118.8, state: "CA" },
  { name: "Muir Pass", mile: 838, lat: 37.111, lon: -118.671, state: "CA" },
  { name: "Kearsarge", mile: 789, lat: 36.772, lon: -118.376, state: "CA" },
  { name: "Crabtree Meadow", mile: 766, lat: 36.547, lon: -118.292, state: "CA" },
  { name: "Cottonwood Pass", mile: 746, lat: 36.448, lon: -118.17, state: "CA" },
  { name: "Kennedy Meadows South", mile: 702, lat: 36.048, lon: -118.132, state: "CA" },
  { name: "Walker Pass", mile: 652, lat: 35.663, lon: -118.057, state: "CA" },
  { name: "Tehachapi", mile: 566, lat: 35.103, lon: -118.283, state: "CA" },
  { name: "Hikertown", mile: 517, lat: 34.823, lon: -118.616, state: "CA" },
  { name: "Agua Dulce", mile: 454, lat: 34.496, lon: -118.326, state: "CA" },
  { name: "Wrightwood", mile: 369, lat: 34.361, lon: -117.633, state: "CA" },
  { name: "Big Bear City", mile: 266, lat: 34.261, lon: -116.911, state: "CA" },
  { name: "Saddle Junction", mile: 179, lat: 33.772, lon: -116.687, state: "CA" },
  { name: "Warner Springs", mile: 110, lat: 33.282, lon: -116.634, state: "CA" },
  { name: "Mount Laguna", mile: 42, lat: 32.872, lon: -116.419, state: "CA" },
  { name: "Campo", mile: 0, lat: 32.5898, lon: -116.4669, state: "CA" },
];

export const ELEVATION_PROFILE = [
  { mile: 2150, elevFt: 180, label: "Cascade Locks" },
  { mile: 2144, elevFt: 3920 },
  { mile: 2128, elevFt: 3730, label: "Wahtum Lake" },
  { mile: 2107, elevFt: 4155 },
  { mile: 2097, elevFt: 5920, label: "Timberline" },
  { mile: 2074, elevFt: 3180 },
  { mile: 2048, elevFt: 4960, label: "Olallie" },
  { mile: 2020, elevFt: 5900 },
  { mile: 2001, elevFt: 4817, label: "Santiam" },
  { mile: 1972, elevFt: 6500 },
  { mile: 1955, elevFt: 4900 },
  { mile: 1934, elevFt: 6100 },
  { mile: 1903, elevFt: 5128, label: "Willamette" },
  { mile: 1866, elevFt: 5900 },
  { mile: 1823, elevFt: 7100, label: "Crater Lake" },
  { mile: 1788, elevFt: 6200 },
  { mile: 1762, elevFt: 4640 },
  { mile: 1717, elevFt: 4810 },
  { mile: 1692, elevFt: 5310, label: "OR / CA" },
  { mile: 1674, elevFt: 2800 },
  { mile: 1655, elevFt: 1370, label: "Seiad Valley" },
  { mile: 1622, elevFt: 5600 },
  { mile: 1600, elevFt: 5960, label: "Etna Summit" },
  { mile: 1548, elevFt: 2900 },
  { mile: 1499, elevFt: 2200, label: "Castle Crags" },
  { mile: 1456, elevFt: 4600 },
  { mile: 1418, elevFt: 3180 },
  { mile: 1374, elevFt: 5100 },
  { mile: 1331, elevFt: 5720 },
  { mile: 1286, elevFt: 2310, label: "Belden" },
  { mile: 1238, elevFt: 5600 },
  { mile: 1195, elevFt: 4190 },
  { mile: 1157, elevFt: 7088, label: "Donner" },
  { mile: 1124, elevFt: 7900 },
  { mile: 1092, elevFt: 7414 },
  { mile: 1052, elevFt: 8600 },
  { mile: 1017, elevFt: 9624, label: "Sonora Pass" },
  { mile: 978, elevFt: 8100 },
  { mile: 942, elevFt: 8583, label: "Tuolumne" },
  { mile: 906, elevFt: 7720 },
  { mile: 878, elevFt: 9800 },
  { mile: 855, elevFt: 7800 },
  { mile: 838, elevFt: 11955, label: "Muir Pass" },
  { mile: 814, elevFt: 12100 },
  { mile: 796, elevFt: 10500 },
  { mile: 779, elevFt: 13153, label: "Forester" },
  { mile: 766, elevFt: 10700 },
  { mile: 746, elevFt: 11145 },
  { mile: 720, elevFt: 8600 },
  { mile: 702, elevFt: 6100, label: "Kennedy Meadows" },
  { mile: 674, elevFt: 7600 },
  { mile: 652, elevFt: 5246 },
  { mile: 608, elevFt: 4300 },
  { mile: 566, elevFt: 3790, label: "Tehachapi" },
  { mile: 517, elevFt: 2980 },
  { mile: 454, elevFt: 2520, label: "Agua Dulce" },
  { mile: 410, elevFt: 4600 },
  { mile: 369, elevFt: 5930, label: "Wrightwood" },
  { mile: 310, elevFt: 5400 },
  { mile: 266, elevFt: 6770, label: "Big Bear" },
  { mile: 210, elevFt: 7400 },
  { mile: 179, elevFt: 8100, label: "San Jacinto" },
  { mile: 148, elevFt: 5400 },
  { mile: 110, elevFt: 3130, label: "Warner Springs" },
  { mile: 72, elevFt: 4100 },
  { mile: 42, elevFt: 5960, label: "Laguna" },
  { mile: 18, elevFt: 3400 },
  { mile: 0, elevFt: 2915, label: "Campo" },
];

export function milesWalked(currentMile) {
  return Math.max(0, START_MILE - currentMile);
}

export function daysOnTrail(fromIso = START_DATE, now = new Date()) {
  const start = new Date(`${fromIso}T06:00:00-07:00`);
  const ms = now.getTime() - start.getTime();
  if (ms < 0) return 0;
  return Math.floor(ms / 86400000) + 1;
}

export function hasStarted(now = new Date()) {
  return now.getTime() >= new Date(`${START_DATE}T06:00:00-07:00`).getTime();
}

export function positionAtMile(mile) {
  const clamped = Math.min(START_MILE, Math.max(0, mile));
  const pts = PCT_WAYPOINTS;
  if (clamped >= pts[0].mile) return { lat: pts[0].lat, lon: pts[0].lon };
  const last = pts[pts.length - 1];
  if (clamped <= last.mile) return { lat: last.lat, lon: last.lon };

  for (let i = 0; i < pts.length - 1; i += 1) {
    const a = pts[i];
    const b = pts[i + 1];
    if (clamped <= a.mile && clamped >= b.mile) {
      const t = (a.mile - clamped) / (a.mile - b.mile || 1);
      return {
        lat: a.lat + (b.lat - a.lat) * t,
        lon: a.lon + (b.lon - a.lon) * t,
      };
    }
  }
  return { lat: pts[0].lat, lon: pts[0].lon };
}

export function splitRoute(currentMile) {
  const walked = [];
  const remain = [];
  const here = positionAtMile(currentMile);

  for (let i = 0; i < PCT_WAYPOINTS.length; i += 1) {
    const wp = PCT_WAYPOINTS[i];
    const pair = [wp.lat, wp.lon];
    if (wp.mile >= currentMile) walked.push(pair);
    if (wp.mile <= currentMile) remain.push(pair);
  }

  if (walked.length === 0 || walked[walked.length - 1][0] !== here.lat) {
    walked.push([here.lat, here.lon]);
  }
  if (remain.length === 0 || remain[0][0] !== here.lat) {
    remain.unshift([here.lat, here.lon]);
  }

  return { walked, remain, here };
}

export function placeEntriesOnTrail(entries) {
  const groups = new Map();
  for (const entry of entries) {
    const key = Math.round(entry.mile);
    const list = groups.get(key) || [];
    list.push(entry);
    groups.set(key, list);
  }

  const beads = [];
  for (const group of groups.values()) {
    group.sort((a, b) => {
      if (a.date === b.date) return a.id.localeCompare(b.id);
      return a.date.localeCompare(b.date);
    });

    group.forEach((entry, i) => {
      const displayMile = Math.max(0, entry.mile - i * 2.4);
      const origin = positionAtMile(displayMile);
      beads.push({
        id: entry.id,
        mile: entry.mile,
        lat: origin.lat,
        lon: origin.lon,
      });
    });
  }
  return beads;
}

const MIN_ELEV = 0;
const MAX_ELEV = 13600;

export function elevationAtMile(mile) {
  const clamped = Math.min(START_MILE, Math.max(0, mile));
  const pts = ELEVATION_PROFILE;
  if (clamped >= pts[0].mile) return pts[0];
  const last = pts[pts.length - 1];
  if (clamped <= last.mile) return last;

  for (let i = 0; i < pts.length - 1; i += 1) {
    const a = pts[i];
    const b = pts[i + 1];
    if (clamped <= a.mile && clamped >= b.mile) {
      const t = (a.mile - clamped) / (a.mile - b.mile || 1);
      return {
        mile: clamped,
        elevFt: Math.round(a.elevFt + (b.elevFt - a.elevFt) * t),
        label: t < 0.35 ? a.label : t > 0.65 ? b.label : undefined,
      };
    }
  }
  return pts[0];
}

export function formatElevation(ft) {
  return `${new Intl.NumberFormat("en-US").format(Math.round(ft))} ft`;
}

export function formatMiles(m) {
  return Number(m).toFixed(1);
}
