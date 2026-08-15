/**
 * DAM HIKES - Trail Card Component (Active Moment Viewer)
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

export class DetailPanel {
  constructor(containerId) {
    this.containerId = containerId;
    this.expanded = false;
    this.photoIndex = 0;
  }

  init() {
    this.render();
    store.subscribe((s, eventType) => {
      if (['select_change', 'entry_added'].includes(eventType)) {
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
        <article class="trail-card-article" style="padding: 16px; text-align: center; color: var(--color-muted);">
          No updates yet.
        </article>
      `;
      return;
    }

    const ordered = store.getOrderedEntries();
    const index = ordered.findIndex(e => e.id === entry.id);
    const total = ordered.length;
    const elev = elevationAtMile(entry.mile);
    const photos = entry.photos || [];
    const one = photos.length <= 1;

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

    container.innerHTML = `
      <article class="trail-card-article ${this.expanded ? 'is-expanded' : ''}">
        ${photoHtml}

        <div class="trail-card-content">
          <p class="card-meta-stamp">
            ${formatFeedDate(entry.date)} · ${entry.location} · mi ${formatMiles(entry.mile)} · ${formatElevation(elev.elevFt)}
          </p>

          <button type="button" class="card-title-toggle-btn" id="btn-toggle-expand">
            <h2 class="card-heading">${entry.title}</h2>
            <div class="${this.expanded ? 'trail-body-expanded' : 'trail-excerpt'}">
              ${entry.body.replace(/\n\n/g, '<br/><br/>')}
            </div>
            ${!this.expanded ? '<span class="card-read-more-hint">More</span>' : ''}
          </button>

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
