/**
 * DAM HIKES - Isolated component-gallery harness.
 * The page shell is gallery-only; rendered samples come from the live app classes.
 */

import { audioEngine } from './audio.js';
import { DetailPanel } from './components/detail-panel.js';
import { ElevationProfile } from './components/elevation-profile.js';
import { MOMENTS_SEED } from './data/moments-seed.js';
import { store } from './state.js';

const BASELINE_ENTRY_ID = 'timberline-waffles';

function withSelectedEntry(entryId, callback) {
  const previousId = store.selectedId;
  store.selectedId = entryId;

  try {
    return callback();
  } finally {
    store.selectedId = previousId;
  }
}

class GalleryDetailPanel extends DetailPanel {
  constructor(containerId, entryId) {
    super(containerId);
    this.entryId = entryId;
  }

  init() {
    this.render();
    this.audioUnsub = audioEngine.subscribe(() => this.updateAudioVisuals());
  }

  render() {
    withSelectedEntry(this.entryId, () => super.render());
    this.namespaceRenderedIds();
  }

  updateAudioVisuals() {
    withSelectedEntry(this.entryId, () => super.updateAudioVisuals());
  }

  namespaceRenderedIds() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.querySelectorAll('[id]').forEach((element) => {
      if (!element.id.startsWith(this.containerId + '-')) {
        element.id = this.containerId + '-' + element.id;
      }
    });
  }
}

function prepareGalleryStore() {
  store.entries = MOMENTS_SEED.map((entry) => ({
    ...entry,
    photos: entry.photos?.map((photo) => ({ ...photo })),
    metrics: entry.metrics ? { ...entry.metrics } : undefined,
    voice: entry.voice ? { ...entry.voice } : undefined,
    scripture: entry.scripture ? { ...entry.scripture } : undefined,
    kirtan: entry.kirtan ? { ...entry.kirtan } : undefined,
  }));
  store.selectedId = BASELINE_ENTRY_ID;
  store.frame = 'trail';
  store.sheet = null;
  store.editingId = null;
  store.lightbox = null;
  store.scrubMile = null;
  store.filterSection = 'all';
  store.filterCategory = 'all';
  store.searchQuery = '';
}

function initLiveComponentSamples() {
  document.querySelectorAll('[data-entry-id]').forEach((container) => {
    const entryId = container.dataset.entryId;
    if (!entryId) return;

    const panel = new GalleryDetailPanel(container.id, entryId);
    panel.init();
  });

  const elevation = new ElevationProfile('gallery-elevation-profile');
  elevation.init();
}

function initLightbox() {
  const lightbox = document.getElementById('photo-lightbox');
  const image = document.getElementById('lightbox-img');
  const closeButton = document.getElementById('lightbox-close-btn');
  if (!lightbox || !image || !closeButton) return;

  let returnFocus = null;

  function syncLightbox() {
    if (store.lightbox) {
      returnFocus = document.activeElement;
      image.src = store.lightbox.src;
      image.alt = store.lightbox.alt;
      lightbox.classList.add('open');
      closeButton.focus();
      return;
    }

    lightbox.classList.remove('open');
    image.removeAttribute('src');
    image.alt = '';
    if (returnFocus instanceof HTMLElement) returnFocus.focus();
    returnFocus = null;
  }

  store.subscribe((state, eventType) => {
    if (eventType === 'lightbox_change') syncLightbox();
  });

  closeButton.addEventListener('click', () => store.closeLightbox());
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) store.closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && store.lightbox) store.closeLightbox();
  });
}

function formatClock(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return minutes + ':' + String(remainder).padStart(2, '0');
}

function audioIcon(isPlaying, size) {
  if (isPlaying) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
  }

  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
}

function initStandaloneAudioSamples() {
  const samples = [...document.querySelectorAll('[data-gallery-audio]')];

  function update() {
    samples.forEach((sample) => {
      const id = sample.dataset.audioId;
      const type = sample.dataset.galleryAudio;
      const duration = Number(sample.dataset.duration || 180);
      const isPlaying = audioEngine.isPlaying && audioEngine.playingId === id;
      const progress = audioEngine.playingId === id ? audioEngine.progress : 0;
      const button = sample.querySelector('button');
      const time = sample.querySelector('.audio-current-time');
      const wave = sample.querySelector('.waveform-progress-bar');
      const live = sample.querySelector('.kirtan-live-indicator');

      if (button) {
        button.innerHTML = audioIcon(isPlaying, type === 'kirtan' ? 22 : 20);
        button.classList.toggle('is-playing', isPlaying);
        button.setAttribute('aria-label', isPlaying
          ? (type === 'kirtan' ? 'Pause devotional kirtan stream' : 'Pause voice recording')
          : (type === 'kirtan' ? 'Play devotional kirtan stream' : 'Play voice recording'));
      }

      if (wave) wave.style.width = (progress * 100).toFixed(1) + '%';
      if (time) time.textContent = formatClock(progress * duration);
      if (live) live.classList.toggle('live-pulsing', isPlaying);
    });
  }

  samples.forEach((sample) => {
    const button = sample.querySelector('button');
    const id = sample.dataset.audioId;
    const type = sample.dataset.galleryAudio;
    const duration = Number(sample.dataset.duration || 180);

    button?.addEventListener('click', () => {
      audioEngine.toggle(type, id, duration);
      update();
    });
  });

  audioEngine.subscribe(update);
  update();
}

function initMapControlSample() {
  const status = document.getElementById('gallery-map-status');
  const controls = [...document.querySelectorAll('[data-map-action]')];
  if (!status || controls.length === 0) return;

  let view = 'trail';
  let zoom = 6;

  function update() {
    status.textContent = (view === 'here' ? 'Current location centered' : 'Trail framed') + ' · zoom ' + zoom;
  }

  controls.forEach((control) => {
    control.addEventListener('click', () => {
      const action = control.dataset.mapAction;
      if (action === 'here' || action === 'trail') view = action;
      if (action === 'zoom-in') zoom = Math.min(18, zoom + 1);
      if (action === 'zoom-out') zoom = Math.max(2, zoom - 1);
      update();
    });
  });
}

function initGallery() {
  prepareGalleryStore();
  initLightbox();
  initLiveComponentSamples();
  initStandaloneAudioSamples();
  initMapControlSample();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGallery, { once: true });
} else {
  initGallery();
}
