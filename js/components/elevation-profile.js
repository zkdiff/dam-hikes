/**
 * DAM HIKES - Interactive 2D Canvas Elevation Profile & Trail Scrubber
 */

import { PCT_ROUTE_POINTS, PCT_SECTIONS, MAJOR_LANDMARKS } from '../data/pct-route.js';
import { store } from '../state.js';

export class ElevationProfile {
  constructor(canvasContainerId) {
    this.containerId = canvasContainerId;
    this.canvas = null;
    this.ctx = null;
    this.hoverMile = null;
    this.isHovering = false;
  }

  init() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="elevation-profile-card">
        <div class="elevation-header">
          <div class="elevation-title-group">
            <span class="elevation-badge">⛰️ Trail Elevation Profile</span>
            <span class="elevation-range">Cascade Locks (180 ft) → Forester Pass (13,200 ft) → Campo (2,915 ft)</span>
          </div>
          <div class="elevation-stats-bar" id="elevation-stats-bar">
            <!-- Dynamically updated -->
          </div>
        </div>
        <div class="canvas-wrapper" style="position: relative; width: 100%; height: 95px;">
          <canvas id="elevation-canvas"></canvas>
          <div id="elevation-tooltip" class="elevation-tooltip" style="display: none;"></div>
        </div>
      </div>
    `;

    this.canvas = document.getElementById('elevation-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.tooltip = document.getElementById('elevation-tooltip');

    this.setupResizeListener();
    this.setupMouseEvents();

    store.subscribe((s, eventType) => {
      if (['moment_selected', 'moment_added', 'moment_updated', 'moment_deleted', 'theme_change', 'data_imported', 'reset_defaults', 'filters_changed'].includes(eventType)) {
        this.render();
      }
    });

    setTimeout(() => this.render(), 50);
  }

  setupResizeListener() {
    window.addEventListener('resize', () => {
      this.render();
    });
  }

  setupMouseEvents() {
    if (!this.canvas) return;

    const handleMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const mile = (x / rect.width) * 2150.0;
      this.hoverMile = mile;
      this.isHovering = true;
      this.updateTooltip(clientX, rect, mile);
      this.drawCanvas();
    };

    const handleLeave = () => {
      this.isHovering = false;
      this.hoverMile = null;
      if (this.tooltip) this.tooltip.style.display = 'none';
      this.drawCanvas();
    };

    const handleClick = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const clickMile = (x / rect.width) * 2150.0;

      // Find nearest moment
      const moments = store.getFilteredMoments();
      if (moments.length === 0) return;

      let closest = moments[0];
      let minDiff = Math.abs(moments[0].mileMarker - clickMile);

      for (const m of moments) {
        const diff = Math.abs(m.mileMarker - clickMile);
        if (diff < minDiff) {
          minDiff = diff;
          closest = m;
        }
      }

      if (closest) {
        store.selectMoment(closest.id);
      }
    };

    this.canvas.addEventListener('mousemove', handleMove);
    this.canvas.addEventListener('mouseleave', handleLeave);
    this.canvas.addEventListener('click', handleClick);

    this.canvas.addEventListener('touchmove', handleMove, { passive: true });
    this.canvas.addEventListener('touchend', handleLeave);
  }

  updateTooltip(clientX, rect, mile) {
    if (!this.tooltip) return;

    const routePoint = this.getPointAtMile(mile);
    const elev = routePoint ? routePoint[2] : 4000;
    const section = this.getSectionForMile(mile);

    // Find nearest moment
    const moments = store.getFilteredMoments();
    let nearestMoment = null;
    let minDiff = 30; // Within 30 miles
    for (const m of moments) {
      const diff = Math.abs(m.mileMarker - mile);
      if (diff < minDiff) {
        minDiff = diff;
        nearestMoment = m;
      }
    }

    let tooltipContent = `
      <div class="elev-tip-title">SOBO Mile ${mile.toFixed(1)}</div>
      <div class="elev-tip-row">⛰️ ${elev.toLocaleString()} ft · ${section.name}</div>
      ${nearestMoment ? `<div class="elev-tip-moment">📍 ${nearestMoment.title}</div>` : ''}
    `;

    this.tooltip.innerHTML = tooltipContent;
    this.tooltip.style.display = 'block';

    const tipWidth = 140;
    let leftPos = clientX - rect.left - tipWidth / 2;
    leftPos = Math.max(10, Math.min(leftPos, rect.width - tipWidth - 10));

    this.tooltip.style.left = `${leftPos}px`;
    this.tooltip.style.top = `-55px`;
  }

  getPointAtMile(mile) {
    for (let i = 0; i < PCT_ROUTE_POINTS.length - 1; i++) {
      const p1 = PCT_ROUTE_POINTS[i];
      const p2 = PCT_ROUTE_POINTS[i + 1];
      if (mile >= p1[3] && mile <= p2[3]) {
        const r = (mile - p1[3]) / (p2[3] - p1[3]);
        return [
          p1[0] + (p2[0] - p1[0]) * r,
          p1[1] + (p2[1] - p1[1]) * r,
          Math.round(p1[2] + (p2[2] - p1[2]) * r),
          mile
        ];
      }
    }
    return PCT_ROUTE_POINTS[PCT_ROUTE_POINTS.length - 1];
  }

  getSectionForMile(mile) {
    for (const sec of PCT_SECTIONS) {
      if (mile >= sec.startMile && mile <= sec.endMile) return sec;
    }
    return PCT_SECTIONS[0];
  }

  render() {
    this.resizeCanvas();
    this.drawCanvas();
    this.updateStatsBar();
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    const width = parent.clientWidth;
    const height = parent.clientHeight || 95;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.ctx.scale(dpr, dpr);
  }

  drawCanvas() {
    if (!this.ctx || !this.canvas) return;

    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    if (width === 0 || height === 0) return;

    const isDark = store.theme === 'dark';
    const ctx = this.ctx;

    ctx.clearRect(0, 0, width, height);

    const minElev = 0;
    const maxElev = 14500;
    const totalMiles = 2150.0;

    const mileToX = (mile) => (mile / totalMiles) * width;
    const elevToY = (elev) => height - 12 - ((elev - minElev) / (maxElev - minElev)) * (height - 24);

    // 1. Draw Section Background Bands
    for (const sec of PCT_SECTIONS) {
      const x1 = mileToX(sec.startMile);
      const x2 = mileToX(sec.endMile);
      ctx.fillStyle = isDark
        ? (sec.id === 'sierra' ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255, 255, 255, 0.02)')
        : (sec.id === 'sierra' ? 'rgba(59, 130, 246, 0.05)' : 'rgba(0, 0, 0, 0.02)');
      ctx.fillRect(x1, 0, x2 - x1, height);

      // Section divider line
      if (sec.startMile > 0) {
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.moveTo(x1, 0);
        ctx.lineTo(x1, height - 12);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // 2. Draw Elevation Mountain Fill
    const selectedMoment = store.getSelectedMoment();
    const currentMile = selectedMoment ? selectedMoment.mileMarker : 0;
    const currentX = mileToX(currentMile);

    // Completed gradient
    const gradientCompleted = ctx.createLinearGradient(0, 0, 0, height);
    if (isDark) {
      gradientCompleted.addColorStop(0, 'rgba(16, 185, 129, 0.45)');
      gradientCompleted.addColorStop(1, 'rgba(16, 185, 129, 0.02)');
    } else {
      gradientCompleted.addColorStop(0, 'rgba(21, 128, 61, 0.35)');
      gradientCompleted.addColorStop(1, 'rgba(21, 128, 61, 0.02)');
    }

    // Remaining gradient
    const gradientRemaining = ctx.createLinearGradient(0, 0, 0, height);
    if (isDark) {
      gradientRemaining.addColorStop(0, 'rgba(100, 116, 139, 0.25)');
      gradientRemaining.addColorStop(1, 'rgba(100, 116, 139, 0.02)');
    } else {
      gradientRemaining.addColorStop(0, 'rgba(148, 163, 184, 0.25)');
      gradientRemaining.addColorStop(1, 'rgba(148, 163, 184, 0.02)');
    }

    // Draw full silhouette fill
    ctx.beginPath();
    ctx.moveTo(mileToX(0), height - 12);

    for (let i = 0; i < PCT_ROUTE_POINTS.length; i++) {
      const pt = PCT_ROUTE_POINTS[i];
      const px = mileToX(pt[3]);
      const py = elevToY(pt[2]);
      ctx.lineTo(px, py);
    }

    ctx.lineTo(mileToX(totalMiles), height - 12);
    ctx.closePath();
    ctx.fillStyle = gradientRemaining;
    ctx.fill();

    // Clip and draw completed fill
    if (currentMile > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, currentX, height);
      ctx.clip();

      ctx.beginPath();
      ctx.moveTo(mileToX(0), height - 12);
      for (let i = 0; i < PCT_ROUTE_POINTS.length; i++) {
        const pt = PCT_ROUTE_POINTS[i];
        ctx.lineTo(mileToX(pt[3]), elevToY(pt[2]));
      }
      ctx.lineTo(mileToX(totalMiles), height - 12);
      ctx.closePath();
      ctx.fillStyle = gradientCompleted;
      ctx.fill();
      ctx.restore();
    }

    // 3. Draw Elevation Outline Stroke
    // Completed stroke
    ctx.beginPath();
    ctx.strokeStyle = isDark ? '#10B981' : '#15803D';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    let started = false;
    for (let i = 0; i < PCT_ROUTE_POINTS.length; i++) {
      const pt = PCT_ROUTE_POINTS[i];
      if (pt[3] <= currentMile) {
        const px = mileToX(pt[3]);
        const py = elevToY(pt[2]);
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
    }
    ctx.stroke();

    // Remaining stroke
    ctx.beginPath();
    ctx.strokeStyle = isDark ? '#64748B' : '#94A3B8';
    ctx.lineWidth = 2.0;
    ctx.setLineDash([4, 4]);

    let remStarted = false;
    for (let i = 0; i < PCT_ROUTE_POINTS.length; i++) {
      const pt = PCT_ROUTE_POINTS[i];
      if (pt[3] >= currentMile) {
        const px = mileToX(pt[3]);
        const py = elevToY(pt[2]);
        if (!remStarted) {
          ctx.moveTo(px, py);
          remStarted = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Draw Major Mountain Pass Landmarks
    const landmarks = [
      { mile: 49.2, name: 'Mt. Hood' },
      { mile: 360.5, name: 'Crater Lake' },
      { mile: 795.0, name: 'Lassen' },
      { mile: 1240.0, name: 'Donohue' },
      { mile: 1438.0, name: 'Forester (13.2k)' },
      { mile: 1455.0, name: 'Whitney (14.5k)' },
      { mile: 1820.0, name: 'Baden-Powell' },
      { mile: 2025.0, name: 'San Jacinto' }
    ];

    ctx.fillStyle = isDark ? '#94A3B8' : '#64748B';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';

    for (const lm of landmarks) {
      const lx = mileToX(lm.mile);
      const pt = this.getPointAtMile(lm.mile);
      const ly = elevToY(pt[2]);

      ctx.beginPath();
      ctx.arc(lx, ly, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)';
      ctx.fill();
    }

    // 5. Draw Moment Pins onto Elevation Profile
    const moments = store.getFilteredMoments();
    const catColors = {
      campsite: '#10B981',
      milestone: '#3B82F6',
      resupply: '#F59E0B',
      wildlife: '#8B5CF6',
      hardship: '#EF4444',
      reflection: '#EC4899'
    };

    moments.forEach(m => {
      const mx = mileToX(m.mileMarker);
      const my = elevToY(m.elevationFt);
      const isSelected = selectedMoment && selectedMoment.id === m.id;
      const color = catColors[m.category] || '#10B981';

      if (isSelected) {
        // Selected halo
        ctx.beginPath();
        ctx.arc(mx, my, 8, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.15)';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(mx, my, isSelected ? 4.5 : 3, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = isDark ? '#0F172A' : '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // 6. Draw Active Scrubber Needle
    if (selectedMoment) {
      ctx.strokeStyle = isDark ? '#F8FAFC' : '#1C1917';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(currentX, 0);
      ctx.lineTo(currentX, height - 12);
      ctx.stroke();

      // Needle head
      ctx.fillStyle = isDark ? '#F8FAFC' : '#1C1917';
      ctx.beginPath();
      ctx.arc(currentX, 4, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // 7. Hover cursor
    if (this.isHovering && this.hoverMile !== null) {
      const hoverX = mileToX(this.hoverMile);
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(hoverX, 0);
      ctx.lineTo(hoverX, height - 12);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Bottom Mile Axis Labels
    ctx.fillStyle = isDark ? '#64748B' : '#94A3B8';
    ctx.font = '8.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('0 mi (Cascade Locks)', 4, height - 2);
    ctx.textAlign = 'center';
    ctx.fillText('Mile 1,000', mileToX(1000), height - 2);
    ctx.textAlign = 'right';
    ctx.fillText('2,150 mi (Campo)', width - 4, height - 2);
  }

  updateStatsBar() {
    const statsBar = document.getElementById('elevation-stats-bar');
    if (!statsBar) return;

    const moment = store.getSelectedMoment();
    if (!moment) return;

    const pctDone = ((moment.mileMarker / 2150.0) * 100).toFixed(1);

    statsBar.innerHTML = `
      <span class="elev-stat-pill">📍 Mile ${moment.mileMarker.toFixed(1)}</span>
      <span class="elev-stat-pill">⛰️ ${moment.elevationFt.toLocaleString()} ft</span>
      <span class="elev-stat-pill">📈 ${pctDone}% Complete</span>
    `;
  }
}
