/**
 * DAM HIKES - Reactive State Store & Persistence
 */

import { MOMENTS_SEED } from './data/moments-seed.js';
import { START_MILE, START_NAME, milesWalked, daysOnTrail, hasStarted, positionAtMile } from './data/pct-route.js';

const STORAGE_KEY = 'dam_hikes_entries_v2';

class TrailStore {
  constructor() {
    this.entries = [];
    this.selectedId = null;
    this.frame = 'entry'; // 'here' | 'trail' | 'entry'
    this.sheet = null;    // null | 'about' | 'compose'
    this.lightbox = null; // null | { src: string, alt: string }
    this.scrubMile = null;
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
      this.selectedId = ordered[ordered.length - 1].id;
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

  getSelectedEntry() {
    const ordered = this.getOrderedEntries();
    return ordered.find(e => e.id === this.selectedId) || ordered[ordered.length - 1] || null;
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
    const ordered = this.getOrderedEntries();
    if (ordered.length === 0) return;
    const currentIndex = ordered.findIndex(e => e.id === this.selectedId);
    const nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < ordered.length) {
      this.select(ordered[nextIndex].id, 'entry');
    }
  }

  setFrame(frame) {
    this.frame = frame;
    if (frame === 'here') {
      const ordered = this.getOrderedEntries();
      if (ordered.length > 0) {
        this.selectedId = ordered[ordered.length - 1].id;
      }
    }
    this.notify('frame_change');
  }

  setSheet(sheet) {
    this.sheet = sheet;
    this.notify('sheet_change');
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
    const newEntry = {
      id,
      date: data.date || new Date().toISOString().split('T')[0],
      title: data.title || 'Untitled Update',
      body: data.body || '',
      location: data.location || 'Pacific Crest Trail',
      mile: Number(data.mile) || 2150.0,
      photos: data.photos || []
    };

    this.entries.push(newEntry);
    this.save();
    this.selectedId = newEntry.id;
    this.frame = 'entry';
    this.sheet = null;
    this.notify('entry_added');
  }
}

export const store = new TrailStore();
