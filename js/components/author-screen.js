/**
 * DAM HIKES - 2-Stage Authoring Screen for 5 Update Types:
 * 1. Statistics
 * 2. Title + Words
 * 3. Title + Voice
 * 4. Scripture Reading
 * 5. Kirtan Streaming
 */

import { PCT_WAYPOINTS } from '../data/pct-route.js';
import { store } from '../state.js';

async function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const max = 1400;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.78));
    };
    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = url;
  });
}

export class AuthorScreen {
  constructor(containerId) {
    this.containerId = containerId;
    this.busy = false;
    this.step = 'choose_type'; // 'choose_type' | 'form'
    this.currentType = 'words'; // 'statistics' | 'words' | 'voice' | 'scripture' | 'kirtan'
    this.attachedPhotos = [];
    this.formData = {};
  }

  init() {
    this.render();
    store.subscribe((s, eventType) => {
      if (eventType === 'sheet_change' && store.sheet === 'compose') {
        this.setupForm(store.editingId);
        this.render();
      }
    });
  }

  setupForm(editingId = null) {
    if (editingId) {
      const existing = store.entries.find(e => e.id === editingId);
      if (existing) {
        this.step = 'form';
        this.currentType = existing.type || (existing.scripture ? 'scripture' : existing.kirtan ? 'kirtan' : existing.voice ? 'voice' : existing.layoutStyle === 'fieldlog' ? 'statistics' : 'words');
        this.attachedPhotos = [...(existing.photos || [])];
        this.formData = {
          date: existing.date,
          mile: existing.mile,
          location: existing.location,
          title: existing.title,
          quote: existing.quote || '',
          body: existing.body || '',
          category: existing.category || 'reflection',
          metrics: { ...(existing.metrics || {}) },
          voice: { ...(existing.voice || {}) },
          scripture: { ...(existing.scripture || {}) },
          kirtan: { ...(existing.kirtan || {}) }
        };
        return;
      }
    }

    this.step = 'choose_type';
    this.currentType = 'words';
    this.attachedPhotos = [];
    this.formData = {
      date: new Date().toISOString().split('T')[0],
      mile: 2150,
      location: '',
      title: '',
      quote: '',
      body: '',
      category: 'reflection',
      metrics: {
        tempF: 62,
        condition: 'Sunny',
        waterSource: 'Stream',
        packWeightLbs: 26.5,
        dayMileage: 22.0,
        ascentFt: 3400,
        descentFt: 2100,
        movingTime: '6h 30m',
        gearNotes: ''
      },
      voice: {
        audioSrc: 'ambient-voice-recording',
        duration: '02:30',
        transcript: ''
      },
      scripture: {
        source: 'Bhagavad Gita',
        citation: 'Chapter 6, Verse 25',
        transliteration: '',
        translation: '',
        purport: ''
      },
      kirtan: {
        streamUrl: 'kirtan-live-stream',
        artist: 'DAM & Trail Sangha',
        mantra: 'Hare Krishna Hare Krishna Krishna Krishna Hare Hare\nHare Rama Hare Rama Rama Rama Hare Hare',
        translation: '',
        ragaOrMood: 'Evening Meditation'
      }
    };
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    if (this.step === 'choose_type') {
      this.renderTypeSelectionScreen(container);
    } else {
      this.renderAuthoringFormScreen(container);
    }
  }

  renderTypeSelectionScreen(container) {
    container.innerHTML = `
      <div class="compose-type-selection-screen" style="padding-bottom: 24px;">
        <div class="type-selection-header">
          <h3 class="type-selection-title">Choose Update Type</h3>
          <p class="type-selection-subtitle">What kind of moment are you recording on the trail today?</p>
        </div>

        <div class="type-cards-stack">
          <!-- 1. Statistics -->
          <button type="button" class="btn-type-big-card" data-type="statistics">
            <div class="type-card-top">
              <span class="type-big-icon">📊</span>
              <div class="type-card-headings">
                <div class="type-main-title">Statistics</div>
                <div class="type-sub-title">Trail intelligence, splits, elevation & water</div>
              </div>
            </div>
            <p class="type-card-description">
              Data-first log: 4-cell conditions grid (temperature, water flow, pack weight, mileage), ascent/descent elevation splits, and resupply notes.
            </p>
            <div class="type-card-tags">
              <span class="type-tag">Conditions Grid</span>
              <span class="type-tag">Elevation Splits</span>
              <span class="type-tag">Water Status</span>
            </div>
          </button>

          <!-- 2. Title + Words -->
          <button type="button" class="btn-type-big-card" data-type="words">
            <div class="type-card-top">
              <span class="type-big-icon">✍️</span>
              <div class="type-card-headings">
                <div class="type-main-title">Title + Words</div>
                <div class="type-sub-title">Literary essay, pull quote & reflection</div>
              </div>
            </div>
            <p class="type-card-description">
              Pure literary journal entry: elegant display serif typography, epigraph pull quote, multi-paragraph markdown narrative, and single hero photograph.
            </p>
            <div class="type-card-tags">
              <span class="type-tag">Hero Photo</span>
              <span class="type-tag">Pull Quotes</span>
              <span class="type-tag">Editorial Prose</span>
            </div>
          </button>

          <!-- 3. Title + Voice -->
          <button type="button" class="btn-type-big-card" data-type="voice">
            <div class="type-card-top">
              <span class="type-big-icon">🎙️</span>
              <div class="type-card-headings">
                <div class="type-main-title">Title + Voice</div>
                <div class="type-sub-title">Audio field recording & spoken transcript</div>
              </div>
            </div>
            <p class="type-card-description">
              Spoken wilderness dispatches: interactive SVG audio waveform player, duration counter, and transcribed spoken word field notes.
            </p>
            <div class="type-card-tags">
              <span class="type-tag">SVG Waveform Player</span>
              <span class="type-tag">Voice Memo</span>
              <span class="type-tag">Transcript</span>
            </div>
          </button>

          <!-- 4. Scripture Reading -->
          <button type="button" class="btn-type-big-card" data-type="scripture">
            <div class="type-card-top">
              <span class="type-big-icon">📜</span>
              <div class="type-card-headings">
                <div class="type-main-title">Scripture Reading</div>
                <div class="type-sub-title">Sacred verse, transliteration & realization</div>
              </div>
            </div>
            <p class="type-card-description">
              Sacred contemplative texts: citation reference, Sanskrit/source transliteration, highlighted English translation, and trail-side realization purport.
            </p>
            <div class="type-card-tags">
              <span class="type-tag">Sanskrit Transliteration</span>
              <span class="type-tag">Translation</span>
              <span class="type-tag">Trail Purport</span>
            </div>
          </button>

          <!-- 5. Kirtan Streaming -->
          <button type="button" class="btn-type-big-card" data-type="kirtan">
            <div class="type-card-top">
              <span class="type-big-icon">📿</span>
              <div class="type-card-headings">
                <div class="type-main-title">Kirtan Streaming</div>
                <div class="type-sub-title">Devotional chant stream, mantra lyrics & raga</div>
              </div>
            </div>
            <p class="type-card-description">
              Devotional music & meditative soundscapes: audio stream player, multi-line Sanskrit mantra chant lyrics, meaning translation, and raga mood notes.
            </p>
            <div class="type-card-tags">
              <span class="type-tag">Stream Player</span>
              <span class="type-tag">Mantra Lyrics</span>
              <span class="type-tag">Raga Notes</span>
            </div>
          </button>
        </div>
      </div>
    `;

    container.querySelectorAll('.btn-type-big-card').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentType = btn.dataset.type;
        this.step = 'form';
        this.render();
      });
    });
  }

  renderAuthoringFormScreen(container) {
    const editingId = store.editingId;
    const existing = editingId ? store.entries.find(e => e.id === editingId) : null;
    const isEdit = !!existing;

    const date = this.formData.date || new Date().toISOString().split('T')[0];
    const mile = this.formData.mile !== undefined ? this.formData.mile : 2150;
    const location = this.formData.location || '';
    const title = this.formData.title || '';
    const quote = this.formData.quote || '';
    const body = this.formData.body || '';
    const category = this.formData.category || 'reflection';
    const m = this.formData.metrics || {};
    const v = this.formData.voice || {};
    const s = this.formData.scripture || {};
    const k = this.formData.kirtan || {};

    let formTypeHtml = '';

    // --- FORM 1: 📊 STATISTICS ---
    if (this.currentType === 'statistics') {
      formTypeHtml = `
        <div class="form-field">
          <label for="compose-title">Statistics Title / Log Name</label>
          <input id="compose-title" required placeholder="e.g. Forester Pass Zenith: Highest Point on PCT" maxlength="80" value="${title}" />
        </div>

        <div style="background: rgba(18, 20, 16, 0.7); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border);">
          <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-trail); font-weight: 700; margin-bottom: 8px;">📊 4-Cell Conditions Grid</p>
          <div class="form-grid-2">
            <div class="form-field">
              <label for="compose-temp">Temp (°F)</label>
              <input id="compose-temp" type="number" value="${m.tempF || 52}" required />
            </div>
            <div class="form-field">
              <label for="compose-condition">Sky / Wind Condition</label>
              <input id="compose-condition" placeholder="e.g. Freezing Alpine Gale" value="${m.condition || ''}" required />
            </div>
          </div>
          <div class="form-grid-2" style="margin-top: 8px;">
            <div class="form-field">
              <label for="compose-water">Water Source Flow</label>
              <input id="compose-water" placeholder="e.g. Bubbling Spring" value="${m.waterSource || ''}" required />
            </div>
            <div class="form-field">
              <label for="compose-pack">Pack Weight (lbs)</label>
              <input id="compose-pack" type="number" step="0.5" value="${m.packWeightLbs || 26.5}" required />
            </div>
          </div>
          <div class="form-grid-2" style="margin-top: 8px;">
            <div class="form-field">
              <label for="compose-day-mileage">Daily Mileage (mi)</label>
              <input id="compose-day-mileage" type="number" step="0.1" value="${m.dayMileage || 24.5}" required />
            </div>
            <div class="form-field">
              <label for="compose-moving-time">Moving Time</label>
              <input id="compose-moving-time" placeholder="e.g. 7h 42m" value="${m.movingTime || '7h 15m'}" />
            </div>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-field">
            <label for="compose-ascent">Total Ascent (+ft)</label>
            <input id="compose-ascent" type="number" value="${m.ascentFt || 3850}" />
          </div>
          <div class="form-field">
            <label for="compose-descent">Total Descent (-ft)</label>
            <input id="compose-descent" type="number" value="${m.descentFt || 2150}" />
          </div>
        </div>

        <div class="form-field">
          <label for="compose-gear-notes"><strong>⚙️ Gear & Resupply Notes</strong></label>
          <input id="compose-gear-notes" placeholder="e.g. Microspikes used on north chute. 5 days food carry." value="${m.gearNotes || ''}" />
        </div>

        <div class="form-field">
          <label for="compose-body">Field Observations & Conditions</label>
          <textarea id="compose-body" rows="4" placeholder="Log trail surface, snowpack, terrain notes...">${body}</textarea>
        </div>
      `;

    // --- FORM 2: ✍️ TITLE + WORDS ---
    } else if (this.currentType === 'words') {
      formTypeHtml = `
        <div class="form-field">
          <label for="compose-title">Story / Reflection Title</label>
          <input id="compose-title" required placeholder="e.g. Looking South Through the Green Hallway" maxlength="80" value="${title}" />
        </div>

        <div class="form-field">
          <label for="compose-body"><strong>Direct Observation / Words</strong></label>
          <textarea id="compose-body" rows="3" required placeholder="e.g. Hood is the first mountain I have to walk around. After that the trail is a long green cathedral." style="font-family: var(--font-display); font-size: 15.5px; font-style: italic;">${body || quote}</textarea>
          <small style="color: var(--color-muted); font-size: 11.5px; margin-top: 4px; display: block;">Keep entries direct, evocative, and punchy (1–3 sentences).</small>
        </div>

        <div class="form-field">
          <label>Curated Hero Photograph</label>
          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 6px;">
            <button type="button" class="btn-preset-thumb" data-src="photos/bridge-gods.jpg">Bridge</button>
            <button type="button" class="btn-preset-thumb" data-src="photos/mt-hood.jpg">Mt Hood</button>
            <button type="button" class="btn-preset-thumb" data-src="photos/canopy.jpg">Forest</button>
            <button type="button" class="btn-preset-thumb" data-src="photos/river-dusk.jpg">River</button>
            <button type="button" class="btn-preset-thumb" data-src="photos/hiker-back.jpg">Hiker</button>
          </div>
          <input id="compose-photos" name="photos" type="file" accept="image/*" />
          <div id="compose-photo-preview-list" style="display: flex; gap: 6px; margin-top: 6px;">
            ${this.renderPhotoPreviews()}
          </div>
        </div>
      `;

    // --- FORM 3: 🎙️ TITLE + VOICE ---
    } else if (this.currentType === 'voice') {
      formTypeHtml = `
        <div class="form-field">
          <label for="compose-title">Voice Dispatch Title</label>
          <input id="compose-title" required placeholder="e.g. Wind Over the Caldera Rim at Dusk" maxlength="80" value="${title}" />
        </div>

        <div class="form-grid-2">
          <div class="form-field">
            <label for="compose-voice-duration">Recording Duration</label>
            <input id="compose-voice-duration" placeholder="e.g. 02:44" value="${v.duration || '02:30'}" required />
          </div>
          <div class="form-field">
            <label for="compose-voice-src">Audio Source / Preset</label>
            <input id="compose-voice-src" placeholder="ambient-ridge-wind" value="${v.audioSrc || 'ambient-voice-recording'}" />
          </div>
        </div>

        <div class="form-field">
          <label for="compose-voice-transcript"><strong>🎙️ Spoken Word Transcript & Notes</strong></label>
          <textarea id="compose-voice-transcript" rows="4" required placeholder="Transcribe your spoken thoughts, trail sounds, ambient conditions...">${v.transcript || body}</textarea>
        </div>

        <div class="form-field">
          <label>Ambient Scene Photo</label>
          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 6px;">
            <button type="button" class="btn-preset-thumb" data-src="photos/gorge-trail.jpg">Gorge</button>
            <button type="button" class="btn-preset-thumb" data-src="photos/canopy.jpg">Canopy</button>
            <button type="button" class="btn-preset-thumb" data-src="photos/river-dusk.jpg">River</button>
          </div>
          <input id="compose-photos" name="photos" type="file" accept="image/*" />
          <div id="compose-photo-preview-list" style="display: flex; gap: 6px; margin-top: 6px;">
            ${this.renderPhotoPreviews()}
          </div>
        </div>
      `;

    // --- FORM 4: 📜 SCRIPTURE READING ---
    } else if (this.currentType === 'scripture') {
      formTypeHtml = `
        <div class="form-field">
          <label for="compose-title">Contemplation Title</label>
          <input id="compose-title" required placeholder="e.g. Step by Step with Fixed Conviction" maxlength="80" value="${title}" />
        </div>

        <div class="form-grid-2">
          <div class="form-field">
            <label for="compose-scripture-source">Scripture Source</label>
            <select id="compose-scripture-source" style="padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); background: var(--color-bg); color: var(--color-fg); font-size: 13px;">
              <option value="Bhagavad-gītā As It Is" ${s.source?.includes('Bhagavad') ? 'selected' : ''}>Bhagavad-gītā As It Is</option>
              <option value="Śrī Īśopaniṣad" ${s.source?.includes('Īśopaniṣad') ? 'selected' : ''}>Śrī Īśopaniṣad</option>
              <option value="Śrīmad-Bhāgavatam" ${s.source?.includes('Bhāgavatam') ? 'selected' : ''}>Śrīmad-Bhāgavatam</option>
              <option value="Śrī Caitanya-caritāmṛta" ${s.source?.includes('Caitanya') ? 'selected' : ''}>Śrī Caitanya-caritāmṛta</option>
            </select>
          </div>
          <div class="form-field">
            <label for="compose-scripture-citation">Chapter & Verse</label>
            <input id="compose-scripture-citation" placeholder="e.g. Chapter 6, Verse 25" value="${s.citation || 'Chapter 6, Verse 25'}" required />
          </div>
        </div>

        <div class="form-field">
          <label for="compose-scripture-transliteration">Original Verse / Sanskrit Transliteration</label>
          <textarea id="compose-scripture-transliteration" rows="2" placeholder="e.g. śanaiḥ śanair uparamed buddhyā dhṛti-gṛhītayā..." style="font-family: var(--font-display); font-style: italic;">${s.transliteration || ''}</textarea>
        </div>

        <div class="form-field">
          <label for="compose-scripture-translation"><strong>English Translation (Śrīla Prabhupāda)</strong></label>
          <textarea id="compose-scripture-translation" rows="3" required placeholder="e.g. Gradually, step by step, one should become situated in trance...">${s.translation || ''}</textarea>
        </div>

        <div class="form-field">
          <label for="compose-scripture-purport"><strong>Purport by Śrīla Prabhupāda (ACBSP)</strong></label>
          <textarea id="compose-scripture-purport" rows="4" required placeholder="Authentic book purport by Śrīla Prabhupāda...">${s.purport || ''}</textarea>
        </div>
      `;

    // --- FORM 5: 📿 KIRTAN STREAMING ---
    } else if (this.currentType === 'kirtan') {
      formTypeHtml = `
        <div class="form-field">
          <label for="compose-title">Kirtan Stream Title</label>
          <input id="compose-title" required placeholder="e.g. Radhe Govinda & Campfire Japa" maxlength="80" value="${title}" />
        </div>

        <div class="form-grid-2">
          <div class="form-field">
            <label for="compose-kirtan-artist">Artist / Chanter</label>
            <input id="compose-kirtan-artist" placeholder="e.g. DAM & Trail Sangha" value="${k.artist || 'DAM & Trail Sangha'}" />
          </div>
          <div class="form-field">
            <label for="compose-kirtan-stream">Stream Audio / Video URL</label>
            <input id="compose-kirtan-stream" placeholder="kirtan-live-stream" value="${k.streamUrl || 'kirtan-stream-url'}" />
          </div>
        </div>

        <div class="form-field">
          <label for="compose-kirtan-mantra"><strong>📿 Sanskrit Mantra Chant Lyrics</strong></label>
          <textarea id="compose-kirtan-mantra" rows="3" required placeholder="Hare Krishna Hare Krishna Krishna Krishna Hare Hare\nHare Rama Hare Rama Rama Rama Hare Hare" style="font-family: var(--font-mono); font-size: 13px;">${k.mantra || ''}</textarea>
        </div>

        <div class="form-field">
          <label for="compose-kirtan-translation">Devotional Meaning / Translation</label>
          <textarea id="compose-kirtan-translation" rows="2" placeholder="O Lord, please engage me in Your transcendental service...">${k.translation || ''}</textarea>
        </div>

        <div class="form-field">
          <label for="compose-kirtan-raga">Setting, Raga & Meditation Mood</label>
          <input id="compose-kirtan-raga" placeholder="e.g. Bhairavi Evening Meditation · Acoustic drone by running stream" value="${k.ragaOrMood || ''}" />
        </div>
      `;
    }

    const typeBadges = {
      statistics: '📊 Statistics Log',
      words: '✍️ Title + Words',
      voice: '🎙️ Title + Voice',
      scripture: '📜 Scripture Reading',
      kirtan: '📿 Kirtan Streaming'
    };

    container.innerHTML = `
      <form id="compose-trail-form" class="compose-form-stack" style="padding-bottom: 24px;">
        
        <!-- Top Switcher Bar -->
        <div class="compose-header-bar">
          <button type="button" id="btn-back-to-type-choice" class="btn-back-type" title="Choose a different update type">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            <span>Change Type</span>
          </button>
          <div class="compose-current-badge">
            ${typeBadges[this.currentType] || '✍️ Update'}
          </div>
        </div>

        <!-- Landmark & Date Selectors -->
        <div class="form-field">
          <label for="compose-landmark-preset">Jump to Milestone / Landmark</label>
          <select id="compose-landmark-preset" style="padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); background: var(--color-bg); color: var(--color-fg); font-size: 13px;">
            <option value="">-- Choose waypoint or enter mile manually --</option>
            ${PCT_WAYPOINTS.map(wp => `
              <option value="${wp.mile}" data-name="${wp.name}" ${Math.abs(mile - wp.mile) < 0.5 ? 'selected' : ''}>
                Mile ${wp.mile}: ${wp.name} (${wp.state})
              </option>
            `).join('')}
          </select>
        </div>

        <div class="form-grid-2">
          <div class="form-field">
            <label for="compose-date">Date</label>
            <input id="compose-date" name="date" type="date" required value="${date}" />
          </div>
          <div class="form-field">
            <label for="compose-mile">PCT Mile (NOBO Marker)</label>
            <input id="compose-mile" name="mile" type="number" min="0" max="2650" step="0.1" required value="${mile}" />
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-field">
            <label for="compose-location">Location / Landmark Name</label>
            <input id="compose-location" name="location" required placeholder="e.g. Forester Pass Summit, CA" maxlength="80" value="${location}" />
          </div>
          <div class="form-field">
            <label for="compose-category">Category Badge</label>
            <select id="compose-category">
              <option value="campsite" ${category === 'campsite' ? 'selected' : ''}>⛺ Campsite</option>
              <option value="milestone" ${category === 'milestone' ? 'selected' : ''}>🏔️ Milestone / Pass</option>
              <option value="resupply" ${category === 'resupply' ? 'selected' : ''}>🍕 Resupply / Town</option>
              <option value="wildlife" ${category === 'wildlife' ? 'selected' : ''}>🐻 Wildlife</option>
              <option value="hardship" ${category === 'hardship' ? 'selected' : ''}>⚡ Condition / Hazard</option>
              <option value="reflection" ${category === 'reflection' ? 'selected' : ''}>📖 Reflection</option>
            </select>
          </div>
        </div>

        <!-- Exclusively Keyed Form Inputs -->
        ${formTypeHtml}

        <!-- Submit & Delete Actions -->
        <div style="display: flex; gap: 8px; margin-top: 14px;">
          ${isEdit ? `
            <button type="button" id="btn-delete-entry" style="padding: 10px 14px; border-radius: var(--radius-sm); background: #EF4444; color: #FFFFFF; font-weight: 600; font-size: 13px;">
              Delete
            </button>
          ` : ''}
          <button type="submit" id="btn-submit-update" class="btn-compose-submit" style="flex: 1;">
            ${isEdit ? 'Save Changes' : `Publish ${typeBadges[this.currentType]}`}
          </button>
        </div>
      </form>
    `;

    this.attachFormEvents(container, existing);
  }

  renderPhotoPreviews() {
    return this.attachedPhotos.map((p, idx) => `
      <div style="position: relative; width: 56px; height: 56px; border-radius: 4px; overflow: hidden; border: 1px solid var(--color-paper); flex-shrink: 0;">
        <img src="${p.src}" alt="${p.alt || 'Photo'}" style="width: 100%; height: 100%; object-fit: cover;" />
        <button type="button" class="btn-remove-preview-photo" data-index="${idx}" style="position: absolute; top: 0; right: 0; background: rgba(0,0,0,0.7); color: #fff; width: 18px; height: 18px; font-size: 12px; line-height: 1; display: flex; align-items: center; justify-content: center;">×</button>
      </div>
    `).join('');
  }

  attachFormEvents(container, existing) {
    const form = container.querySelector('#compose-trail-form');
    if (!form) return;

    // Back button to choose different type
    container.querySelector('#btn-back-to-type-choice')?.addEventListener('click', () => {
      this.step = 'choose_type';
      this.render();
    });

    // Landmark Preset Select
    container.querySelector('#compose-landmark-preset')?.addEventListener('change', (e) => {
      const selected = e.target.options[e.target.selectedIndex];
      if (selected.value) {
        form.querySelector('#compose-mile').value = selected.value;
        form.querySelector('#compose-location').value = selected.dataset.name;
        this.formData.mile = parseFloat(selected.value);
        this.formData.location = selected.dataset.name;
      }
    });

    // Preset Photo buttons
    container.querySelectorAll('.btn-preset-thumb').forEach(btn => {
      btn.addEventListener('click', () => {
        const photoObj = {
          src: btn.dataset.src,
          alt: form.querySelector('#compose-location')?.value || 'Trail photo'
        };
        this.attachedPhotos = [photoObj];
        const listEl = container.querySelector('#compose-photo-preview-list');
        if (listEl) listEl.innerHTML = this.renderPhotoPreviews();
      });
    });

    // File Input Upload with Compression
    container.querySelector('#compose-photos')?.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []).filter(f => f.size > 0);
      if (files.length > 0) {
        const compressed = await compressImage(files[0]);
        this.attachedPhotos = [{
          src: compressed,
          alt: form.querySelector('#compose-location')?.value || 'Trail photo'
        }];
        const listEl = container.querySelector('#compose-photo-preview-list');
        if (listEl) listEl.innerHTML = this.renderPhotoPreviews();
      }
    });

    // Remove photo
    container.querySelector('#compose-photo-preview-list')?.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.btn-remove-preview-photo');
      if (removeBtn) {
        const idx = parseInt(removeBtn.dataset.index, 10);
        this.attachedPhotos.splice(idx, 1);
        const listEl = container.querySelector('#compose-photo-preview-list');
        if (listEl) listEl.innerHTML = this.renderPhotoPreviews();
      }
    });

    // Delete Button
    container.querySelector('#btn-delete-entry')?.addEventListener('click', () => {
      if (existing && confirm('Are you sure you want to delete this trail entry?')) {
        store.deleteEntry(existing.id);
      }
    });

    // Form Submit
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (this.busy) return;

      const submitBtn = form.querySelector('#btn-submit-update');
      this.busy = true;
      submitBtn.textContent = 'Saving…';
      submitBtn.disabled = true;

      try {
        const date = form.querySelector('#compose-date').value;
        const mile = parseFloat(form.querySelector('#compose-mile').value);
        const location = form.querySelector('#compose-location').value;
        const title = form.querySelector('#compose-title').value;
        const category = form.querySelector('#compose-category').value;
        const type = this.currentType;

        const body = form.querySelector('#compose-body')?.value || '';
        const quote = form.querySelector('#compose-quote')?.value || '';

        const metrics = {
          tempF: parseInt(form.querySelector('#compose-temp')?.value || '62', 10),
          condition: form.querySelector('#compose-condition')?.value || 'Clear',
          waterSource: form.querySelector('#compose-water')?.value || '',
          packWeightLbs: parseFloat(form.querySelector('#compose-pack')?.value || '26.5'),
          dayMileage: parseFloat(form.querySelector('#compose-day-mileage')?.value || '20.0'),
          ascentFt: parseInt(form.querySelector('#compose-ascent')?.value || '3400', 10),
          descentFt: parseInt(form.querySelector('#compose-descent')?.value || '2100', 10),
          movingTime: form.querySelector('#compose-moving-time')?.value || '6h 30m',
          gearNotes: form.querySelector('#compose-gear-notes')?.value || ''
        };

        const voice = {
          audioSrc: form.querySelector('#compose-voice-src')?.value || 'ambient-voice-recording',
          duration: form.querySelector('#compose-voice-duration')?.value || '02:30',
          transcript: form.querySelector('#compose-voice-transcript')?.value || ''
        };

        const scripture = {
          source: form.querySelector('#compose-scripture-source')?.value || 'Bhagavad Gita',
          citation: form.querySelector('#compose-scripture-citation')?.value || '',
          transliteration: form.querySelector('#compose-scripture-transliteration')?.value || '',
          translation: form.querySelector('#compose-scripture-translation')?.value || '',
          purport: form.querySelector('#compose-scripture-purport')?.value || ''
        };

        const kirtan = {
          streamUrl: form.querySelector('#compose-kirtan-stream')?.value || 'kirtan-stream-url',
          artist: form.querySelector('#compose-kirtan-artist')?.value || 'DAM & Trail Sangha',
          mantra: form.querySelector('#compose-kirtan-mantra')?.value || '',
          translation: form.querySelector('#compose-kirtan-translation')?.value || '',
          ragaOrMood: form.querySelector('#compose-kirtan-raga')?.value || ''
        };

        const photos = this.attachedPhotos.length > 0 ? this.attachedPhotos : [
          { src: 'photos/canopy.jpg', alt: location }
        ];

        const payload = {
          date,
          mile,
          location,
          title,
          category,
          type,
          body,
          quote,
          metrics,
          voice,
          scripture,
          kirtan,
          photos
        };

        if (existing) {
          store.updateEntry(existing.id, payload);
        } else {
          store.addEntry(payload);
        }
      } catch (err) {
        alert('Could not save update: ' + err.message);
      } finally {
        this.busy = false;
        submitBtn.textContent = existing ? 'Save Changes' : 'Publish Update';
        submitBtn.disabled = false;
      }
    });
  }
}
