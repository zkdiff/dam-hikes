/**
 * DAM HIKES - Adaptive TrailCard Component
 * Supports Rich Story, Minimalist Reflection, and Field Log formats
 */

import { elevationAtMile, formatElevation, formatMiles } from '../data/pct-route.js';
import { store } from '../state.js';

function formatFeedDate(isoStr) {
  if (!isoStr) return '';
  try {
    const [y, m, d] = isoStr.split('-');
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return isoStr;
  }
}

const CATEGORY_NAMES = {
  campsite: '⛺ Campsite',
  milestone: '🏔️ Milestone / Pass',
  resupply: '🍕 Resupply / Town',
  wildlife: '🐻 Wildlife & Flora',
  hardship: '⚡ Condition / Hazard',
  reflection: '📖 Journal Reflection'
};

const SECTION_NAMES = {
  oregon: 'Oregon',
  norcal: 'Northern California',
  sierra: 'High Sierra',
  socal: 'Southern California'
};

export class DetailPanel {
  constructor(containerId) {
    this.containerId = containerId;
    this.expanded = false;
    this.photoIndex = 0;
  }

  init() {
    this.render();
    store.subscribe((s, eventType) => {
      if (['select_change', 'entry_added', 'entry_updated', 'entry_deleted', 'filter_change'].includes(eventType)) {
        this.photoIndex = 0;
        this.render();
      }
    });
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const entry = store.getSelectedEntry();
    if (!entry) {
      container.innerHTML = `
        <article class="trail-card-article" style="padding: 24px 16px; text-align: center; color: var(--color-muted);">
          No updates found matching current filters.
        </article>
      `;
      return;
    }

    const filtered = store.getFilteredEntries();
    const index = filtered.findIndex(e => e.id === entry.id);
    const total = filtered.length;
    const elev = elevationAtMile(entry.mile);
    const photos = entry.photos || [];
    const one = photos.length <= 1;
    const metrics = entry.metrics || {};
    const layout = entry.layoutStyle || 'story';

    // 1. Photos Carousel
    let photoHtml = '';
    if (photos.length > 0) {
      if (one) {
        photoHtml = `
          <div class="trail-card-photo-wrapper">
            <button type="button" class="carousel-slide-btn" id="single-photo-btn">
              <img src="${photos[0].src}" alt="${photos[0].alt || entry.title}" class="carousel-slide-img" />
            </button>
          </div>
        `;
      } else {
        photoHtml = `
          <div class="trail-card-photo-wrapper">
            <div class="photo-carousel-track" id="photo-carousel-track">
              ${photos.map((p, idx) => `
                <button type="button" class="carousel-slide-btn" data-index="${idx}">
                  <img src="${p.src}" alt="${p.alt || entry.title}" class="carousel-slide-img" />
                </button>
              `).join('')}
            </div>
            <div class="carousel-dots-indicator">
              ${photos.map((_, i) => `
                <span class="carousel-dot ${i === this.photoIndex ? 'active' : ''}"></span>
              `).join('')}
            </div>
          </div>
        `;
      }
    }

    // 2. Format Body Content based on layout style
    let bodyContentHtml = '';

    if (layout === 'fieldlog') {
      bodyContentHtml = `
        <div class="fieldlog-grid" style="margin-top: 10px;">
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
            <div class="field-label">Daily Miles</div>
            <div class="field-value">${metrics.dayMileage ? metrics.dayMileage + ' mi' : '—'}</div>
          </div>
        </div>

        <div class="${this.expanded ? 'trail-body-expanded' : 'trail-excerpt'}">
          ${entry.body.replace(/\n\n/g, '<br/><br/>')}
        </div>

        ${metrics.gearNotes ? `
          <div class="fieldlog-gear-notes" style="margin-top: 8px;">
            <strong>⚙️ Field Notes:</strong> ${metrics.gearNotes}
          </div>
        ` : ''}
      `;
    } else if (layout === 'minimal') {
      bodyContentHtml = `
        ${entry.quote ? `
          <blockquote class="minimal-lead-quote" style="margin-top: 8px;">
            “${entry.quote}”
          </blockquote>
        ` : ''}

        <div class="${this.expanded ? 'trail-body-expanded' : 'trail-excerpt'}">
          ${entry.body.replace(/\n\n/g, '<br/><br/>')}
        </div>
      `;
    } else {
      // Default: Story layout
      let metricRibbonHtml = '';
      if (metrics.tempF || metrics.condition || metrics.waterSource || metrics.packWeightLbs) {
        metricRibbonHtml = `
          <div class="metric-ribbon" style="margin-top: 6px;">
            ${metrics.tempF ? `<div class="metric-pill">🌡️ <span>${metrics.tempF}°F</span></div>` : ''}
            ${metrics.condition ? `<div class="metric-pill">🌤️ <span>${metrics.condition}</span></div>` : ''}
            ${metrics.waterSource ? `<div class="metric-pill">💧 <span>${metrics.waterSource}</span></div>` : ''}
            ${metrics.packWeightLbs ? `<div class="metric-pill">🎒 <span>${metrics.packWeightLbs} lbs</span></div>` : ''}
            ${metrics.dayMileage ? `<div class="metric-pill">🥾 <span>${metrics.dayMileage} mi</span></div>` : ''}
          </div>
        `;
      }

      bodyContentHtml = `
        ${entry.quote ? `
          <blockquote class="detail-pull-quote" style="margin-top: 8px;">
            "${entry.quote}"
          </blockquote>
        ` : ''}

        ${metricRibbonHtml}

        <div class="${this.expanded ? 'trail-body-expanded' : 'trail-excerpt'}">
          ${entry.body.replace(/\n\n/g, '<br/><br/>')}
        </div>

        ${metrics.gearNotes ? `
          <div class="fieldlog-gear-notes" style="margin-top: 8px;">
            <strong>⚙️ Gear & Resupply:</strong> ${metrics.gearNotes}
          </div>
        ` : ''}
      `;
    }

    container.innerHTML = `
      <article class="trail-card-article ${this.expanded ? 'is-expanded' : ''}">
        ${photoHtml}

        <div class="trail-card-content">
          <!-- Top Badges & Meta Row -->
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
              <span class="badge badge-category badge-cat-${entry.category || 'reflection'}">
                ${CATEGORY_NAMES[entry.category] || '📍 Moment'}
              </span>
              <span class="badge badge-section">
                ${SECTION_NAMES[entry.section] || 'PCT'}
              </span>
            </div>
            
            <button type="button" class="btn-card-edit-quick" id="btn-quick-edit-entry" title="Edit this entry in composer">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <span>Edit</span>
            </button>
          </div>

          <p class="card-meta-stamp">
            ${formatFeedDate(entry.date)} · ${entry.location} · mi ${formatMiles(entry.mile)} · ${formatElevation(elev.elevFt)}
          </p>

          <button type="button" class="card-title-toggle-btn" id="btn-toggle-expand">
            <h2 class="card-heading">${entry.title}</h2>
            ${bodyContentHtml}
            ${!this.expanded ? '<span class="card-read-more-hint">More</span>' : '<span class="card-read-more-hint">Less</span>'}
          </button>

          <!-- Step Navigation Footer -->
          <div class="trail-card-footer-nav">
            <button type="button" class="btn-step-arrow" id="btn-card-prev" ${index <= 0 ? 'disabled' : ''} aria-label="Previous update, north on the trail">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <p class="trail-step-count">
              ${index + 1} / ${total} on trail
            </p>
            <button type="button" class="btn-step-arrow" id="btn-card-next" ${index >= total - 1 ? 'disabled' : ''} aria-label="Next update, south on the trail">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </article>
    `;

    this.attachEvents(container, entry, photos);
  }

  attachEvents(container, entry, photos) {
    // Expand / Collapse Toggle
    container.querySelector('#btn-toggle-expand')?.addEventListener('click', () => {
      this.expanded = !this.expanded;
      this.render();
    });

    // Step Prev / Next
    container.querySelector('#btn-card-prev')?.addEventListener('click', () => {
      store.step(-1);
    });
    container.querySelector('#btn-card-next')?.addEventListener('click', () => {
      store.step(1);
    });

    // Quick Edit Button
    container.querySelector('#btn-quick-edit-entry')?.addEventListener('click', (e) => {
      e.stopPropagation();
      store.setSheet('compose', entry.id);
    });

    // Single Photo Lightbox
    container.querySelector('#single-photo-btn')?.addEventListener('click', () => {
      if (photos[0]) {
        store.openLightbox(photos[0].src, photos[0].alt || entry.title);
      }
    });

    // Carousel Scroll & Lightbox
    const track = container.querySelector('#photo-carousel-track');
    if (track) {
      track.addEventListener('scroll', () => {
        if (track.clientWidth > 0) {
          const newIdx = Math.round(track.scrollLeft / track.clientWidth);
          if (newIdx !== this.photoIndex) {
            this.photoIndex = newIdx;
            const dots = container.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
              dot.classList.toggle('active', i === newIdx);
            });
          }
        }
      });

      const slideBtns = track.querySelectorAll('.carousel-slide-btn');
      slideBtns.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
          if (photos[idx]) {
            store.openLightbox(photos[idx].src, photos[idx].alt || entry.title);
          }
        });
      });
    }
  }
}
