/**
 * DAM HIKES - SVG Elevation Profile & Interactive Scrubber Component
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
    this.pathData = buildProfilePath(VW, VH);
  }

  init() {
    this.render();
    store.subscribe((s, eventType) => {
      if (['select_change', 'entry_added', 'scrub_change'].includes(eventType)) {
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
    const ordered = store.getOrderedEntries();

    const marksHtml = ordered.map(entry => {
      const pt = profilePoint(entry.mile, VW, VH);
      return `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="3.2" fill="#ece7dc" stroke="#121410" stroke-width="1"></circle>`;
    }).join('');

    container.innerHTML = `
      <div class="elevation-profile-header">
        <span class="elevation-title-label">Elevation</span>
        <span class="elevation-readout">
          ${formatElevation(sample.elevFt)}
          <span class="elevation-readout-sub"> · mi ${formatMiles(sample.mile)}${sample.label ? ' · ' + sample.label : ''}</span>
        </span>
      </div>

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

      <div class="elevation-axis-labels">
        <span>Cascade Locks</span>
        <span>Campo</span>
      </div>
    `;

    this.attachEvents(container);
  }

  attachEvents(container) {
    const svg = container.querySelector('#elevation-svg');
    if (!svg) return;

    const getMileFromClientX = (clientX) => {
      const box = svg.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, (clientX - box.left) / box.width));
      return START_MILE * (1 - t);
    };

    svg.addEventListener('pointerdown', (e) => {
      svg.setPointerCapture(e.pointerId);
      const next = getMileFromClientX(e.clientX);
      this.hoverMile = next;
      store.setScrubMile(next);
      this.render();
    });

    svg.addEventListener('pointermove', (e) => {
      if (e.buttons === 0 && e.pointerType === 'mouse') {
        const next = getMileFromClientX(e.clientX);
        this.hoverMile = next;
        store.setScrubMile(next);
        this.render();
        return;
      }
      if (e.buttons === 0) return;
      const next = getMileFromClientX(e.clientX);
      this.hoverMile = next;
      store.setScrubMile(next);
      this.render();
    });

    svg.addEventListener('pointerup', () => {
      this.hoverMile = null;
      store.setScrubMile(null);
      this.render();
    });

    svg.addEventListener('pointerleave', () => {
      this.hoverMile = null;
      store.setScrubMile(null);
      this.render();
    });
  }
}
