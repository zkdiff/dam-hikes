/**
 * DAM HIKES - Main Application Controller
 */

import { store } from './state.js';
import { TrailMap } from './map.js';
import { DetailPanel } from './components/detail-panel.js';
import { ElevationProfile } from './components/elevation-profile.js';
import { OverviewScreen } from './components/overview-screen.js';
import { AuthorScreen } from './components/author-screen.js';
import { milesWalked, daysOnTrail, hasStarted, formatMiles } from './data/pct-route.js';

class App {
  constructor() {
    this.map = null;
    this.detailPanel = null;
    this.elevationProfile = null;
    this.overviewScreen = null;
    this.authorScreen = null;
  }

  init() {
    // 1. Initialize State
    store.init();

    // 2. Initialize Components
    this.map = new TrailMap('trail-map');
    this.detailPanel = new DetailPanel('moment-detail-container');
    this.elevationProfile = new ElevationProfile('elevation-profile-container');
    this.overviewScreen = new OverviewScreen('sheet-about-content');
    this.authorScreen = new AuthorScreen('sheet-compose-content');

    this.map.init();
    this.detailPanel.init();
    this.elevationProfile.init();
    this.overviewScreen.init();
    this.authorScreen.init();

    // 3. Bind UI Elements
    this.setupHeader();
    this.setupSheets();
    this.setupLightbox();
    this.setupKeyboardShortcuts();
    this.updateHeaderStats();

    // 4. Subscribe to State Changes
    store.subscribe((s, eventType) => {
      if (['select_change', 'entry_added'].includes(eventType)) {
        this.updateHeaderStats();
      }
    });

    console.log('🌲 DAM Hikes (Prototype Aesthetic) initialized.');
  }

  setupHeader() {
    document.getElementById('btn-open-about')?.addEventListener('click', () => {
      store.setSheet('about');
    });

    document.getElementById('btn-open-compose')?.addEventListener('click', () => {
      store.setSheet('compose');
    });
  }

  updateHeaderStats() {
    const selected = store.getSelectedEntry();
    if (!selected) return;

    const walked = milesWalked(selected.mile);
    const days = daysOnTrail();
    const started = hasStarted();

    const locEl = document.getElementById('header-location');
    const mileEl = document.getElementById('header-mile');
    const dayEl = document.getElementById('header-day');
    const walkedEl = document.getElementById('header-walked');
    const remEl = document.getElementById('header-remaining');

    if (locEl) locEl.textContent = selected.location;
    if (mileEl) mileEl.textContent = formatMiles(selected.mile);
    if (dayEl) dayEl.textContent = started ? `day ${days}` : 'starts tomorrow';
    if (walkedEl) walkedEl.textContent = formatMiles(walked);
    if (remEl) remEl.textContent = formatMiles(selected.mile);
  }

  setupSheets() {
    const sheetAbout = document.getElementById('sheet-about');
    const sheetCompose = document.getElementById('sheet-compose');

    const updateSheets = () => {
      if (sheetAbout) {
        sheetAbout.classList.toggle('open', store.sheet === 'about');
      }
      if (sheetCompose) {
        sheetCompose.classList.toggle('open', store.sheet === 'compose');
      }
    };

    store.subscribe((s, eventType) => {
      if (eventType === 'sheet_change' || eventType === 'entry_added') {
        updateSheets();
      }
    });

    // Close buttons & backdrops
    document.getElementById('sheet-about-close')?.addEventListener('click', () => store.setSheet(null));
    document.getElementById('sheet-about-backdrop')?.addEventListener('click', () => store.setSheet(null));

    document.getElementById('sheet-compose-close')?.addEventListener('click', () => store.setSheet(null));
    document.getElementById('sheet-compose-backdrop')?.addEventListener('click', () => store.setSheet(null));
  }

  setupLightbox() {
    const lightbox = document.getElementById('photo-lightbox');
    const img = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close-btn');

    store.subscribe((s, eventType) => {
      if (eventType === 'lightbox_change') {
        if (store.lightbox) {
          img.src = store.lightbox.src;
          img.alt = store.lightbox.alt;
          lightbox.classList.add('open');
        } else {
          lightbox.classList.remove('open');
        }
      }
    });

    closeBtn?.addEventListener('click', () => store.closeLightbox());
    lightbox?.addEventListener('click', (e) => {
      if (e.target === lightbox) store.closeLightbox();
    });
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'ArrowLeft') {
        store.step(-1);
      } else if (e.key === 'ArrowRight') {
        store.step(1);
      } else if (e.key === 'Escape') {
        if (store.lightbox) {
          store.closeLightbox();
        } else if (store.sheet) {
          store.setSheet(null);
        }
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
