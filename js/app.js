/**
 * DAM HIKES - Main Application Controller
 */

import { store } from './state.js';
import { TrailMap } from './map.js';
import { DetailPanel } from './components/detail-panel.js';
import { ElevationProfile } from './components/elevation-profile.js';
import { TimelineList } from './components/timeline-list.js';
import { AuthorScreen } from './components/author-screen.js';
import { OverviewScreen } from './components/overview-screen.js';

class App {
  constructor() {
    this.map = null;
    this.detailPanel = null;
    this.elevationProfile = null;
    this.timelineList = null;
    this.authorScreen = null;
    this.overviewScreen = null;
  }

  init() {
    // 1. Initialize State
    store.init();

    // 2. Initialize Components
    this.map = new TrailMap('trail-map');
    this.detailPanel = new DetailPanel('moment-detail-container');
    this.elevationProfile = new ElevationProfile('elevation-profile-container');
    this.timelineList = new TimelineList('timeline-list-container');
    this.authorScreen = new AuthorScreen('screen-author');
    this.overviewScreen = new OverviewScreen('screen-overview');

    // Mount Components
    this.map.init();
    this.detailPanel.init();
    this.elevationProfile.init();
    this.timelineList.init();
    this.authorScreen.init();
    this.overviewScreen.init();

    // 3. Setup Global UI Bindings
    this.setupHeaderNavigation();
    this.setupKeyboardShortcuts();
    this.setupLightbox();
    this.setupScreenTransitions();

    console.log('🌲 DAM Hikes initialized successfully.');
  }

  setupHeaderNavigation() {
    // Nav Screen Buttons
    const btnNavExplorer = document.getElementById('nav-btn-explorer');
    const btnNavAuthor = document.getElementById('nav-btn-author');
    const btnNavOverview = document.getElementById('nav-btn-overview');

    if (btnNavExplorer) {
      btnNavExplorer.addEventListener('click', () => store.setScreen('explorer'));
    }
    if (btnNavAuthor) {
      btnNavAuthor.addEventListener('click', () => store.setScreen('author'));
    }
    if (btnNavOverview) {
      btnNavOverview.addEventListener('click', () => store.setScreen('overview'));
    }

    // Theme Toggle Button
    const btnThemeToggle = document.getElementById('btn-theme-toggle');
    if (btnThemeToggle) {
      btnThemeToggle.addEventListener('click', () => {
        store.toggleTheme();
        this.updateThemeButtonIcon();
      });
      this.updateThemeButtonIcon();
    }

    // Full Trail Zoom Button
    const btnFitTrail = document.getElementById('btn-fit-full-trail');
    if (btnFitTrail) {
      btnFitTrail.addEventListener('click', () => {
        this.map.fitFullTrail();
      });
    }
  }

  updateThemeButtonIcon() {
    const btn = document.getElementById('btn-theme-toggle');
    if (!btn) return;
    const isDark = store.theme === 'dark';
    btn.innerHTML = isDark
      ? `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    btn.title = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }

  setupScreenTransitions() {
    store.subscribe((s, eventType) => {
      if (eventType === 'screen_change') {
        const screens = {
          explorer: document.getElementById('screen-explorer'),
          author: document.getElementById('screen-author'),
          overview: document.getElementById('screen-overview')
        };

        const navBtns = {
          explorer: document.getElementById('nav-btn-explorer'),
          author: document.getElementById('nav-btn-author'),
          overview: document.getElementById('nav-btn-overview')
        };

        for (const [key, screenEl] of Object.entries(screens)) {
          if (!screenEl) continue;
          if (key === store.activeScreen) {
            screenEl.classList.add('active');
            screenEl.style.display = 'block';
          } else {
            screenEl.classList.remove('active');
            screenEl.style.display = 'none';
          }
        }

        for (const [key, btn] of Object.entries(navBtns)) {
          if (!btn) continue;
          if (key === store.activeScreen) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        }

        // Invalidate map size if switching back to explorer
        if (store.activeScreen === 'explorer') {
          setTimeout(() => {
            this.map.invalidateSize();
          }, 50);
        }
      }
    });
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Don't capture when typing in inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'j') {
        store.nextMoment();
      } else if (e.key === 'ArrowLeft' || e.key === 'k') {
        store.prevMoment();
      } else if (e.key === 'Escape') {
        store.closeLightbox();
      }
    });
  }

  setupLightbox() {
    const lightbox = document.getElementById('photo-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    if (!lightbox) return;

    store.subscribe((s, eventType) => {
      if (eventType === 'lightbox_open' && store.lightboxPhoto) {
        lightboxImg.src = store.lightboxPhoto.url;
        lightboxCaption.textContent = store.lightboxPhoto.caption || '';
        lightbox.classList.add('open');
      } else if (eventType === 'lightbox_close') {
        lightbox.classList.remove('open');
      }
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => store.closeLightbox());
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
        store.closeLightbox();
      }
    });
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
