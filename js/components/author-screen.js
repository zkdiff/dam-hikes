/**
 * DAM HIKES - 2-Stage Authoring Screen
 * Stage 1: Dedicated Pre-Selection Screen to choose Update Type (Story, Minimalist, Field Log)
 * Stage 2: Exclusively Keyed Authoring Screen for the chosen type
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
    this.currentFormat = 'story'; // 'story' | 'minimal' | 'fieldlog'
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
        this.currentFormat = existing.layoutStyle || 'story';
        this.attachedPhotos = [...(existing.photos || [])];
        this.formData = {
          date: existing.date,
          mile: existing.mile,
          location: existing.location,
          title: existing.title,
          quote: existing.quote || '',
          body: existing.body || '',
          category: existing.category || 'reflection',
          metrics: { ...(existing.metrics || {}) }
        };
        return;
      }
    }

    // New Entry starts at Stage 1: Choose Type
    this.step = 'choose_type';
    this.currentFormat = 'story';
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
        tempF: 68,
        condition: 'Clear',
        waterSource: '',
        packWeightLbs: 26.0,
        dayMileage: 20.0,
        gearNotes: ''
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
          <p class="type-selection-subtitle">Select the format that best fits what you are recording today:</p>
        </div>

        <div class="type-cards-stack">
          <!-- Option 1: Rich Story -->
          <button type="button" class="btn-type-big-card" data-format="story">
            <div class="type-card-top">
              <span class="type-big-icon">📖</span>
              <div class="type-card-headings">
                <div class="type-main-title">Rich Story</div>
                <div class="type-sub-title">Long-form narrative & photo gallery</div>
              </div>
            </div>
            <p class="type-card-description">
              For major milestones, town arrivals, trail encounters, and memorable days with a story to tell. Includes a multi-photo gallery, pull quote, and full journal prose.
            </p>
            <div class="type-card-tags">
              <span class="type-tag">Multi-Photo Gallery</span>
              <span class="type-tag">Pull Quotes</span>
              <span class="type-tag">Long-Form Story</span>
            </div>
          </button>

          <!-- Option 2: Minimalist Reflection -->
          <button type="button" class="btn-type-big-card" data-format="minimal">
            <div class="type-card-top">
              <span class="type-big-icon">🕊️</span>
              <div class="type-card-headings">
                <div class="type-main-title">Minimalist Reflection</div>
                <div class="type-sub-title">Single hero photo & centerpiece quote</div>
              </div>
            </div>
            <p class="type-card-description">
              For quiet summits, sunsets, and poignant trail thoughts. Strips away the data clutter to focus purely on one curated photograph and an evocative centerpiece line.
            </p>
            <div class="type-card-tags">
              <span class="type-tag">Hero Photograph</span>
              <span class="type-tag">Centerpiece Quote</span>
              <span class="type-tag">Poetic Reflection</span>
            </div>
          </button>

          <!-- Option 3: Field Log -->
          <button type="button" class="btn-type-big-card" data-format="fieldlog">
            <div class="type-card-top">
              <span class="type-big-icon">📊</span>
              <div class="type-card-headings">
                <div class="type-main-title">Field Log</div>
                <div class="type-sub-title">Data-first conditions, water & resupply</div>
              </div>
            </div>
            <p class="type-card-description">
              For practical trail intelligence: 4-cell weather/temp grid, water flow source, pack weight carry, daily mileage, and resupply notes.
            </p>
            <div class="type-card-tags">
              <span class="type-tag">4-Cell Conditions Grid</span>
              <span class="type-tag">Water Status</span>
              <span class="type-tag">Resupply & Gear</span>
            </div>
          </button>
        </div>
      </div>
    `;

    container.querySelectorAll('.btn-type-big-card').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentFormat = btn.dataset.format;
        if (this.currentFormat === 'minimal') {
          this.formData.category = 'reflection';
        } else if (this.currentFormat === 'fieldlog') {
          this.formData.category = 'resupply';
        } else {
          this.formData.category = 'milestone';
        }
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
    const metrics = this.formData.metrics || {};

    let formatSpecificFormHtml = '';

    if (this.currentFormat === 'minimal') {
      // --- 🕊️ MINIMALIST REFLECTION FORM ---
      formatSpecificFormHtml = `
        <div class="form-field">
          <label for="compose-quote"><strong>Centerpiece Pull Quote (The Core Thought)</strong></label>
          <textarea id="compose-quote" name="quote" rows="2" required placeholder="e.g. Hood is the first mountain I have to walk around. After that the trail is a long green hallway..." style="font-family: var(--font-display); font-size: 15px; font-style: italic;">${quote}</textarea>
        </div>

        <div class="form-field">
          <label for="compose-title">Title / Reflection Title</label>
          <input id="compose-title" name="title" required placeholder="e.g. Looking south through the green hallway" maxlength="80" value="${title}" />
        </div>

        <div class="form-field">
          <label for="compose-body">Contemplative Reflection Narrative</label>
          <textarea id="compose-body" name="body" rows="5" required placeholder="Write your quiet reflection, thoughts, or observations on the trail...">${body}</textarea>
        </div>

        <div class="form-field">
          <label>Curated Single Hero Photograph</label>
          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 6px;">
            <button type="button" class="btn-preset-thumb" data-src="photos/mt-hood.jpg">Mt Hood</button>
            <button type="button" class="btn-preset-thumb" data-src="photos/gorge-trail.jpg">Gorge</button>
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

    } else if (this.currentFormat === 'fieldlog') {
      // --- 📊 FIELD LOG FORM ---
      formatSpecificFormHtml = `
        <div class="form-field">
          <label for="compose-title">Field Log Title</label>
          <input id="compose-title" name="title" required placeholder="e.g. Timberline Waffles & Resupply Push" maxlength="80" value="${title}" />
        </div>

        <!-- 4-Cell Field Metrics Grid Inputs -->
        <div style="background: rgba(18, 20, 16, 0.7); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border);">
          <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-trail); font-weight: 700; margin-bottom: 8px;">📊 4-Cell Conditions Grid</p>
          <div class="form-grid-2">
            <div class="form-field">
              <label for="compose-temp">Temp (°F)</label>
              <input id="compose-temp" type="number" value="${metrics.tempF || 52}" required />
            </div>
            <div class="form-field">
              <label for="compose-condition">Sky / Wind Condition</label>
              <input id="compose-condition" placeholder="e.g. Alpine Morning Sun" value="${metrics.condition || ''}" required />
            </div>
          </div>
          <div class="form-grid-2" style="margin-top: 8px;">
            <div class="form-field">
              <label for="compose-water">Water Source & Reliability</label>
              <input id="compose-water" placeholder="e.g. Lodge tap + Salmon River" value="${metrics.waterSource || ''}" required />
            </div>
            <div class="form-field">
              <label for="compose-pack">Pack Weight (lbs)</label>
              <input id="compose-pack" type="number" step="0.5" value="${metrics.packWeightLbs || 26.0}" required />
            </div>
          </div>
          <div class="form-field" style="margin-top: 8px;">
            <label for="compose-day-mileage">Daily Mileage (mi)</label>
            <input id="compose-day-mileage" type="number" step="0.1" value="${metrics.dayMileage || 24.5}" placeholder="e.g. 24.5" />
          </div>
        </div>

        <div class="form-field">
          <label for="compose-gear-notes"><strong>⚙️ Resupply & Gear Notes</strong></label>
          <input id="compose-gear-notes" placeholder="e.g. Resupplied 5 days oats, tuna packets, tortillas, electrolyte tabs" value="${metrics.gearNotes || ''}" />
        </div>

        <div class="form-field">
          <label for="compose-body">Trail Observations & Field Log</label>
          <textarea id="compose-body" name="body" rows="4" required placeholder="Log trail surface conditions, water carries, elevation climbs...">${body}</textarea>
        </div>

        <div class="form-field">
          <label>Field Photos</label>
          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 6px;">
            <button type="button" class="btn-preset-thumb" data-src="photos/pack-table.jpg">Pack</button>
            <button type="button" class="btn-preset-thumb" data-src="photos/gear-spread.jpg">Gear</button>
            <button type="button" class="btn-preset-thumb" data-src="photos/trail-post.jpg">Post</button>
          </div>
          <input id="compose-photos" name="photos" type="file" accept="image/*" multiple />
          <div id="compose-photo-preview-list" style="display: flex; gap: 6px; margin-top: 6px; flex-wrap: wrap;">
            ${this.renderPhotoPreviews()}
          </div>
        </div>
      `;

    } else {
      // --- 📖 RICH STORY FORM ---
      formatSpecificFormHtml = `
        <div class="form-field">
          <label for="compose-title">Story Title</label>
          <input id="compose-title" name="title" required placeholder="What happened today?" maxlength="80" value="${title}" />
        </div>

        <div class="form-field">
          <label for="compose-quote">Lead / Pull Quote (Optional)</label>
          <input id="compose-quote" name="quote" placeholder="e.g. Washington on one bank, Oregon on the other..." value="${quote}" />
        </div>

        <div class="form-field">
          <label for="compose-body">Journal Narrative Story</label>
          <textarea id="compose-body" name="body" rows="6" required placeholder="Write your full long-form story...">${body}</textarea>
        </div>

        <div class="form-field">
          <label>Photo Gallery (Attach multiple images)</label>
          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 6px;">
            <button type="button" class="btn-preset-thumb" data-src="photos/bridge-gods.jpg">Bridge</button>
            <button type="button" class="btn-preset-thumb" data-src="photos/mt-hood.jpg">Mt Hood</button>
            <button type="button" class="btn-preset-thumb" data-src="photos/canopy.jpg">Forest</button>
            <button type="button" class="btn-preset-thumb" data-src="photos/river-dusk.jpg">River</button>
            <button type="button" class="btn-preset-thumb" data-src="photos/town-waterfront.jpg">Town</button>
            <button type="button" class="btn-preset-thumb" data-src="photos/hiker-back.jpg">Hiker</button>
          </div>
          <input id="compose-photos" name="photos" type="file" accept="image/*" multiple />
          <div id="compose-photo-preview-list" style="display: flex; gap: 6px; margin-top: 6px; flex-wrap: wrap;">
            ${this.renderPhotoPreviews()}
          </div>
        </div>

        <details style="background: rgba(18, 20, 16, 0.5); padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--color-border);">
          <summary style="font-size: 12px; font-weight: 600; color: var(--color-muted); cursor: pointer;">Optional Field Conditions (Temp, Water, Pack)</summary>
          <div class="form-grid-2" style="margin-top: 8px;">
            <div class="form-field">
              <label for="compose-temp">Temp (°F)</label>
              <input id="compose-temp" type="number" value="${metrics.tempF || 68}" />
            </div>
            <div class="form-field">
              <label for="compose-condition">Sky / Wind</label>
              <input id="compose-condition" placeholder="e.g. Crisp & Warm" value="${metrics.condition || ''}" />
            </div>
          </div>
          <div class="form-grid-2" style="margin-top: 8px;">
            <div class="form-field">
              <label for="compose-water">Water Source</label>
              <input id="compose-water" placeholder="e.g. Stream on trail" value="${metrics.waterSource || ''}" />
            </div>
            <div class="form-field">
              <label for="compose-pack">Pack Weight (lbs)</label>
              <input id="compose-pack" type="number" step="0.5" value="${metrics.packWeightLbs || 26.0}" />
            </div>
          </div>
        </details>
      `;
    }

    container.innerHTML = `
      <form id="compose-trail-form" class="compose-form-stack" style="padding-bottom: 24px;">
        
        <!-- Top Switcher Bar -->
        <div class="compose-header-bar">
          <button type="button" id="btn-back-to-type-choice" class="btn-back-type" title="Choose a different update type">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            <span>Change Type</span>
          </button>
          <div class="compose-current-badge">
            ${this.currentFormat === 'minimal' ? '🕊️ Minimalist Reflection' : this.currentFormat === 'fieldlog' ? '📊 Field Log' : '📖 Rich Story'}
          </div>
        </div>

        <!-- Location & Landmark Jump -->
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
            <input id="compose-location" name="location" required placeholder="e.g. Timberline Lodge, OR" maxlength="80" value="${location}" />
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

        <!-- Format-Specific Tailored Inputs -->
        ${formatSpecificFormHtml}

        <!-- Submit & Delete Actions -->
        <div style="display: flex; gap: 8px; margin-top: 14px;">
          ${isEdit ? `
            <button type="button" id="btn-delete-entry" style="padding: 10px 14px; border-radius: var(--radius-sm); background: #EF4444; color: #FFFFFF; font-weight: 600; font-size: 13px;">
              Delete
            </button>
          ` : ''}
          <button type="submit" id="btn-submit-update" class="btn-compose-submit" style="flex: 1;">
            ${isEdit ? 'Save Changes' : `Publish ${this.currentFormat === 'minimal' ? 'Reflection' : this.currentFormat === 'fieldlog' ? 'Field Log' : 'Story'}`}
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

    // Back to Stage 1
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
        if (this.currentFormat === 'minimal') {
          this.attachedPhotos = [photoObj];
        } else {
          this.attachedPhotos.push(photoObj);
        }
        const listEl = container.querySelector('#compose-photo-preview-list');
        if (listEl) listEl.innerHTML = this.renderPhotoPreviews();
      });
    });

    // File Input Upload with Compression
    container.querySelector('#compose-photos')?.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []).filter(f => f.size > 0);
      if (this.currentFormat === 'minimal' && files.length > 0) {
        const compressed = await compressImage(files[0]);
        this.attachedPhotos = [{
          src: compressed,
          alt: form.querySelector('#compose-location')?.value || 'Trail photo'
        }];
      } else {
        for (const f of files.slice(0, 4)) {
          const compressed = await compressImage(f);
          this.attachedPhotos.push({
            src: compressed,
            alt: form.querySelector('#compose-location')?.value || 'Trail photo'
          });
        }
      }
      const listEl = container.querySelector('#compose-photo-preview-list');
      if (listEl) listEl.innerHTML = this.renderPhotoPreviews();
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
        const quote = form.querySelector('#compose-quote')?.value || '';
        const body = form.querySelector('#compose-body').value;
        const category = form.querySelector('#compose-category').value;
        const layoutStyle = this.currentFormat;

        const metrics = {
          tempF: parseInt(form.querySelector('#compose-temp')?.value || '68', 10),
          condition: form.querySelector('#compose-condition')?.value || 'Clear',
          waterSource: form.querySelector('#compose-water')?.value || '',
          packWeightLbs: parseFloat(form.querySelector('#compose-pack')?.value || '26'),
          dayMileage: parseFloat(form.querySelector('#compose-day-mileage')?.value || '0'),
          gearNotes: form.querySelector('#compose-gear-notes')?.value || ''
        };

        const photos = this.attachedPhotos.length > 0 ? this.attachedPhotos : [
          { src: 'photos/canopy.jpg', alt: location }
        ];

        if (existing) {
          store.updateEntry(existing.id, {
            date,
            mile,
            location,
            title,
            quote,
            body,
            category,
            layoutStyle,
            metrics,
            photos
          });
        } else {
          store.addEntry({
            date,
            mile,
            location,
            title,
            quote,
            body,
            category,
            layoutStyle,
            metrics,
            photos
          });
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
