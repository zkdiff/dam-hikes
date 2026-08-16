/**
 * DAM HIKES - SVG Elevation Profile & Integrated Step Navigation Component
 * With responsive mobile sheet minimize/expand support.
 */

import { START_MILE, ELEVATION_PROFILE, elevationAtMile, formatElevation, formatMiles } from '../data/pct-route.js';
import { store } from '../state.js';

const VW = 1000;
const VH = 88;
const MIN_ELEV = 0;
const MAX_ELEV = 13600;

function mileToX(mile, width = VW) {
  return ((START_MILE - mile) / START_MILE) * width;
}

function elevToY(elevFt, height = VH, pad = 10) {
  const t = (elevFt - MIN_ELEV) / (MAX_ELEV - MIN_ELEV);
  return height - pad - t * (height - pad * 2);
}

function profilePoint(mile, width = VW, height = VH) {
  const sample = elevationAtMile(mile);
  return {
    ...sample,
    x: mileToX(mile, width),
    y: elevToY(sample.elevFt, height)
  };
}

function buildProfilePath(width = VW, height = VH) {
  const coords = ELEVATION_PROFILE.map(p => ({
    x: mileToX(p.mile, width),
    y: elevToY(p.elevFt, height)
  }));
  const line = coords
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');
  const fill = `${line} L${width} ${height} L0 ${height} Z`;
  return { line, fill, coords };
}

export class ElevationProfile {
  constructor(containerId) {
    this.containerId = containerId;
    this.hoverMile = null;
    this.isMinimized = false;
    this.pathData = buildProfilePath(VW, VH);
  }

  init() {
    this.render();
    store.subscribe((s, eventType) => {
      if (['select_change', 'entry_added', 'entry_updated', 'entry_deleted', 'filter_change', 'scrub_change'].includes(eventType)) {
        this.render();
      }
    });
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const selected = store.getSelectedEntry();
    const currentMile = selected ? selected.mile : START_MILE;
    const focusMile = this.hoverMile ?? (selected ? selected.mile : START_MILE);
    const sample = elevationAtMile(focusMile);

    const here = profilePoint(currentMile, VW, VH);
    const focus = profilePoint(focusMile, VW, VH);
    const walkedWidth = mileToX(currentMile, VW);

    const filtered = store.getFilteredEntries();
    const index = filtered.findIndex(e => e.id === selected?.id);
    const total = filtered.length;

    const marksHtml = filtered.map(entry => {
      const pt = profilePoint(entry.mile, VW, VH);
      const isCur = selected && entry.id === selected.id;
      return `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="${isCur ? '4.5' : '3.2'}" fill="${isCur ? '#c5d4a8' : '#ece7dc'}" stroke="#121410" stroke-width="1"></circle>`;
    }).join('');

    container.innerHTML = `
      <!-- Step Navigation (Positioned Above Elevation Profile) -->
      <div class="trail-elevation-nav">
        <button type="button" class="btn-step-arrow" id="btn-elev-prev" ${index <= 0 ? 'disabled' : ''} aria-label="Previous update, north on the trail">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>

        <div class="trail-step-center-wrap" id="btn-elev-toggle-dock" title="Tap to expand / collapse story card">
          <p class="trail-step-count">
            ${total > 0 ? `${index + 1} / ${total} on trail` : '0 on trail'}
          </p>
          <span class="mobile-dock-hint">${this.isMinimized ? '▴ Show Card' : '▾ Map Focus'}</span>
        </div>

        <button type="button" class="btn-step-arrow" id="btn-elev-next" ${index >= total - 1 ? 'disabled' : ''} aria-label="Next update, south on the trail">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      <!-- Elevation Profile Header -->
      <div class="elevation-profile-header">
        <span class="elevation-title-label">Elevation</span>
        <span class="elevation-readout">
          ${formatElevation(sample.elevFt)}
          <span class="elevation-readout-sub"> · mi ${formatMiles(sample.mile)}${sample.label ? ' · ' + sample.label : ''}</span>
        </span>
      </div>

      <!-- SVG Elevation Chart -->
      <svg viewBox="0 0 ${VW} ${VH}" class="elevation-svg-chart" id="elevation-svg" role="img" aria-label="Elevation profile from Cascade Locks to Campo">
        <defs>
          <linearGradient id="elevation-gradient-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#c5d4a8" stop-opacity="0.42"></stop>
            <stop offset="100%" stop-color="#c5d4a8" stop-opacity="0.04"></stop>
          </linearGradient>
          <clipPath id="elevation-walked-clip">
            <rect x="0" y="0" width="${walkedWidth.toFixed(1)}" height="${VH}"></rect>
          </clipPath>
        </defs>

        <!-- Background Fill -->
        <path d="${this.pathData.fill}" fill="url(#elevation-gradient-fill)"></path>

        <!-- Walked Trail Tint -->
        <path d="${this.pathData.fill}" fill="rgba(228, 220, 203, 0.16)" clip-path="url(#elevation-walked-clip)"></path>

        <!-- Top Profile Outline -->
        <path d="${this.pathData.line}" fill="none" stroke="#c5d4a8" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"></path>

        <!-- Moment Marks -->
        ${marksHtml}

        <!-- Focus Line -->
        <line x1="${focus.x.toFixed(1)}" y1="6" x2="${focus.x.toFixed(1)}" y2="${VH - 4}" stroke="rgba(236, 231, 220, 0.35)" stroke-width="1"></line>

        <!-- Current Location Dot -->
        <circle cx="${here.x.toFixed(1)}" cy="${here.y.toFixed(1)}" r="5" fill="#c5d4a8" stroke="#121410" stroke-width="1.5"></circle>

        <!-- Hover Dot -->
        ${this.hoverMile !== null ? `
          <circle cx="${focus.x.toFixed(1)}" cy="${focus.y.toFixed(1)}" r="4" fill="#ece7dc" stroke="#121410" stroke-width="1.2"></circle>
        ` : ''}
      </svg>

      <!-- Axis Labels -->
      <div class="elevation-axis-labels">
        <span>Cascade Locks</span>
        <span>Campo</span>
      </div>
    `;

    this.attachEvents(container);
  }

  attachEvents(container) {
    // Step Prev / Next Buttons
    container.querySelector('#btn-elev-prev')?.addEventListener('click', (e) => {
      e.stopPropagation();
      store.step(-1);
    });

    container.querySelector('#btn-elev-next')?.addEventListener('click', (e) => {
      e.stopPropagation();
      store.step(1);
    });

    // Toggle Dock Minimize / Expand
    container.querySelector('#btn-elev-toggle-dock')?.addEventListener('click', () => {
      this.isMinimized = !this.isMinimized;
      const dock = document.getElementById('bottom-dock-container');
      if (dock) {
        dock.classList.toggle('is-minimized', this.isMinimized);
      }
      this.render();
      window.dispatchEvent(new Event('resize'));
    });

    const svg = container.querySelector('#elevation-svg');
    if (!svg) return;

    const getMileFromEvent = (evt) => {
      const rect = svg.getBoundingClientRect();
      const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const ratio = x / rect.width;
      return Math.round(START_MILE - ratio * START_MILE);
    };

    svg.addEventListener('mousemove', (e) => {
      this.hoverMile = getMileFromEvent(e);
      this.render();
      store.setScrubMile(this.hoverMile);
    });

    svg.addEventListener('mouseleave', () => {
      this.hoverMile = null;
      this.render();
      store.setScrubMile(null);
    });

    svg.addEventListener('touchstart', (e) => {
      this.hoverMile = getMileFromEvent(e);
      this.render();
      store.setScrubMile(this.hoverMile);
    }, { passive: true });

    svg.addEventListener('touchmove', (e) => {
      this.hoverMile = getMileFromEvent(e);
      this.render();
      store.setScrubMile(this.hoverMile);
    }, { passive: true });

    svg.addEventListener('touchend', () => {
      this.hoverMile = null;
      this.render();
      store.setScrubMile(null);
    });

    svg.addEventListener('click', (e) => {
      const mile = getMileFromEvent(e);
      const filtered = store.getFilteredEntries();
      if (filtered.length === 0) return;

      // Find closest entry
      let closest = filtered[0];
      let minDist = Math.abs(closest.mile - mile);
      for (const entry of filtered) {
        const dist = Math.abs(entry.mile - mile);
        if (dist < minDist) {
          minDist = dist;
          closest = entry;
        }
      }
      if (closest) {
        store.select(closest.id, 'entry');
      }
    });
  }
}
