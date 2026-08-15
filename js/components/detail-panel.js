/**
 * DAM HIKES - Adaptive 3-Format TrailCard Component
 * Implements Rich Story, Minimalist Reflection, and Field Log display formats.
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

    const elev = elevationAtMile(entry.mile);
    const photos = entry.photos || [];
    const one = photos.length <= 1;
    const metrics = entry.metrics || {};
    const layout = entry.layoutStyle || 'story';
    const hasMetrics = metrics.tempF || metrics.condition || metrics.waterSource || metrics.packWeightLbs || metrics.dayMileage || metrics.gearNotes;
    const paragraphs = (entry.body || '').split('\n\n').filter(Boolean);

    // 1. Photos Carousel / Hero
    let photoHtml = '';
    if (photos.length > 0) {
      if (one || layout === 'minimal') {
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

    // 2. Format-Specific Body Content
    let bodyContentHtml = '';

    if (layout === 'minimal') {
      // --- FORMAT 1: MINIMALIST REFLECTION ---
      const leadQuote = entry.quote || paragraphs[0] || '';
      
      if (this.expanded) {
        bodyContentHtml = `
          <div class="trail-body-expanded format-minimal" id="trail-body-expanded-box">
            ${leadQuote ? `
              <blockquote class="minimal-centerpiece-quote">
                “${leadQuote}”
              </blockquote>
            ` : ''}
            
            <div class="trail-story-prose">
              ${paragraphs.map(p => `<p>${p}</p>`).join('')}
            </div>

            <!-- Minimalist Clean Footer Stamp -->
            <div class="trail-expanded-stats-footer" style="display: flex; align-items: center; justify-content: space-between;">
              <div class="stats-badge-group">
                <span class="badge badge-category badge-cat-${entry.category || 'reflection'}">
                  ${CATEGORY_NAMES[entry.category] || '📖 Reflection'}
                </span>
                <span class="badge badge-section">${SECTION_NAMES[entry.section] || 'PCT'}</span>
              </div>
              <button type="button" class="btn-card-edit-quick" id="btn-quick-edit-entry" title="Edit entry">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                <span>Edit</span>
              </button>
            </div>
          </div>
          <button type="button" class="card-read-more-btn" id="btn-toggle-expand">Less</button>
        `;
      } else {
        bodyContentHtml = `
          <div class="trail-excerpt format-minimal" id="trail-excerpt-box" style="cursor: pointer;">
            <blockquote class="minimal-lead-quote">
              “${leadQuote}”
            </blockquote>
          </div>
          <button type="button" class="card-read-more-btn" id="btn-toggle-expand">More</button>
        `;
      }

    } else if (layout === 'fieldlog') {
      // --- FORMAT 2: FIELD LOG ---
      const gridHtml = `
        <div class="fieldlog-grid" style="margin: 8px 0 12px 0;">
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
      `;

      if (this.expanded) {
        bodyContentHtml = `
          <div class="trail-body-expanded format-fieldlog" id="trail-body-expanded-box">
            <!-- Lead 4-cell data grid -->
            ${gridHtml}

            ${metrics.gearNotes ? `
              <div class="fieldlog-gear-notes" style="margin-bottom: 12px;">
                <strong>⚙️ Resupply & Gear Notes:</strong> ${metrics.gearNotes}
              </div>
            ` : ''}

            <div class="trail-story-prose">
              ${paragraphs.map(p => `<p>${p}</p>`).join('')}
            </div>

            <div class="trail-expanded-stats-footer">
              <div class="stats-footer-header">
                <div class="stats-badge-group">
                  <span class="badge badge-category badge-cat-${entry.category || 'resupply'}">
                    ${CATEGORY_NAMES[entry.category] || '🍕 Resupply'}
                  </span>
                  <span class="badge badge-section">${SECTION_NAMES[entry.section] || 'PCT'}</span>
                </div>
                <button type="button" class="btn-card-edit-quick" id="btn-quick-edit-entry" title="Edit entry">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </div>
          <button type="button" class="card-read-more-btn" id="btn-toggle-expand">Less</button>
        `;
      } else {
        bodyContentHtml = `
          <div class="trail-excerpt format-fieldlog" id="trail-excerpt-box" style="cursor: pointer;">
            ${gridHtml}
            <div style="font-size: 14px; color: rgba(236, 231, 220, 0.85); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${paragraphs[0] || entry.body}
            </div>
          </div>
          <button type="button" class="card-read-more-btn" id="btn-toggle-expand">More</button>
        `;
      }

    } else {
      // --- FORMAT 3: RICH STORY (DEFAULT) ---
      const statsFooterHtml = `
        <div class="trail-expanded-stats-footer">
          <div class="stats-footer-header">
            <div class="stats-badge-group">
              <span class="badge badge-category badge-cat-${entry.category || 'reflection'}">
                ${CATEGORY_NAMES[entry.category] || '📍 Moment'}
              </span>
              <span class="badge badge-section">${SECTION_NAMES[entry.section] || 'PCT'}</span>
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

      if (this.expanded) {
        bodyContentHtml = `
          <div class="trail-body-expanded format-story" id="trail-body-expanded-box">
            ${entry.quote ? `
              <blockquote class="detail-pull-quote">
                "${entry.quote}"
              </blockquote>
            ` : ''}
            
            <div class="trail-story-prose">
              ${paragraphs.map(p => `<p>${p}</p>`).join('')}
            </div>

            ${statsFooterHtml}
          </div>
          <button type="button" class="card-read-more-btn" id="btn-toggle-expand">Less</button>
        `;
      } else {
        bodyContentHtml = `
          <div class="trail-excerpt format-story" id="trail-excerpt-box" style="cursor: pointer;">
            ${paragraphs[0] || entry.body}
          </div>
          <button type="button" class="card-read-more-btn" id="btn-toggle-expand">More</button>
        `;
      }
    }

    container.innerHTML = `
      <article class="trail-card-article ${this.expanded ? 'is-expanded' : ''} format-${layout}">
        ${photoHtml}

        <div class="trail-card-content">
          <!-- Clean Monospace Meta Stamp -->
          <p class="card-meta-stamp">
            ${formatFeedDate(entry.date)} · ${entry.location} · mi ${formatMiles(entry.mile)} · ${formatElevation(elev.elevFt)}
          </p>

          <!-- Heading -->
          <h2 class="card-heading" id="card-heading-title" style="cursor: pointer;">
            ${entry.title}
          </h2>

          <!-- Adaptive Body Content -->
          ${bodyContentHtml}
        </div>
      </article>
    `;

    this.attachEvents(container, entry, photos);
  }

  attachEvents(container, entry, photos) {
    const toggle = () => {
      this.expanded = !this.expanded;
      this.render();
    };

    container.querySelector('#btn-toggle-expand')?.addEventListener('click', toggle);
    container.querySelector('#card-heading-title')?.addEventListener('click', toggle);
    container.querySelector('#trail-excerpt-box')?.addEventListener('click', toggle);

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
