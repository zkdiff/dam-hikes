/**
 * DAM HIKES - Leaflet Map Engine & Interactive Route Renderer
 */

import { PCT_ROUTE_POINTS, PCT_SECTIONS } from './data/pct-route.js';
import { store } from './state.js';

export class TrailMap {
  constructor(containerId) {
    this.containerId = containerId;
    this.map = null;
    this.completedPolyline = null;
    this.remainingPolyline = null;
    this.markerLayer = null;
    this.landmarkLayer = null;
    this.tileLayer = null;
    this.currentTileTheme = null;
  }

  init() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    // Initialize Leaflet Map centered on High Sierra / Central PCT
    this.map = L.map(this.containerId, {
      center: [38.5, -120.0],
      zoom: 6,
      minZoom: 5,
      maxZoom: 16,
      zoomControl: false,
      attributionControl: false
    });

    // Add custom zoom control at top right
    L.control.zoom({ position: 'topright' }).addTo(this.map);

    // Layer groups for markers
    this.markerLayer = L.layerGroup().addTo(this.map);
    this.landmarkLayer = L.layerGroup().addTo(this.map);

    this.updateTileLayer();
    this.renderRoute();
    this.renderMarkers();

    // Subscribe to store updates
    store.subscribe((s, eventType) => {
      if (eventType === 'theme_change') {
        this.updateTileLayer();
      } else if (eventType === 'moment_selected') {
        this.updateRouteProgress();
        this.highlightSelectedMarker();
        this.panToSelectedMoment();
      } else if (['moment_added', 'moment_updated', 'moment_deleted', 'data_imported', 'reset_defaults', 'filters_changed'].includes(eventType)) {
        this.renderRoute();
        this.renderMarkers();
      }
    });

    // Initial zoom fit to full trail bounds
    setTimeout(() => {
      this.invalidateSize();
      this.zoomToSelectedMoment(true);
    }, 100);
  }

  invalidateSize() {
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  updateTileLayer() {
    const isDark = store.theme === 'dark';
    const newTheme = isDark ? 'dark' : 'light';

    if (this.tileLayer && this.currentTileTheme === newTheme) return;

    if (this.tileLayer) {
      this.map.removeLayer(this.tileLayer);
    }

    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    this.tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 18,
      subdomains: 'abcd'
    }).addTo(this.map);

    this.currentTileTheme = newTheme;
  }

  renderRoute() {
    if (this.completedPolyline) this.map.removeLayer(this.completedPolyline);
    if (this.remainingPolyline) this.map.removeLayer(this.remainingPolyline);

    const selectedMoment = store.getSelectedMoment();
    const currentMile = selectedMoment ? selectedMoment.mileMarker : 0;

    const completedCoords = [];
    const remainingCoords = [];

    for (const pt of PCT_ROUTE_POINTS) {
      const latLng = [pt[0], pt[1]];
      if (pt[3] <= currentMile) {
        completedCoords.push(latLng);
      } else {
        remainingCoords.push(latLng);
      }
    }

    // Connect the boundary between completed and remaining
    if (completedCoords.length > 0 && remainingCoords.length > 0) {
      remainingCoords.unshift(completedCoords[completedCoords.length - 1]);
    }

    const isDark = store.theme === 'dark';
    const completedColor = isDark ? '#10B981' : '#15803D';
    const remainingColor = isDark ? '#64748B' : '#94A3B8';

    // Completed polyline (solid, glowing)
    this.completedPolyline = L.polyline(completedCoords, {
      color: completedColor,
      weight: 5,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(this.map);

    // Remaining polyline (dashed, subtle)
    this.remainingPolyline = L.polyline(remainingCoords, {
      color: remainingColor,
      weight: 3.5,
      opacity: 0.7,
      dashArray: '6, 8',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(this.map);
  }

  updateRouteProgress() {
    this.renderRoute();
  }

  renderMarkers() {
    this.markerLayer.clearLayers();
    const moments = store.getFilteredMoments();
    const selectedId = store.selectedMomentId;

    moments.forEach(m => {
      const isSelected = m.id === selectedId;
      const icon = this.createMarkerIcon(m, isSelected);

      const marker = L.marker([m.lat, m.lng], {
        icon,
        title: m.title,
        riseOnHover: true,
        zIndexOffset: isSelected ? 1000 : 100
      });

      marker.on('click', () => {
        store.selectMoment(m.id);
      });

      // Tooltip preview
      marker.bindTooltip(`
        <div class="map-tooltip">
          <div class="tooltip-badge tooltip-cat-${m.category}">
            ${this.getCategoryIcon(m.category)} Mile ${m.mileMarker.toFixed(1)}
          </div>
          <div class="tooltip-title">${m.title}</div>
          <div class="tooltip-meta">Day ${m.dayNumber} · ${m.locationName}</div>
        </div>
      `, {
        direction: 'top',
        offset: [0, -12],
        className: 'custom-leaflet-tooltip'
      });

      this.markerLayer.addLayer(marker);
    });
  }

  createMarkerIcon(moment, isSelected) {
    const catColors = {
      campsite: '#10B981',
      milestone: '#3B82F6',
      resupply: '#F59E0B',
      wildlife: '#8B5CF6',
      hardship: '#EF4444',
      reflection: '#EC4899'
    };

    const color = catColors[moment.category] || '#10B981';
    const iconSymbol = this.getCategorySymbol(moment.category);
    const pulseHtml = isSelected ? `<div class="marker-pulse-ring" style="border-color: ${color};"></div>` : '';

    const html = `
      <div class="custom-trail-marker ${isSelected ? 'marker-selected' : ''}" style="--marker-color: ${color};">
        ${pulseHtml}
        <div class="marker-pin" style="background-color: ${color};">
          <span class="marker-icon">${iconSymbol}</span>
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'custom-div-icon',
      html,
      iconSize: isSelected ? [36, 36] : [26, 26],
      iconAnchor: isSelected ? [18, 18] : [13, 13]
    });
  }

  getCategorySymbol(cat) {
    const symbols = {
      campsite: '⛺',
      milestone: '🏔️',
      resupply: '🍕',
      wildlife: '🐻',
      hardship: '⚡',
      reflection: '📖'
    };
    return symbols[cat] || '📍';
  }

  getCategoryIcon(cat) {
    return this.getCategorySymbol(cat);
  }

  highlightSelectedMarker() {
    this.renderMarkers();
  }

  panToSelectedMoment() {
    const moment = store.getSelectedMoment();
    if (!moment || !this.map) return;

    const currentZoom = this.map.getZoom();
    const targetZoom = Math.max(currentZoom, 9);

    this.map.flyTo([moment.lat, moment.lng], targetZoom, {
      duration: 1.0,
      easeLinearity: 0.25
    });
  }

  zoomToSelectedMoment(fitAll = false) {
    if (!this.map) return;

    if (fitAll) {
      const bounds = L.latLngBounds(PCT_ROUTE_POINTS.map(p => [p[0], p[1]]));
      this.map.fitBounds(bounds, { padding: [40, 40] });
    } else {
      this.panToSelectedMoment();
    }
  }

  fitFullTrail() {
    if (!this.map) return;
    const bounds = L.latLngBounds(PCT_ROUTE_POINTS.map(p => [p[0], p[1]]));
    this.map.fitBounds(bounds, { padding: [30, 30] });
  }
}
