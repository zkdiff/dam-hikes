/**
 * DAM HIKES - Reactive State Store with Filtering, Search & Persistence
 */

import { MOMENTS_SEED } from './data/moments-seed.js';
import { START_MILE, START_NAME, positionAtMile } from './data/pct-route.js';

const STORAGE_KEY = 'dam_hikes_entries_v3';

class TrailStore {
  constructor() {
    this.entries = [];
    this.selectedId = null;
    this.frame = 'entry'; // 'here' | 'trail' | 'entry'
    this.sheet = null;    // null | 'about' | 'compose' | 'timeline'
    this.editingId = null;
    this.lightbox = null;
    this.scrubMile = null;
    
    // Filters
    this.filterSection = 'all';
    this.filterCategory = 'all';
    this.searchQuery = '';

    this.listeners = new Set();
  }

  init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.entries = JSON.parse(stored);
      } else {
        this.entries = [...MOMENTS_SEED];
        this.save();
      }
    } catch (e) {
      console.warn('Failed to load from localStorage, using seed data', e);
      this.entries = [...MOMENTS_SEED];
    }

    const ordered = this.getOrderedEntries();
    if (ordered.length > 0) {
      this.selectedId = ordered[0].id;
    }

    this.notify();
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.entries));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
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

  /** North to south along the PCT, then older to newer at the same mile. */
  getOrderedEntries() {
    return [...this.entries].sort((a, b) => {
      if (a.mile !== b.mile) return b.mile - a.mile;
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.id.localeCompare(b.id);
    });
  }

  getFilteredEntries() {
    return this.getOrderedEntries().filter(e => {
      if (this.filterSection !== 'all' && e.section !== this.filterSection) {
        return false;
      }
      if (this.filterCategory !== 'all' && e.category !== this.filterCategory) {
        return false;
      }
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchesTitle = (e.title || '').toLowerCase().includes(q);
        const matchesBody = (e.body || '').toLowerCase().includes(q);
        const matchesLoc = (e.location || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesBody && !matchesLoc) return false;
      }
      return true;
    });
  }

  getSelectedEntry() {
    const list = this.getFilteredEntries();
    return list.find(e => e.id === this.selectedId) || list[0] || this.entries[0] || null;
  }

  getCurrentPosition() {
    const selected = this.getSelectedEntry();
    if (selected) {
      return {
        mile: selected.mile,
        location: selected.location
      };
    }
    return {
      mile: START_MILE,
      location: START_NAME
    };
  }

  select(id, frame = 'entry') {
    if (this.selectedId !== id || this.frame !== frame) {
      this.selectedId = id;
      this.frame = frame;
      this.notify('select_change');
    }
  }

  step(direction) {
    const list = this.getFilteredEntries();
    if (list.length === 0) return;
    const currentIndex = list.findIndex(e => e.id === this.selectedId);
    const nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < list.length) {
      this.select(list[nextIndex].id, 'entry');
    }
  }

  setFrame(frame) {
    this.frame = frame;
    if (frame === 'here') {
      const list = this.getFilteredEntries();
      if (list.length > 0) {
        this.selectedId = list[list.length - 1].id;
      }
    }
    this.notify('frame_change');
  }

  setSheet(sheet, editingId = null) {
    this.sheet = sheet;
    this.editingId = editingId;
    this.notify('sheet_change');
  }

  setFilters({ section, category, query }) {
    if (section !== undefined) this.filterSection = section;
    if (category !== undefined) this.filterCategory = category;
    if (query !== undefined) this.searchQuery = query;
    this.notify('filter_change');
  }

  setScrubMile(mile) {
    this.scrubMile = mile;
    this.notify('scrub_change');
  }

  openLightbox(src, alt = 'Trail photography') {
    this.lightbox = { src, alt };
    this.notify('lightbox_change');
  }

  closeLightbox() {
    this.lightbox = null;
    this.notify('lightbox_change');
  }

  addEntry(data) {
    const id = 'entry-' + Date.now();
    const section = this.computeSectionForMile(data.mile);

    const newEntry = {
      id,
      date: data.date || new Date().toISOString().split('T')[0],
      dayNumber: Number(data.dayNumber) || 1,
      title: data.title || 'Untitled Update',
      body: data.body || '',
      location: data.location || 'Pacific Crest Trail',
      mile: Number(data.mile) || 2150.0,
      soboMile: Math.max(0, 2150.0 - Number(data.mile)),
      section,
      elevationFt: Number(data.elevationFt) || 3000,
      category: data.category || 'reflection',
      layoutStyle: data.layoutStyle || 'story',
      quote: data.quote || '',
      photos: data.photos || [],
      metrics: data.metrics || {}
    };

    this.entries.push(newEntry);
    this.save();
    this.selectedId = newEntry.id;
    this.frame = 'entry';
    this.sheet = null;
    this.editingId = null;
    this.notify('entry_added');
  }

  updateEntry(id, data) {
    const index = this.entries.findIndex(e => e.id === id);
    if (index === -1) return;

    const existing = this.entries[index];
    const mile = data.mile !== undefined ? Number(data.mile) : existing.mile;
    const section = this.computeSectionForMile(mile);

    this.entries[index] = {
      ...existing,
      ...data,
      mile,
      soboMile: Math.max(0, 2150.0 - mile),
      section
    };

    this.save();
    this.selectedId = id;
    this.frame = 'entry';
    this.sheet = null;
    this.editingId = null;
    this.notify('entry_updated');
  }

  deleteEntry(id) {
    this.entries = this.entries.filter(e => e.id !== id);
    this.save();
    const ordered = this.getOrderedEntries();
    if (this.selectedId === id && ordered.length > 0) {
      this.selectedId = ordered[0].id;
    }
    this.sheet = null;
    this.editingId = null;
    this.notify('entry_deleted');
  }

  computeSectionForMile(mile) {
    if (mile > 1692) return 'oregon';
    if (mile > 1157) return 'norcal';
    if (mile > 652) return 'sierra';
    return 'socal';
  }

  exportJSON() {
    const dataStr = JSON.stringify(this.entries, null, 2);
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
        this.entries = parsed;
        this.save();
        this.selectedId = this.entries[0].id;
        this.notify('entry_added');
        return { success: true, count: parsed.length };
      }
      return { success: false, error: 'Expected an array of entries' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  resetToDefaults() {
    this.entries = [...MOMENTS_SEED];
    this.save();
    this.selectedId = this.entries[0].id;
    this.notify('entry_added');
  }
}

export const store = new TrailStore();
