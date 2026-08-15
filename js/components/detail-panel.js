/**
 * DAM HIKES - 5-Type Adaptive DetailPanel Component
 * Renders tailored visual cards for:
 * 1. Statistics (data-first metrics, elevation splits, water status)
 * 2. Title + Words (literary editorial prose, pull quotes, hero photo)
 * 3. Title + Voice (interactive audio player, SVG waveform, transcript)
 * 4. Scripture Reading (sacred gold card, Sanskrit transliteration, translation, purport)
 * 5. Kirtan Streaming (devotional player, mantra chant lyrics, translation, raga mood)
 */

import { elevationAtMile, formatElevation, formatMiles } from '../data/pct-route.js';
import { store } from '../state.js';
import { audioEngine } from '../audio.js';

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
    this.audioUnsub = null;
  }

  init() {
    this.render();
    store.subscribe((s, eventType) => {
      if (['select_change', 'entry_added', 'entry_updated', 'entry_deleted', 'filter_change'].includes(eventType)) {
        this.photoIndex = 0;
        this.render();
      }
    });

    this.audioUnsub = audioEngine.subscribe(() => {
      this.updateAudioVisuals();
    });
  }

  updateAudioVisuals() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const playBtn = container.querySelector('.btn-audio-play-toggle');
    const waveProgress = container.querySelector('.waveform-progress-bar');
    const timeDisplay = container.querySelector('.audio-current-time');

    if (playBtn) {
      const isCur = audioEngine.isPlaying && audioEngine.playingId === store.selectedId;
      playBtn.innerHTML = isCur
        ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`
        : `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
      playBtn.classList.toggle('is-playing', isCur);
    }

    if (waveProgress) {
      const isCur = audioEngine.playingId === store.selectedId;
      waveProgress.style.width = isCur ? `${(audioEngine.progress * 100).toFixed(1)}%` : '0%';
    }

    if (timeDisplay && audioEngine.playingId === store.selectedId) {
      const totalSec = 160;
      const elapsed = Math.round(audioEngine.progress * totalSec);
      const m = Math.floor(elapsed / 60);
      const s = elapsed % 60;
      timeDisplay.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
    }
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

    const type = entry.type || (entry.scripture ? 'scripture' : entry.kirtan ? 'kirtan' : entry.voice ? 'voice' : entry.layoutStyle === 'fieldlog' ? 'statistics' : 'words');
    const elev = elevationAtMile(entry.mile);
    const photos = entry.photos || [];
    const one = photos.length <= 1;

    // Photos Markup
    let photoHtml = '';
    if (photos.length > 0) {
      if (one) {
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

    let cardBodyHtml = '';

    // --- 1. 📊 STATISTICS TYPE ---
    if (type === 'statistics') {
      const m = entry.metrics || {};
      const ascent = m.ascentFt || 3850;
      const descent = m.descentFt || 2150;
      const movingTime = m.movingTime || '6h 45m';

      cardBodyHtml = `
        <div class="type-card-stats-layout">
          <!-- Lead 4-Cell Conditions Grid -->
          <div class="stats-four-grid">
            <div class="stats-metric-cell">
              <span class="stat-label">Weather</span>
              <span class="stat-main-val">${m.tempF || 52}°F</span>
              <span class="stat-sub-val">${m.condition || 'Clear Sky'}</span>
            </div>
            <div class="stats-metric-cell">
              <span class="stat-label">Water Source</span>
              <span class="stat-main-val">${m.waterSource || 'Alpine Stream'}</span>
              <span class="stat-sub-val">Reliable flow</span>
            </div>
            <div class="stats-metric-cell">
              <span class="stat-label">Pack Weight</span>
              <span class="stat-main-val">${m.packWeightLbs || 26.5} lbs</span>
              <span class="stat-sub-val">11.4 lb base</span>
            </div>
            <div class="stats-metric-cell">
              <span class="stat-label">Daily Mileage</span>
              <span class="stat-main-val">${m.dayMileage || 24.5} mi</span>
              <span class="stat-sub-val">${movingTime}</span>
            </div>
          </div>

          <!-- Elevation & Trail Splits -->
          <div class="stats-splits-row">
            <div class="split-cell">
              <span class="split-label">Elevation Ascent</span>
              <span class="split-val split-up">+${ascent.toLocaleString()} ft</span>
            </div>
            <div class="split-divider"></div>
            <div class="split-cell">
              <span class="split-label">Elevation Descent</span>
              <span class="split-val split-down">-${descent.toLocaleString()} ft</span>
            </div>
          </div>

          ${this.expanded ? `
            <div class="trail-body-expanded" id="trail-body-expanded-box" style="margin-top: 10px;">
              ${m.gearNotes ? `
                <div class="fieldlog-gear-notes" style="margin-bottom: 10px;">
                  <strong>⚙️ Gear & Resupply Intelligence:</strong> ${m.gearNotes}
                </div>
              ` : ''}
              ${entry.body ? `
                <div class="trail-story-prose">
                  ${entry.body.split('\n\n').map(p => `<p>${p}</p>`).join('')}
                </div>
              ` : ''}
              <div class="trail-expanded-stats-footer">
                <div class="stats-badge-group">
                  <span class="badge badge-category badge-cat-${entry.category || 'resupply'}">${CATEGORY_NAMES[entry.category] || '🍕 Resupply'}</span>
                  <span class="badge badge-section">${SECTION_NAMES[entry.section] || 'PCT'}</span>
                </div>
                <button type="button" class="btn-card-edit-quick" id="btn-quick-edit-entry">Edit</button>
              </div>
            </div>
            <button type="button" class="card-read-more-btn" id="btn-toggle-expand">Less</button>
          ` : `
            <button type="button" class="card-read-more-btn" id="btn-toggle-expand">More details</button>
          `}
        </div>
      `;

    // --- 2. ✍️ TITLE + WORDS TYPE ---
    } else if (type === 'words') {
      const text = entry.body || entry.quote || '';

      cardBodyHtml = `
        <div class="type-card-words-layout">
          <div class="words-direct-statement">
            “${text.replace(/^["“]|["”]$/g, '')}”
          </div>

          <div class="trail-expanded-stats-footer" style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <div class="stats-badge-group">
              <span class="badge badge-category badge-cat-${entry.category || 'reflection'}">${CATEGORY_NAMES[entry.category] || '📖 Reflection'}</span>
              <span class="badge badge-section">${SECTION_NAMES[entry.section] || 'PCT'}</span>
            </div>
            <button type="button" class="btn-card-edit-quick" id="btn-quick-edit-entry">Edit</button>
          </div>
        </div>
      `;

    // --- 3. 🎙️ TITLE + VOICE TYPE ---
    } else if (type === 'voice') {
      const v = entry.voice || {};
      const duration = v.duration || '02:44';
      const isCur = audioEngine.isPlaying && audioEngine.playingId === entry.id;

      cardBodyHtml = `
        <div class="type-card-voice-layout">
          <!-- Voice Audio Player Bar -->
          <div class="voice-player-bar">
            <button type="button" class="btn-audio-play-toggle ${isCur ? 'is-playing' : ''}" id="btn-audio-toggle" aria-label="Play voice recording">
              ${isCur ? `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              ` : `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              `}
            </button>

            <!-- SVG Waveform -->
            <div class="waveform-container" id="waveform-scrubber">
              <svg class="waveform-svg" viewBox="0 0 200 36" preserveAspectRatio="none">
                <!-- Static Waveform Bars -->
                <path d="M4 18v-8M10 18v-12M16 18v-6M22 18v-14M28 18v-10M34 18v-16M40 18v-12M46 18v-6M52 18v-14M58 18v-10M64 18v-16M70 18v-12M76 18v-8M82 18v-14M88 18v-16M94 18v-10M100 18v-14M106 18v-8M112 18v-12M118 18v-16M124 18v-10M130 18v-14M136 18v-8M142 18v-12M148 18v-16M154 18v-10M160 18v-14M166 18v-8M172 18v-12M178 18v-6M184 18v-10M190 18v-4M196 18v-8" stroke="rgba(236, 231, 220, 0.28)" stroke-width="2.5" stroke-linecap="round"></path>
                <!-- Mirror Bottom Bars -->
                <path d="M4 18v8M10 18v12M16 18v6M22 18v14M28 18v10M34 18v16M40 18v12M46 18v6M52 18v14M58 18v10M64 18v16M70 18v12M76 18v8M82 18v14M88 18v16M94 18v10M100 18v14M106 18v8M112 18v12M118 18v16M124 18v10M130 18v14M136 18v8M142 18v12M148 18v16M154 18v10M160 18v14M166 18v8M172 18v12M178 18v6M184 18v10M190 18v4M196 18v8" stroke="rgba(236, 231, 220, 0.28)" stroke-width="2.5" stroke-linecap="round"></path>
              </svg>
              <!-- Live Green Progress Waveform -->
              <div class="waveform-progress-bar" style="width: ${isCur ? (audioEngine.progress * 100).toFixed(1) + '%' : '0%'};">
                <svg class="waveform-svg active-wave" viewBox="0 0 200 36" preserveAspectRatio="none">
                  <path d="M4 18v-8M10 18v-12M16 18v-6M22 18v-14M28 18v-10M34 18v-16M40 18v-12M46 18v-6M52 18v-14M58 18v-10M64 18v-16M70 18v-12M76 18v-8M82 18v-14M88 18v-16M94 18v-10M100 18v-14M106 18v-8M112 18v-12M118 18v-16M124 18v-10M130 18v-14M136 18v-8M142 18v-12M148 18v-16M154 18v-10M160 18v-14M166 18v-8M172 18v-12M178 18v-6M184 18v-10M190 18v-4M196 18v-8M4 18v8M10 18v12M16 18v6M22 18v14M28 18v10M34 18v16M40 18v12M46 18v6M52 18v14M58 18v10M64 18v16M70 18v12M76 18v8M82 18v14M88 18v16M94 18v10M100 18v14M106 18v8M112 18v12M118 18v16M124 18v10M130 18v14M136 18v8M142 18v12M148 18v16M154 18v10M160 18v14M166 18v8M172 18v12M178 18v6M184 18v10M190 18v4M196 18v8" stroke="#c5d4a8" stroke-width="2.5" stroke-linecap="round"></path>
                </svg>
              </div>
            </div>

            <div class="audio-time-stamp">
              <span class="audio-current-time">0:00</span> / ${duration}
            </div>
          </div>

          <!-- Transcript Section -->
          ${v.transcript ? `
            <div class="voice-transcript-box">
              <span class="transcript-header-label">🎙️ Voice Dispatch Transcript</span>
              <p class="transcript-prose">${v.transcript}</p>
            </div>
          ` : ''}

          <div class="trail-expanded-stats-footer" style="margin-top: 10px;">
            <div class="stats-badge-group">
              <span class="badge badge-category badge-cat-${entry.category || 'reflection'}">${CATEGORY_NAMES[entry.category] || '🎙️ Voice'}</span>
              <span class="badge badge-section">${SECTION_NAMES[entry.section] || 'PCT'}</span>
            </div>
            <button type="button" class="btn-card-edit-quick" id="btn-quick-edit-entry">Edit</button>
          </div>
        </div>
      `;

    // --- 4. 📜 SCRIPTURE READING TYPE ---
    } else if (type === 'scripture') {
      const s = entry.scripture || {};
      const sourceName = s.source ? s.source.replace(/\s*\(prabhupadabooks\.com\)/gi, '') : 'Bhagavad-gītā As It Is';

      cardBodyHtml = `
        <div class="type-card-scripture-layout">
          <!-- Scripture Reference Badge -->
          <div class="scripture-badge-row">
            <span class="scripture-citation-pill">📜 ${sourceName} ${s.citation || ''}</span>
          </div>

          <!-- Sanskrit / Original Transliteration -->
          ${s.transliteration ? `
            <blockquote class="scripture-sanskrit-verse">
              ${s.transliteration}
            </blockquote>
          ` : ''}

          <!-- Translation -->
          <div class="scripture-translation-box">
            <span class="translation-lead-word">Translation (Śrīla Prabhupāda):</span>
            <p class="scripture-translation-prose">${s.translation || ''}</p>
          </div>

          <!-- Purport (ACBSP) -->
          ${s.purport ? `
            <div class="scripture-purport-box">
              <span class="purport-header-label">Purport by Śrīla Prabhupāda (ACBSP)</span>
              <p class="purport-prose">${s.purport}</p>
            </div>
          ` : ''}

          <div class="trail-expanded-stats-footer" style="margin-top: 10px;">
            <div class="stats-badge-group">
              <span class="badge badge-category badge-cat-reflection">📖 Sacred Verse</span>
              <span class="badge badge-section">${SECTION_NAMES[entry.section] || 'PCT'}</span>
            </div>
            <button type="button" class="btn-card-edit-quick" id="btn-quick-edit-entry">Edit</button>
          </div>
        </div>
      `;

    // --- 5. 📿 KIRTAN STREAMING TYPE ---
    } else if (type === 'kirtan') {
      const k = entry.kirtan || {};
      const isCur = audioEngine.isPlaying && audioEngine.playingId === entry.id;

      cardBodyHtml = `
        <div class="type-card-kirtan-layout">
          <!-- Saffron Stream Badge -->
          <div class="kirtan-badge-row">
            <span class="kirtan-stream-pill">📿 KIRTAN STREAM · MEDITATION</span>
          </div>

          <!-- Kirtan Audio Player Bar -->
          <div class="kirtan-player-bar">
            <button type="button" class="btn-kirtan-play-toggle ${isCur ? 'is-playing' : ''}" id="btn-kirtan-toggle" aria-label="Play devotional kirtan stream">
              ${isCur ? `
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              ` : `
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              `}
            </button>

            <div class="kirtan-track-info">
              <div class="kirtan-track-name">${entry.title}</div>
              <div class="kirtan-artist-name">${k.artist || 'Daniel & Trail Sangha'}</div>
            </div>

            <div class="kirtan-live-indicator ${isCur ? 'live-pulsing' : ''}">
              <span></span><span></span><span></span>
            </div>
          </div>

          <!-- Mantra Lyrics Box -->
          ${k.mantra ? `
            <div class="kirtan-mantra-box">
              <span class="mantra-header-label">Sanskrit Mantra Chant</span>
              <pre class="mantra-lyrics-text">${k.mantra}</pre>
            </div>
          ` : ''}

          <!-- Translation & Raga Notes -->
          ${k.translation ? `
            <div class="kirtan-translation-notes">
              <p><strong>Devotional Meaning:</strong> ${k.translation}</p>
            </div>
          ` : ''}

          ${k.ragaOrMood ? `
            <div class="kirtan-raga-notes">
              <strong>🪕 Setting & Raga:</strong> ${k.ragaOrMood}
            </div>
          ` : ''}

          <div class="trail-expanded-stats-footer" style="margin-top: 10px;">
            <div class="stats-badge-group">
              <span class="badge badge-category badge-cat-reflection">📿 Devotional Stream</span>
              <span class="badge badge-section">${SECTION_NAMES[entry.section] || 'PCT'}</span>
            </div>
            <button type="button" class="btn-card-edit-quick" id="btn-quick-edit-entry">Edit</button>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <article class="trail-card-article type-${type}">
        ${photoHtml}

        <div class="trail-card-content">
          <!-- Monospace Metadata Stamp -->
          <p class="card-meta-stamp">
            ${formatFeedDate(entry.date)} · ${entry.location} · mi ${formatMiles(entry.mile)} · ${formatElevation(elev.elevFt)}
          </p>

          <!-- Heading Title -->
          <h2 class="card-heading" id="card-heading-title">
            ${entry.title}
          </h2>

          <!-- Type-Tailored Card Body -->
          ${cardBodyHtml}
        </div>
      </article>
    `;

    this.attachEvents(container, entry, photos, type);
  }

  attachEvents(container, entry, photos, type) {
    const toggle = () => {
      this.expanded = !this.expanded;
      this.render();
    };

    container.querySelector('#btn-toggle-expand')?.addEventListener('click', toggle);

    // Quick Edit Button
    container.querySelector('#btn-quick-edit-entry')?.addEventListener('click', (e) => {
      e.stopPropagation();
      store.setSheet('compose', entry.id);
    });

    // Audio Play Toggle (Voice)
    container.querySelector('#btn-audio-toggle')?.addEventListener('click', (e) => {
      e.stopPropagation();
      audioEngine.toggle('voice', entry.id, 160);
      this.render();
    });

    // Audio Play Toggle (Kirtan)
    container.querySelector('#btn-kirtan-toggle')?.addEventListener('click', (e) => {
      e.stopPropagation();
      audioEngine.toggle('kirtan', entry.id, 300);
      this.render();
    });

    // Single Photo Lightbox
    container.querySelector('#single-photo-btn')?.addEventListener('click', () => {
      if (photos[0]) {
        store.openLightbox(photos[0].src, photos[0].alt || entry.title);
      }
    });

    // Carousel Scroll
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
