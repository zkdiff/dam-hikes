/**
 * DAM HIKES - Leaflet Satellite Map & Category-Aware Trail Beads Renderer
 */

import { PCT_WAYPOINTS, splitRoute, positionAtMile, placeEntriesOnTrail } from './data/pct-route.js';
import { store } from './state.js';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const CATEGORY_COLORS = {
  campsite: '#10B981',
  milestone: '#3B82F6',
  resupply: '#F59E0B',
  wildlife: '#8B5CF6',
  hardship: '#EF4444',
  reflection: '#EC4899'
};

const CATEGORY_ICONS = {
  campsite: '⛺',
  milestone: '🏔️',
  resupply: '🍕',
  wildlife: '🐻',
  hardship: '⚡',
  reflection: '📖'
};

function createBeadIcon(entry, isSelected, isLatest) {
  const size = isSelected ? 48 : 32;
  const photo = entry.photos && entry.photos.length > 0 ? entry.photos[0] : null;
  const color = CATEGORY_COLORS[entry.category] || '#c5d4a8';
  const icon = CATEGORY_ICONS[entry.category] || '📍';

  const media = photo
    ? `<img src="${escapeHtml(photo.src)}" alt="" />`
    : `<span>${icon}</span>`;
  
  const label = isSelected
    ? `<span class="trail-bead-label" style="border-color: ${color};">
        <span style="color: ${color}; margin-right: 4px;">${icon}</span>
        ${escapeHtml(entry.title)}
       </span>`
    : '';

  const html = `
    <div class="trail-bead-wrap">
      <div class="trail-bead ${isSelected ? 'is-selected' : ''} ${isLatest ? 'is-now' : ''}" style="--bead-color: ${color}; ${isSelected ? `border-color: ${color}; box-shadow: 0 0 0 4px ${color}55;` : ''}">
        ${media}
      </div>
      ${label}
    </div>
  `;

  return L.divIcon({
    className: 'trail-bead-icon',
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
}

export class TrailMap {
  constructor(containerId) {
    this.containerId = containerId;
    this.map = null;
    this.walkedLine = null;
    this.remainGlow = null;
    this.remainLine = null;
    this.beadLayer = null;
    this.endsLayer = null;
    this.scrubLayer = null;
    this.lastFocus = '';
  }

  init() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const currentPos = store.getCurrentPosition();
    const here = positionAtMile(currentPos.mile);

    this.map = L.map(this.containerId, {
      center: [here.lat, here.lon],
      zoom: 10,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
      minZoom: 5,
      maxZoom: 16
    });

    // Satellite Imagery Layer (Esri World Imagery)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 17,
      attribution: 'Esri, Maxar'
    }).addTo(this.map);

    L.control.attribution({ position: 'topright', prefix: false })
      .addTo(this.map)
      .addAttribution('Esri · Maxar');

    // Polylines
    this.walkedLine = L.polyline([], {
      color: '#e4dccb',
      weight: 2,
      opacity: 0.55,
      lineCap: 'round',
      lineJoin: 'round',
      interactive: false
    }).addTo(this.map);

    this.remainGlow = L.polyline([], {
      color: '#c5d4a8',
      weight: 12,
      opacity: 0.22,
      lineCap: 'round',
      lineJoin: 'round',
      interactive: false
    }).addTo(this.map);

    this.remainLine = L.polyline([], {
      color: '#c5d4a8',
      weight: 4,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round',
      interactive: false
    }).addTo(this.map);

    // Layer Groups
    this.beadLayer = L.layerGroup().addTo(this.map);
    this.endsLayer = L.layerGroup().addTo(this.map);
    this.scrubLayer = L.layerGroup().addTo(this.map);

    this.updateRoute();
    this.updateBeads();
    this.updateCamera();

    // Store Subscriptions
    store.subscribe((s, eventType) => {
      if (['select_change', 'frame_change', 'entry_added', 'entry_updated', 'entry_deleted', 'filter_change'].includes(eventType)) {
        this.updateRoute();
        this.updateBeads();
        this.updateCamera();
      } else if (eventType === 'scrub_change') {
        this.updateScrub();
      }
    });

    // Zoom Buttons
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => this.map.zoomIn());
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => this.map.zoomOut());
    document.getElementById('btn-frame-here')?.addEventListener('click', () => store.setFrame('here'));
    document.getElementById('btn-frame-trail')?.addEventListener('click', () => store.setFrame('trail'));

    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
  }

  updateRoute() {
    const selected = store.getSelectedEntry();
    const mile = selected ? selected.mile : 2150.0;
    const { walked, remain } = splitRoute(mile);

    this.walkedLine.setLatLngs(walked);
    this.remainGlow.setLatLngs(remain);
    this.remainLine.setLatLngs(remain);

    // Ends markers
    this.endsLayer.clearLayers();
    const start = PCT_WAYPOINTS[0];
    const end = PCT_WAYPOINTS[PCT_WAYPOINTS.length - 1];

    if (Math.abs(mile - start.mile) > 3) {
      L.marker([start.lat, start.lon], {
        icon: L.divIcon({
          className: 'trail-bead-icon',
          html: `<div class="trail-terminus" title="Cascade Locks Start"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        }),
        interactive: false
      }).addTo(this.endsLayer);
    }

    L.marker([end.lat, end.lon], {
      icon: L.divIcon({
        className: 'trail-bead-icon',
        html: `<div class="trail-campo" title="Campo Southern Terminus"></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5]
      }),
      interactive: false
    }).addTo(this.endsLayer);

    const here = positionAtMile(mile);
    const isSelected = selected && Math.abs(selected.mile - mile) < 1;
    if (!isSelected) {
      L.marker([here.lat, here.lon], {
        icon: L.divIcon({
          className: 'trail-bead-icon',
          html: `<div class="trail-here" title="${escapeHtml(selected?.location || 'Position')}"></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        }),
        interactive: false,
        zIndexOffset: 400
      }).addTo(this.endsLayer);
    }
  }

  updateBeads() {
    this.beadLayer.clearLayers();
    const filteredEntries = store.getFilteredEntries();
    const beads = placeEntriesOnTrail(filteredEntries);
    const latestId = filteredEntries[filteredEntries.length - 1]?.id;

    for (const bead of beads) {
      const entry = filteredEntries.find(e => e.id === bead.id);
      if (!entry) continue;

      const isSelected = entry.id === store.selectedId;
      const marker = L.marker([bead.lat, bead.lon], {
        icon: createBeadIcon(entry, isSelected, entry.id === latestId),
        zIndexOffset: isSelected ? 700 : 200,
        keyboard: true
      });

      marker.on('click', () => {
        store.select(entry.id, 'entry');
      });

      marker.addTo(this.beadLayer);
    }
  }

  updateScrub() {
    this.scrubLayer.clearLayers();
    if (store.scrubMile === null) return;

    const pos = positionAtMile(store.scrubMile);
    L.marker([pos.lat, pos.lon], {
      icon: L.divIcon({
        className: 'trail-bead-icon',
        html: `<div class="trail-scrub"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      }),
      interactive: false,
      zIndexOffset: 800
    }).addTo(this.scrubLayer);
  }

  updateCamera() {
    const selected = store.getSelectedEntry();
    const mile = selected ? selected.mile : 2150.0;
    const key = `${store.frame}:${store.selectedId}:${mile}`;
    if (this.lastFocus === key) return;
    this.lastFocus = key;

    const bottomDock = document.getElementById('bottom-dock-container');
    const bottomH = bottomDock ? bottomDock.getBoundingClientRect().height : 360;

    const pad = {
      paddingTopLeft: [20, 108],
      paddingBottomRight: [20, Math.max(160, bottomH + 16)],
      animate: true
    };

    if (store.frame === 'trail') {
      const bounds = L.latLngBounds(PCT_WAYPOINTS.map(wp => [wp.lat, wp.lon]));
      if (bounds.isValid()) {
        this.map.fitBounds(bounds, { ...pad, maxZoom: 7 });
      }
    } else {
      const filteredEntries = store.getFilteredEntries();
      const beads = placeEntriesOnTrail(filteredEntries);
      const bead = store.frame === 'entry' && store.selectedId
        ? beads.find(item => item.id === store.selectedId)
        : null;
      const target = bead ? { lat: bead.lat, lon: bead.lon } : positionAtMile(mile);
      const zoom = store.frame === 'entry' ? 12 : 11;
      const point = L.latLng(target.lat, target.lon);

      this.map.fitBounds(point.toBounds(store.frame === 'entry' ? 2200 : 6000), {
        ...pad,
        maxZoom: zoom
      });
    }

    this.map.invalidateSize();
  }
}
