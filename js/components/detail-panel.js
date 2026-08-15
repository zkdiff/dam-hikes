/**
 * DAM HIKES - Adaptive Moment Detail Panel
 * Supports 3 layout styles: 'story', 'minimal', and 'fieldlog'
 */

import { store } from '../state.js';

export class DetailPanel {
  constructor(containerId) {
    this.containerId = containerId;
    this.currentPhotoIndex = 0;
  }

  init() {
    this.render();
    store.subscribe((s, eventType) => {
      if (['moment_selected', 'moment_updated', 'moment_deleted', 'theme_change', 'data_imported', 'reset_defaults'].includes(eventType)) {
        this.currentPhotoIndex = 0;
        this.render();
      }
    });
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const moment = store.getSelectedMoment();
    if (!moment) {
      container.innerHTML = `
        <div class="empty-detail-state">
          <div class="empty-icon">📍</div>
          <h3>No Trail Moment Selected</h3>
          <p>Select a waypoint along the trail or from the timeline to view Daniel's journal entries.</p>
        </div>
      `;
      return;
    }

    const filtered = store.getFilteredMoments();
    const currentIndex = filtered.findIndex(m => m.id === moment.id);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex >= 0 && currentIndex < filtered.length - 1;

    let contentHtml = '';
    if (moment.layoutStyle === 'minimal') {
      contentHtml = this.renderMinimalTemplate(moment);
    } else if (moment.layoutStyle === 'fieldlog') {
      contentHtml = this.renderFieldLogTemplate(moment);
    } else {
      contentHtml = this.renderStoryTemplate(moment);
    }

    container.innerHTML = `
      <article class="detail-card layout-${moment.layoutStyle} category-${moment.category}">
        <!-- Top Navigation Bar for Moment -->
        <header class="detail-card-header">
          <div class="header-badges">
            <span class="badge badge-category badge-cat-${moment.category}">
              ${this.getCategoryIcon(moment.category)} ${this.formatCategoryName(moment.category)}
            </span>
            <span class="badge badge-section section-${moment.section}">
              ${this.formatSectionName(moment.section)}
            </span>
          </div>

          <div class="header-actions">
            <button class="btn-icon" id="btn-edit-moment" title="Edit this entry in author mode">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <span>Edit</span>
            </button>
            <div class="step-nav-group">
              <button class="btn-icon" id="btn-prev-moment" ${!hasPrev ? 'disabled' : ''} title="Previous moment (Left arrow)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <span class="step-nav-count">${currentIndex + 1} / ${filtered.length}</span>
              <button class="btn-icon" id="btn-next-moment" ${!hasNext ? 'disabled' : ''} title="Next moment (Right arrow)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        </header>

        <!-- Dynamic Layout Body -->
        <div class="detail-card-body">
          ${contentHtml}
        </div>

        <!-- Footer / Navigation Summary -->
        <footer class="detail-card-footer">
          <div class="footer-trail-stats">
            <span class="stat-item"><strong>SOBO Mile:</strong> ${moment.mileMarker.toFixed(1)} mi</span>
            <span class="stat-separator">·</span>
            <span class="stat-item"><strong>Elevation:</strong> ${moment.elevationFt.toLocaleString()} ft</span>
            <span class="stat-separator">·</span>
            <span class="stat-item"><strong>Remaining:</strong> ${(2150.0 - moment.mileMarker).toFixed(1)} mi</span>
          </div>
        </footer>
      </article>
    `;

    this.attachEventListeners(container, moment);
  }

  renderStoryTemplate(moment) {
    const photos = moment.photos || [];
    const metrics = moment.metrics || {};

    let galleryHtml = '';
    if (photos.length > 0) {
      const activePhoto = photos[this.currentPhotoIndex] || photos[0];
      const thumbsHtml = photos.length > 1 ? `
        <div class="gallery-thumbs">
          ${photos.map((p, idx) => `
            <button class="thumb-btn ${idx === this.currentPhotoIndex ? 'active' : ''}" data-index="${idx}">
              <img src="${p.url}" alt="${p.caption || 'Thumbnail'}" loading="lazy" />
            </button>
          `).join('')}
        </div>
      ` : '';

      galleryHtml = `
        <div class="detail-gallery">
          <div class="gallery-main-view" id="gallery-main-view" title="Click to view fullscreen">
            <img src="${activePhoto.url}" alt="${activePhoto.caption || moment.title}" class="hero-photo" />
            <div class="gallery-expand-hint">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
              <span>Expand Photo</span>
            </div>
            ${activePhoto.caption ? `<div class="photo-caption">${activePhoto.caption}</div>` : ''}
          </div>
          ${thumbsHtml}
        </div>
      `;
    }

    let quoteHtml = moment.quote ? `
      <blockquote class="detail-pull-quote">
        "${moment.quote}"
      </blockquote>
    ` : '';

    let metricsHtml = '';
    if (metrics.tempF || metrics.condition || metrics.waterSource || metrics.packWeightLbs) {
      metricsHtml = `
        <div class="metric-ribbon">
          ${metrics.tempF ? `<div class="metric-pill">🌡️ <span>${metrics.tempF}°F</span></div>` : ''}
          ${metrics.condition ? `<div class="metric-pill">🌤️ <span>${metrics.condition}</span></div>` : ''}
          ${metrics.waterSource ? `<div class="metric-pill">💧 <span>${metrics.waterSource}</span></div>` : ''}
          ${metrics.packWeightLbs ? `<div class="metric-pill">🎒 <span>${metrics.packWeightLbs} lbs pack</span></div>` : ''}
          ${metrics.dayMileage ? `<div class="metric-pill">🥾 <span>${metrics.dayMileage} mi day</span></div>` : ''}
        </div>
      `;
    }

    return `
      <div class="story-layout-content">
        <div class="moment-headline-group">
          <div class="moment-meta-row">
            <span class="meta-date">📅 ${this.formatDate(moment.date)}</span>
            <span class="meta-day">Day ${moment.dayNumber} on Trail</span>
            <span class="meta-location">📍 ${moment.locationName}</span>
          </div>
          <h1 class="moment-title">${moment.title}</h1>
        </div>

        ${galleryHtml}
        ${quoteHtml}
        ${metricsHtml}

        <div class="moment-story-text">
          ${this.formatStoryParagraphs(moment.story)}
        </div>

        ${metrics.gearNotes ? `
          <div class="detail-gear-box">
            <strong>⚙️ Field & Gear Log:</strong> ${metrics.gearNotes}
          </div>
        ` : ''}
      </div>
    `;
  }

  renderMinimalTemplate(moment) {
    const heroPhoto = moment.photos && moment.photos.length > 0 ? moment.photos[0] : null;

    return `
      <div class="minimal-layout-content">
        <div class="moment-headline-group">
          <div class="moment-meta-row">
            <span class="meta-date">📅 ${this.formatDate(moment.date)}</span>
            <span class="meta-day">Day ${moment.dayNumber}</span>
            <span class="meta-location">📍 ${moment.locationName}</span>
          </div>
          <h1 class="moment-title">${moment.title}</h1>
        </div>

        ${moment.quote ? `
          <blockquote class="minimal-lead-quote">
            “${moment.quote}”
          </blockquote>
        ` : ''}

        ${heroPhoto ? `
          <div class="minimal-hero-container" id="gallery-main-view">
            <img src="${heroPhoto.url}" alt="${heroPhoto.caption || moment.title}" class="hero-photo" />
            ${heroPhoto.caption ? `<div class="photo-caption">${heroPhoto.caption}</div>` : ''}
          </div>
        ` : ''}

        <div class="moment-story-text minimal-body">
          ${this.formatStoryParagraphs(moment.story)}
        </div>
      </div>
    `;
  }

  renderFieldLogTemplate(moment) {
    const metrics = moment.metrics || {};
    const photos = moment.photos || [];

    return `
      <div class="fieldlog-layout-content">
        <div class="moment-headline-group">
          <div class="moment-meta-row">
            <span class="meta-date">📅 ${this.formatDate(moment.date)}</span>
            <span class="meta-day">Day ${moment.dayNumber} · SOBO Mile ${moment.mileMarker.toFixed(1)}</span>
          </div>
          <h1 class="moment-title">${moment.title}</h1>
          <div class="fieldlog-location">📍 ${moment.locationName} (Elevation: ${moment.elevationFt.toLocaleString()} ft)</div>
        </div>

        <!-- Structured Field Metrics Grid -->
        <div class="fieldlog-grid">
          <div class="field-cell">
            <div class="field-label">Weather / Temp</div>
            <div class="field-value">${metrics.tempF ? metrics.tempF + '°F' : '—'} · ${metrics.condition || 'Clear'}</div>
          </div>
          <div class="field-cell">
            <div class="field-label">Water Status</div>
            <div class="field-value">${metrics.waterSource || 'Stream on trail'}</div>
          </div>
          <div class="field-cell">
            <div class="field-label">Pack Weight</div>
            <div class="field-value">${metrics.packWeightLbs ? metrics.packWeightLbs + ' lbs' : 'Base'}</div>
          </div>
          <div class="field-cell">
            <div class="field-label">Daily Mileage</div>
            <div class="field-value">${metrics.dayMileage ? metrics.dayMileage + ' mi' : '—'}</div>
          </div>
        </div>

        <div class="moment-story-text fieldlog-text">
          ${this.formatStoryParagraphs(moment.story)}
        </div>

        ${photos.length > 0 ? `
          <div class="fieldlog-photo-strip">
            ${photos.map((p, idx) => `
              <div class="fieldlog-photo-item" id="fieldlog-photo-${idx}">
                <img src="${p.url}" alt="${p.caption || 'Field photo'}" loading="lazy" />
                ${p.caption ? `<span class="photo-strip-caption">${p.caption}</span>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${metrics.gearNotes ? `
          <div class="fieldlog-gear-notes">
            <strong>Notes & Resupply:</strong> ${metrics.gearNotes}
          </div>
        ` : ''}
      </div>
    `;
  }

  attachEventListeners(container, moment) {
    // Next/Prev Buttons
    const prevBtn = container.querySelector('#btn-prev-moment');
    const nextBtn = container.querySelector('#btn-next-moment');
    if (prevBtn) prevBtn.addEventListener('click', () => store.prevMoment());
    if (nextBtn) nextBtn.addEventListener('click', () => store.nextMoment());

    // Edit Button
    const editBtn = container.querySelector('#btn-edit-moment');
    if (editBtn) editBtn.addEventListener('click', () => store.setScreen('author', moment.id));

    // Gallery Thumbs
    const thumbBtns = container.querySelectorAll('.thumb-btn');
    thumbBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.dataset.index, 10);
        this.currentPhotoIndex = idx;
        this.render();
      });
    });

    // Expand to Lightbox
    const mainView = container.querySelector('#gallery-main-view');
    if (mainView && moment.photos && moment.photos.length > 0) {
      mainView.addEventListener('click', () => {
        const photo = moment.photos[this.currentPhotoIndex] || moment.photos[0];
        store.openLightbox(photo);
      });
    }

    // Fieldlog photos expand
    const fieldlogPhotos = container.querySelectorAll('.fieldlog-photo-item');
    fieldlogPhotos.forEach((item, idx) => {
      item.addEventListener('click', () => {
        if (moment.photos && moment.photos[idx]) {
          store.openLightbox(moment.photos[idx]);
        }
      });
    });
  }

  formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  }

  formatStoryParagraphs(text) {
    if (!text) return '';
    return text.split('\n\n').map(p => `<p>${p.trim().replace(/\n/g, '<br/>')}</p>`).join('');
  }

  getCategoryIcon(cat) {
    const icons = {
      campsite: '⛺',
      milestone: '🏔️',
      resupply: '🍕',
      wildlife: '🐻',
      hardship: '⚡',
      reflection: '📖'
    };
    return icons[cat] || '📍';
  }

  formatCategoryName(cat) {
    const names = {
      campsite: 'Campsite',
      milestone: 'Milestone / Pass',
      resupply: 'Resupply / Town',
      wildlife: 'Wildlife & Flora',
      hardship: 'Trail Condition',
      reflection: 'Journal Reflection'
    };
    return names[cat] || cat;
  }

  formatSectionName(sec) {
    const names = {
      oregon: 'Oregon Cascades',
      norcal: 'Northern California',
      sierra: 'High Sierra Nevada',
      socal: 'Southern California'
    };
    return names[sec] || sec;
  }
}
