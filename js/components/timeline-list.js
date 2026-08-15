/**
 * DAM HIKES - Chronological Timeline List & Filter Component
 */

import { store } from '../state.js';
import { PCT_SECTIONS } from '../data/pct-route.js';

export class TimelineList {
  constructor(containerId) {
    this.containerId = containerId;
  }

  init() {
    this.render();
    store.subscribe((s, eventType) => {
      if (['moment_selected', 'filters_changed', 'moment_added', 'moment_updated', 'moment_deleted', 'theme_change', 'data_imported', 'reset_defaults'].includes(eventType)) {
        this.render();
        if (eventType === 'moment_selected') {
          this.scrollToSelected();
        }
      }
    });
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const moments = store.getFilteredMoments();
    const selectedId = store.selectedMomentId;

    const sections = [
      { id: 'all', name: 'Entire Trail' },
      { id: 'oregon', name: 'Oregon' },
      { id: 'norcal', name: 'NorCal' },
      { id: 'sierra', name: 'Sierra' },
      { id: 'socal', name: 'SoCal' }
    ];

    const categories = [
      { id: 'all', icon: '✨', name: 'All' },
      { id: 'campsite', icon: '⛺', name: 'Camp' },
      { id: 'milestone', icon: '🏔️', name: 'Passes' },
      { id: 'resupply', icon: '🍕', name: 'Town' },
      { id: 'wildlife', icon: '🐻', name: 'Flora/Fauna' },
      { id: 'hardship', icon: '⚡', name: 'Hazards' },
      { id: 'reflection', icon: '📖', name: 'Journal' }
    ];

    container.innerHTML = `
      <div class="timeline-container">
        <!-- Filter Header -->
        <div class="timeline-filter-header">
          <div class="timeline-search-row">
            <div class="search-input-wrapper">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input type="text" id="timeline-search-input" placeholder="Search moments, stories, places..." value="${store.searchQuery || ''}" />
              ${store.searchQuery ? `<button id="btn-clear-search" class="btn-clear-search" title="Clear search">×</button>` : ''}
            </div>
            <button class="btn-add-quick" id="btn-timeline-add-entry" title="Add new trail moment">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>Add Entry</span>
            </button>
          </div>

          <!-- Section Tabs -->
          <div class="section-pills-row">
            ${sections.map(s => `
              <button class="pill-btn ${store.filterSection === s.id ? 'active' : ''}" data-section="${s.id}">
                ${s.name}
              </button>
            `).join('')}
          </div>

          <!-- Category Filter Pills -->
          <div class="category-pills-row">
            ${categories.map(c => `
              <button class="pill-category ${store.filterCategory === c.id ? 'active' : ''} cat-${c.id}" data-category="${c.id}">
                <span>${c.icon}</span>
                <span>${c.name}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Moment Count & Reset Filter Bar -->
        <div class="timeline-meta-bar">
          <span class="timeline-count"><strong>${moments.length}</strong> moments along route</span>
          ${(store.filterSection !== 'all' || store.filterCategory !== 'all' || store.searchQuery) ? `
            <button class="btn-reset-filters" id="btn-reset-filters">Reset Filters</button>
          ` : ''}
        </div>

        <!-- Scrollable Moments List -->
        <div class="timeline-scroll-list" id="timeline-scroll-list">
          ${moments.length === 0 ? `
            <div class="timeline-empty-state">
              <p>No moments match your current filter.</p>
              <button class="btn-secondary" id="btn-empty-reset">Clear Filters</button>
            </div>
          ` : moments.map(m => {
            const isSelected = m.id === selectedId;
            const photoUrl = m.photos && m.photos.length > 0 ? m.photos[0].url : null;

            return `
              <div class="timeline-card ${isSelected ? 'selected' : ''} cat-${m.category}" data-id="${m.id}" id="timeline-item-${m.id}">
                <div class="timeline-card-indicator" style="background-color: ${this.getCategoryColor(m.category)};"></div>
                
                <div class="timeline-card-content">
                  <div class="card-meta-line">
                    <span class="badge-cat-tag badge-cat-${m.category}">
                      ${this.getCategoryIcon(m.category)} Mile ${m.mileMarker.toFixed(1)}
                    </span>
                    <span class="card-day">Day ${m.dayNumber}</span>
                  </div>

                  <h4 class="card-title">${m.title}</h4>
                  <div class="card-location">📍 ${m.locationName}</div>
                  <p class="card-snippet">${this.getSnippet(m.story, 100)}</p>
                </div>

                ${photoUrl ? `
                  <div class="timeline-card-thumb">
                    <img src="${photoUrl}" alt="${m.title}" loading="lazy" />
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    this.attachEventListeners(container);
  }

  attachEventListeners(container) {
    // Search input
    const searchInput = container.querySelector('#timeline-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        store.setFilters({ query: e.target.value });
      });
    }

    const clearSearch = container.querySelector('#btn-clear-search');
    if (clearSearch) {
      clearSearch.addEventListener('click', () => {
        store.setFilters({ query: '' });
      });
    }

    // Section pills
    const sectionBtns = container.querySelectorAll('.section-pills-row .pill-btn');
    sectionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        store.setFilters({ section: btn.dataset.section });
      });
    });

    // Category pills
    const catBtns = container.querySelectorAll('.category-pills-row .pill-category');
    catBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        store.setFilters({ category: btn.dataset.category });
      });
    });

    // Reset filters
    const resetBtn = container.querySelector('#btn-reset-filters') || container.querySelector('#btn-empty-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        store.setFilters({ section: 'all', category: 'all', query: '' });
      });
    }

    // Add entry button
    const addBtn = container.querySelector('#btn-timeline-add-entry');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        store.setScreen('author');
      });
    }

    // Moment item clicks
    const cards = container.querySelectorAll('.timeline-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        store.selectMoment(id);
      });
    });
  }

  scrollToSelected() {
    const selectedId = store.selectedMomentId;
    if (!selectedId) return;

    setTimeout(() => {
      const el = document.getElementById(`timeline-item-${selectedId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 50);
  }

  getSnippet(text, maxLen = 100) {
    if (!text) return '';
    const clean = text.replace(/[\n\r]+/g, ' ').trim();
    if (clean.length <= maxLen) return clean;
    return clean.slice(0, maxLen) + '...';
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

  getCategoryColor(cat) {
    const colors = {
      campsite: '#10B981',
      milestone: '#3B82F6',
      resupply: '#F59E0B',
      wildlife: '#8B5CF6',
      hardship: '#EF4444',
      reflection: '#EC4899'
    };
    return colors[cat] || '#10B981';
  }
}
