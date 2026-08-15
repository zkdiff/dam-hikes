/**
 * DAM HIKES - Reactive State Store & Persistence
 */

import { MOMENTS_SEED } from './data/moments-seed.js';
import { PCT_SECTIONS, getRoutePointForMile } from './data/pct-route.js';

const STORAGE_KEY = 'dam_hikes_moments_v1';
const THEME_KEY = 'dam_hikes_theme_v1';

class TrailStore {
  constructor() {
    this.moments = [];
    this.selectedMomentId = null;
    this.activeScreen = 'explorer'; // 'explorer' | 'author' | 'overview'
    this.editingMomentId = null;
    this.filterSection = 'all';
    this.filterCategory = 'all';
    this.searchQuery = '';
    this.theme = localStorage.getItem(THEME_KEY) || 'light';
    this.lightboxPhoto = null;
    this.listeners = new Set();
  }

  init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.moments = JSON.parse(stored);
      } else {
        this.moments = [...MOMENTS_SEED];
        this.save();
      }
    } catch (e) {
      console.warn('Failed to load from localStorage, using seed data', e);
      this.moments = [...MOMENTS_SEED];
    }

    // Ensure moments are sorted by mileMarker
    this.sortMoments();

    // Default selection to first moment or stored
    if (this.moments.length > 0) {
      this.selectedMomentId = this.moments[0].id;
    }

    // Apply saved theme
    this.applyTheme(this.theme);
    this.notify();
  }

  sortMoments() {
    this.moments.sort((a, b) => a.mileMarker - b.mileMarker);
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.moments));
    } catch (e) {
      console.error('Failed to save moments to localStorage', e);
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(eventType = 'state_change') {
    for (const listener of this.listeners) {
      listener(this, eventType);
    }
  }

  getSelectedMoment() {
    return this.moments.find(m => m.id === this.selectedMomentId) || this.moments[0] || null;
  }

  getFilteredMoments() {
    return this.moments.filter(m => {
      if (this.filterSection !== 'all' && m.section !== this.filterSection) {
        return false;
      }
      if (this.filterCategory !== 'all' && m.category !== this.filterCategory) {
        return false;
      }
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchesTitle = m.title.toLowerCase().includes(q);
        const matchesStory = m.story.toLowerCase().includes(q);
        const matchesLoc = m.locationName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesStory && !matchesLoc) return false;
      }
      return true;
    });
  }

  selectMoment(id) {
    const exists = this.moments.some(m => m.id === id);
    if (exists && this.selectedMomentId !== id) {
      this.selectedMomentId = id;
      this.notify('moment_selected');
    }
  }

  nextMoment() {
    const list = this.getFilteredMoments();
    if (list.length === 0) return;
    const currentIndex = list.findIndex(m => m.id === this.selectedMomentId);
    if (currentIndex >= 0 && currentIndex < list.length - 1) {
      this.selectMoment(list[currentIndex + 1].id);
    } else if (currentIndex === -1 && list.length > 0) {
      this.selectMoment(list[0].id);
    }
  }

  prevMoment() {
    const list = this.getFilteredMoments();
    if (list.length === 0) return;
    const currentIndex = list.findIndex(m => m.id === this.selectedMomentId);
    if (currentIndex > 0) {
      this.selectMoment(list[currentIndex - 1].id);
    }
  }

  setScreen(screen, editingMomentId = null) {
    this.activeScreen = screen;
    this.editingMomentId = editingMomentId;
    this.notify('screen_change');
  }

  setFilters({ section, category, query }) {
    if (section !== undefined) this.filterSection = section;
    if (category !== undefined) this.filterCategory = category;
    if (query !== undefined) this.searchQuery = query;
    this.notify('filters_changed');
  }

  addMoment(data) {
    const id = 'moment-' + Date.now();
    const routePt = getRoutePointForMile(data.mileMarker);
    const section = this.computeSectionForMile(data.mileMarker);

    const newMoment = {
      id,
      title: data.title || 'Untitled Trail Moment',
      date: data.date || new Date().toISOString().split('T')[0],
      dayNumber: Number(data.dayNumber) || 1,
      mileMarker: Number(data.mileMarker) || 0.0,
      section,
      locationName: data.locationName || 'PCT Waypoint',
      lat: routePt[0],
      lng: routePt[1],
      elevationFt: routePt[2] || data.elevationFt || 3000,
      category: data.category || 'journal',
      layoutStyle: data.layoutStyle || 'story',
      quote: data.quote || '',
      story: data.story || '',
      photos: data.photos || [],
      metrics: data.metrics || {},
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.moments.push(newMoment);
    this.sortMoments();
    this.save();
    this.selectedMomentId = newMoment.id;
    this.setScreen('explorer');
    this.notify('moment_added');
  }

  updateMoment(id, data) {
    const index = this.moments.findIndex(m => m.id === id);
    if (index === -1) return;

    const existing = this.moments[index];
    const routePt = getRoutePointForMile(data.mileMarker !== undefined ? data.mileMarker : existing.mileMarker);
    const section = this.computeSectionForMile(data.mileMarker !== undefined ? data.mileMarker : existing.mileMarker);

    this.moments[index] = {
      ...existing,
      ...data,
      section,
      lat: routePt[0],
      lng: routePt[1],
      elevationFt: routePt[2] || data.elevationFt || existing.elevationFt,
      updatedAt: Date.now()
    };

    this.sortMoments();
    this.save();
    this.selectedMomentId = id;
    this.setScreen('explorer');
    this.notify('moment_updated');
  }

  deleteMoment(id) {
    this.moments = this.moments.filter(m => m.id !== id);
    this.save();
    if (this.selectedMomentId === id && this.moments.length > 0) {
      this.selectedMomentId = this.moments[0].id;
    }
    this.setScreen('explorer');
    this.notify('moment_deleted');
  }

  computeSectionForMile(mile) {
    if (mile < 430) return 'oregon';
    if (mile < 980) return 'norcal';
    if (mile < 1515) return 'sierra';
    return 'socal';
  }

  resetToDefaults() {
    this.moments = [...MOMENTS_SEED];
    this.sortMoments();
    this.save();
    this.selectedMomentId = this.moments[0].id;
    this.notify('reset_defaults');
  }

  exportJSON() {
    const dataStr = JSON.stringify(this.moments, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dam-hikes-pct-journal-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed) && parsed.length > 0) {
        this.moments = parsed;
        this.sortMoments();
        this.save();
        this.selectedMomentId = this.moments[0].id;
        this.notify('data_imported');
        return { success: true, count: parsed.length };
      }
      return { success: false, error: 'Invalid JSON format: expected an array of moments.' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.theme);
    localStorage.setItem(THEME_KEY, this.theme);
    this.notify('theme_change');
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  openLightbox(photo) {
    this.lightboxPhoto = photo;
    this.notify('lightbox_open');
  }

  closeLightbox() {
    this.lightboxPhoto = null;
    this.notify('lightbox_close');
  }
}

export const store = new TrailStore();
