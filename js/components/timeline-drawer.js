/**
 * DAM HIKES - Timeline Index & Filter Drawer Component
 */

import { store } from '../state.js';
import { formatMiles } from '../data/pct-route.js';

const CATEGORIES = [
  { id: 'all', icon: '✨', name: 'All' },
  { id: 'campsite', icon: '⛺', name: 'Camps' },
  { id: 'milestone', icon: '🏔️', name: 'Passes' },
  { id: 'resupply', icon: '🍕', name: 'Towns' },
  { id: 'wildlife', icon: '🐻', name: 'Wildlife' },
  { id: 'hardship', icon: '⚡', name: 'Hazards' },
  { id: 'reflection', icon: '📖', name: 'Journal' }
];

const SECTIONS = [
  { id: 'all', name: 'Entire Trail' },
  { id: 'oregon', name: 'Oregon' },
  { id: 'norcal', name: 'NorCal' },
  { id: 'sierra', name: 'Sierra' },
  { id: 'socal', name: 'SoCal' }
];

export class TimelineDrawer {
  constructor(containerId) {
    this.containerId = containerId;
  }

  init() {
    this.render();
    store.subscribe((s, eventType) => {
      if (['select_change', 'entry_added', 'entry_updated', 'entry_deleted', 'filter_change', 'sheet_change'].includes(eventType)) {
        if (store.sheet === 'timeline') {
          this.render();
        }
      }
    });
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const filtered = store.getFilteredEntries();
    const selectedId = store.selectedId;

    container.innerHTML = `
      <div class="timeline-drawer-content">
        <!-- Search Bar -->
        <div class="search-input-wrapper" style="margin-bottom: 12px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="position: absolute; left: 10px; color: var(--color-muted);"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" id="drawer-search-input" placeholder="Search moments, stories, places..." value="${store.searchQuery || ''}" style="width: 100%; padding: 8px 12px 8px 32px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); background: var(--color-bg); color: var(--color-fg); font-size: 14px; outline: none;" />
          ${store.searchQuery ? `<button id="drawer-clear-search" style="position: absolute; right: 8px; color: var(--color-muted); font-size: 16px;">×</button>` : ''}
        </div>

        <!-- Section Pills -->
        <div class="section-pills-row" style="margin-bottom: 10px; display: flex; gap: 6px; overflow-x: auto; padding-bottom: 2px;">
          ${SECTIONS.map(sec => `
            <button type="button" class="pill-btn ${store.filterSection === sec.id ? 'active' : ''}" data-section="${sec.id}">
              ${sec.name}
            </button>
          `).join('')}
        </div>

        <!-- Category Pills -->
        <div class="category-pills-row" style="margin-bottom: 14px; display: flex; gap: 6px; overflow-x: auto; padding-bottom: 2px;">
          ${CATEGORIES.map(cat => `
            <button type="button" class="pill-category ${store.filterCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
              <span>${cat.icon}</span>
              <span>${cat.name}</span>
            </button>
          `).join('')}
        </div>

        <!-- Meta count bar -->
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: var(--color-muted); margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid var(--color-border);">
          <span><strong>${filtered.length}</strong> updates along trail</span>
          ${(store.filterSection !== 'all' || store.filterCategory !== 'all' || store.searchQuery) ? `
            <button type="button" id="drawer-reset-filters" style="color: var(--color-trail); text-decoration: underline; font-weight: 600;">Reset Filters</button>
          ` : ''}
        </div>

        <!-- Scrollable Moments List -->
        <div class="timeline-items-list" style="display: flex; flex-direction: column; gap: 8px;">
          ${filtered.length === 0 ? `
            <p style="padding: 24px; text-align: center; color: var(--color-muted);">No entries match your search/filter.</p>
          ` : filtered.map(item => {
            const isSelected = item.id === selectedId;
            const photoSrc = item.photos && item.photos.length > 0 ? item.photos[0].src : null;
            const itemType = item.type || (item.scripture ? 'scripture' : item.kirtan ? 'kirtan' : item.voice ? 'voice' : item.layoutStyle === 'fieldlog' ? 'statistics' : 'words');
            const typeLabels = {
              statistics: '📊 Stats',
              words: '✍️ Words',
              voice: '🎙️ Voice',
              scripture: '📜 Scripture',
              kirtan: '📿 Kirtan'
            };

            return `
              <div class="drawer-timeline-card ${isSelected ? 'selected' : ''}" data-id="${item.id}" style="display: flex; gap: 10px; padding: 10px; border-radius: var(--radius-sm); background: var(--color-surface); border: 1px solid ${isSelected ? 'var(--color-trail)' : 'var(--color-border)'}; cursor: pointer;">
                ${photoSrc ? `
                  <img src="${photoSrc}" alt="${item.title}" style="width: 54px; height: 54px; object-fit: cover; border-radius: 4px; flex-shrink: 0;" />
                ` : ''}
                <div style="flex: 1; min-width: 0;">
                  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: var(--color-muted); font-family: var(--font-mono); margin-bottom: 2px;">
                    <span>mi ${formatMiles(item.mile)} · Day ${item.dayNumber || 1}</span>
                    <span style="font-size: 10px; padding: 1px 6px; border-radius: 4px; background: rgba(228, 220, 203, 0.08); color: var(--color-trail);">${typeLabels[itemType] || '✍️ Entry'}</span>
                  </div>
                  <h4 style="font-family: var(--font-display); font-size: 14.5px; color: var(--color-fg); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 1px 0;">
                    ${item.title}
                  </h4>
                  <p style="font-size: 11.5px; color: var(--color-subtle); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    📍 ${item.location}
                  </p>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    this.attachEvents(container);
  }

  attachEvents(container) {
    // Search
    const searchInput = container.querySelector('#drawer-search-input');
    searchInput?.addEventListener('input', (e) => {
      store.setFilters({ query: e.target.value });
    });

    container.querySelector('#drawer-clear-search')?.addEventListener('click', () => {
      store.setFilters({ query: '' });
    });

    // Sections
    container.querySelectorAll('.section-pills-row .pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        store.setFilters({ section: btn.dataset.section });
      });
    });

    // Categories
    container.querySelectorAll('.category-pills-row .pill-category').forEach(btn => {
      btn.addEventListener('click', () => {
        store.setFilters({ category: btn.dataset.category });
      });
    });

    // Reset
    container.querySelector('#drawer-reset-filters')?.addEventListener('click', () => {
      store.setFilters({ section: 'all', category: 'all', query: '' });
    });

    // Item Selection
    container.querySelectorAll('.drawer-timeline-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        store.select(id, 'entry');
        store.setSheet(null);
      });
    });
  }
}
