/**
 * DAM HIKES - Clean, Minimalist TrailCard Component
 * Uncluttered collapsed state; structured stats placed in dedicated expanded footer.
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

    // 1. Photos Carousel
    let photoHtml = '';
    if (photos.length > 0) {
      if (one) {
        photoHtml = `
          <div class="trail-card-photo-wrapper">
            <button type="button" class="carousel-slide-btn" id="single-photo-btn" aria-label="View photo in fullscreen">
              <img src="${photos[0].src}" alt="${photos[0].alt || entry.title}" class="carousel-slide-img" />
            </button>
          </div>
        `;
      } else {
        photoHtml = `
          <div class="trail-card-photo-wrapper">
            <div class="photo-carousel-track" id="photo-carousel-track">
              ${photos.map((p, idx) => `
                <button type="button" class="carousel-slide-btn" data-index="${idx}" aria-label="View photo ${idx + 1} in fullscreen">
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

    // 2. Structured Stats Section (Only rendered when expanded)
    let statsSectionHtml = '';
    if (this.expanded) {
      const hasMetrics = metrics.tempF || metrics.condition || metrics.waterSource || metrics.packWeightLbs || metrics.dayMileage || metrics.gearNotes;

      statsSectionHtml = `
        <div class="card-expanded-stats-box">
          <div class="stats-box-header">
            <div class="stats-badge-group">
              <span class="badge badge-category badge-cat-${entry.category || 'reflection'}">
                ${CATEGORY_NAMES[entry.category] || '📍 Moment'}
              </span>
              <span class="badge badge-section">
                ${SECTION_NAMES[entry.section] || 'PCT'}
              </span>
            </div>
            
            <button type="button" class="btn-card-edit-quick" id="btn-quick-edit-entry" title="Edit this entry in composer">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <span>Edit</span>
            </button>
          </div>

          ${hasMetrics ? `
            <div class="fieldlog-grid">
              <div class="field-cell">
                <div class="field-label">Weather / Temp</div>
                <div class="field-value">${metrics.tempF ? metrics.tempF + '°F' : '—'}${metrics.condition ? ` · ${metrics.condition}` : ''}</div>
              </div>
              <div class="field-cell">
                <div class="field-label">Water Status</div>
                <div class="field-value">${metrics.waterSource || 'Stream on trail'}</div>
              </div>
              <div class="field-cell">
                <div class="field-label">Pack Weight</div>
                <div class="field-value">${metrics.packWeightLbs ? metrics.packWeightLbs + ' lbs' : '11.4 lb base'}</div>
              </div>
              <div class="field-cell">
                <div class="field-label">Daily Miles</div>
                <div class="field-value">${metrics.dayMileage ? metrics.dayMileage + ' mi' : '—'}</div>
              </div>
            </div>
          ` : ''}

          ${metrics.gearNotes ? `
            <div class="fieldlog-gear-notes">
              <strong>⚙️ Field & Gear Notes:</strong> ${metrics.gearNotes}
            </div>
          ` : ''}
        </div>
      `;
    }

    // 3. Body Content
    const bodyText = entry.body ? entry.body.replace(/\n\n/g, '<br/><br/>') : '';

    container.innerHTML = `
      <article class="trail-card-article ${this.expanded ? 'is-expanded' : ''}">
        ${photoHtml}

        <div class="trail-card-content">
          <!-- Clean Meta Stamp -->
          <p class="card-meta-stamp">
            ${formatFeedDate(entry.date)} · ${entry.location} · mi ${formatMiles(entry.mile)} · ${formatElevation(elev.elevFt)}
          </p>

          <!-- Title & Story -->
          <button type="button" class="card-title-toggle-btn" id="btn-toggle-expand">
            <h2 class="card-heading">${entry.title}</h2>
            
            ${this.expanded ? `
              <div class="trail-body-expanded">
                ${entry.quote ? `
                  <blockquote class="detail-pull-quote">
                    "${entry.quote}"
                  </blockquote>
                ` : ''}
                <div class="trail-body-text">${bodyText}</div>
                ${statsSectionHtml}
              </div>
            ` : `
              <div class="trail-excerpt">
                ${bodyText}
              </div>
            `}
            
            <span class="card-read-more-hint">${!this.expanded ? 'More' : 'Less'}</span>
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
    container.querySelector('#btn-toggle-expand')?.addEventListener('click', (e) => {
      // Don't toggle if clicking a button inside
      if (e.target.closest('#btn-quick-edit-entry') || e.target.closest('a')) return;
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

    // Quick Edit Button (inside stats section)
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
