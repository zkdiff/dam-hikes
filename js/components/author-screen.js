/**
 * DAM HIKES - Adaptive Authoring Screen Keyed Directly to the 3 Update Types
 * (Rich Story, Minimalist Reflection, Field Log)
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

  captureCurrentInputs(container) {
    const form = container.querySelector('#compose-trail-form');
    if (!form) return;

    this.formData.date = form.querySelector('#compose-date')?.value || this.formData.date;
    this.formData.mile = parseFloat(form.querySelector('#compose-mile')?.value || this.formData.mile);
    this.formData.location = form.querySelector('#compose-location')?.value || this.formData.location;
    this.formData.title = form.querySelector('#compose-title')?.value || this.formData.title;
    this.formData.quote = form.querySelector('#compose-quote')?.value || this.formData.quote;
    this.formData.body = form.querySelector('#compose-body')?.value || this.formData.body;
    this.formData.category = form.querySelector('#compose-category')?.value || this.formData.category;

    if (!this.formData.metrics) this.formData.metrics = {};
    if (form.querySelector('#compose-temp')) this.formData.metrics.tempF = parseInt(form.querySelector('#compose-temp').value || '68', 10);
    if (form.querySelector('#compose-condition')) this.formData.metrics.condition = form.querySelector('#compose-condition').value;
    if (form.querySelector('#compose-water')) this.formData.metrics.waterSource = form.querySelector('#compose-water').value;
    if (form.querySelector('#compose-pack')) this.formData.metrics.packWeightLbs = parseFloat(form.querySelector('#compose-pack').value || '26');
    if (form.querySelector('#compose-day-mileage')) this.formData.metrics.dayMileage = parseFloat(form.querySelector('#compose-day-mileage').value || '0');
    if (form.querySelector('#compose-gear-notes')) this.formData.metrics.gearNotes = form.querySelector('#compose-gear-notes').value;
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const editingId = store.editingId;
    const existing = editingId ? store.entries.find(e => e.id === editingId) : null;
    const isEdit = !!existing;

    const date = this.formData.date || new Date().toISOString().split('T')[0];
    const mile = this.formData.mile !== undefined ? this.formData.mile : 2150;
    const location = this.formData.location || '';
    const title = this.formData.title || '';
    const quote = this.formData.quote || '';
    const body = this.formData.body || '';
    const category = this.formData.category || (this.currentFormat === 'minimal' ? 'reflection' : this.currentFormat === 'fieldlog' ? 'resupply' : 'story');
    const metrics = this.formData.metrics || {};

    // 1. Format-Specific Field Blocks
    let formatSpecificFieldsHtml = '';

    if (this.currentFormat === 'minimal') {
      // --- FORMAT: MINIMALIST REFLECTION ---
      formatSpecificFieldsHtml = `
        <div class="form-format-section-highlight minimal-highlight">
          <div class="format-badge-banner">
            <span>🕊️ Minimalist Reflection Mode</span>
            <span class="format-badge-sub">Single photo · Centerpiece quote · Poetic journal</span>
          </div>

          <div class="form-field" style="margin-top: 10px;">
            <label for="compose-quote"><strong>Centerpiece Pull Quote (The Core Thought)</strong></label>
            <textarea id="compose-quote" name="quote" rows="2" required placeholder="e.g. Hood is the first mountain I have to walk around. After that the trail is a long green hallway..." style="font-family: var(--font-display); font-size: 15px; font-style: italic;">${quote}</textarea>
          </div>

          <div class="form-field" style="margin-top: 10px;">
            <label for="compose-title">Title / Moment Name</label>
            <input id="compose-title" name="title" required placeholder="e.g. Looking south through the green hallway" maxlength="80" value="${title}" />
          </div>

          <div class="form-field" style="margin-top: 10px;">
            <label for="compose-body">Contemplative Reflection Narrative</label>
            <textarea id="compose-body" name="body" rows="5" required placeholder="Write your quiet reflection, thoughts, or observations...">${body}</textarea>
          </div>

          <!-- Single Hero Photo -->
          <div class="form-field" style="margin-top: 10px;">
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
        </div>
      `;

    } else if (this.currentFormat === 'fieldlog') {
      // --- FORMAT: FIELD LOG ---
      formatSpecificFieldsHtml = `
        <div class="form-format-section-highlight fieldlog-highlight">
          <div class="format-badge-banner">
            <span>📊 Field Log & Data Mode</span>
            <span class="format-badge-sub">Lead conditions grid · Resupply intelligence · Trail metrics</span>
          </div>

          <div class="form-field" style="margin-top: 10px;">
            <label for="compose-title">Field Log Title</label>
            <input id="compose-title" name="title" required placeholder="e.g. Timberline Waffles & Resupply Push" maxlength="80" value="${title}" />
          </div>

          <!-- 4-Cell Field Metrics Grid Inputs -->
          <div style="background: rgba(18, 20, 16, 0.7); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); margin-top: 10px;">
            <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-trail); font-weight: 700; margin-bottom: 8px;">📊 4-Cell Lead Data Grid</p>
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
                <label for="compose-water">Water Source & Flow</label>
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

          <div class="form-field" style="margin-top: 10px;">
            <label for="compose-gear-notes"><strong>⚙️ Resupply & Gear Notes</strong></label>
            <input id="compose-gear-notes" placeholder="e.g. Resupplied with 5 days oats, tuna packets, tortillas, electrolyte tabs" value="${metrics.gearNotes || ''}" />
          </div>

          <div class="form-field" style="margin-top: 10px;">
            <label for="compose-body">Trail Observations & Field Notes</label>
            <textarea id="compose-body" name="body" rows="4" required placeholder="Log trail surface conditions, climbs, water carries...">${body}</textarea>
          </div>

          <!-- Photos -->
          <div class="form-field" style="margin-top: 10px;">
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
        </div>
      `;

    } else {
      // --- FORMAT: RICH STORY (DEFAULT) ---
      formatSpecificFieldsHtml = `
        <div class="form-format-section-highlight story-highlight">
          <div class="format-badge-banner">
            <span>📖 Rich Story Mode</span>
            <span class="format-badge-sub">Long-form narrative · Multi-photo gallery · Pull quote</span>
          </div>

          <div class="form-field" style="margin-top: 10px;">
            <label for="compose-title">Story Title</label>
            <input id="compose-title" name="title" required placeholder="What happened today?" maxlength="80" value="${title}" />
          </div>

          <div class="form-field" style="margin-top: 10px;">
            <label for="compose-quote">Lead / Pull Quote (Optional)</label>
            <input id="compose-quote" name="quote" placeholder="e.g. Washington on one bank, Oregon on the other..." value="${quote}" />
          </div>

          <div class="form-field" style="margin-top: 10px;">
            <label for="compose-body">Journal Narrative Story</label>
            <textarea id="compose-body" name="body" rows="6" required placeholder="Write your full long-form story...">${body}</textarea>
          </div>

          <!-- Multi-Photo Gallery -->
          <div class="form-field" style="margin-top: 10px;">
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

          <!-- Optional Stats -->
          <details style="background: rgba(18, 20, 16, 0.5); padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); margin-top: 10px;">
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
        </div>
      `;
    }

    container.innerHTML = `
      <form id="compose-trail-form" class="compose-form-stack" style="padding-bottom: 24px;">
        
        <!-- 1. Prominent Format Choice Selector -->
        <div>
          <label style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-muted); font-weight: 700; display: block; margin-bottom: 6px;">
            1. Select Post Type
          </label>
          
          <div class="composer-format-cards-grid">
            <button type="button" class="format-choice-card ${this.currentFormat === 'story' ? 'selected' : ''}" data-format="story">
              <span class="format-card-icon">📖</span>
              <div class="format-card-text">
                <div class="format-card-title">Rich Story</div>
                <div class="format-card-desc">Long narrative & photo gallery</div>
              </div>
            </button>

            <button type="button" class="format-choice-card ${this.currentFormat === 'minimal' ? 'selected' : ''}" data-format="minimal">
              <span class="format-card-icon">🕊️</span>
              <div class="format-card-text">
                <div class="format-card-title">Minimalist</div>
                <div class="format-card-desc">Hero photo & lead quote</div>
              </div>
            </button>

            <button type="button" class="format-choice-card ${this.currentFormat === 'fieldlog' ? 'selected' : ''}" data-format="fieldlog">
              <span class="format-card-icon">📊</span>
              <div class="format-card-text">
                <div class="format-card-title">Field Log</div>
                <div class="format-card-desc">Data grid, water & gear notes</div>
              </div>
            </button>
          </div>
        </div>

        <!-- 2. Shared Route & Location Controls -->
        <div style="margin-top: 8px;">
          <label style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-muted); font-weight: 700; display: block; margin-bottom: 6px;">
            2. Location & Date
          </label>

          <div class="form-field" style="margin-bottom: 8px;">
            <select id="compose-landmark-preset" style="padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); background: var(--color-bg); color: var(--color-fg); font-size: 13px;">
              <option value="">-- Jump to Waypoint / Landmark --</option>
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
              <label for="compose-mile">PCT Mile (NOBO)</label>
              <input id="compose-mile" name="mile" type="number" min="0" max="2650" step="0.1" required value="${mile}" />
            </div>
          </div>

          <div class="form-grid-2" style="margin-top: 8px;">
            <div class="form-field">
              <label for="compose-location">Location Name</label>
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
        </div>

        <!-- 3. Form Specifically Keyed to Selected Format -->
        <div style="margin-top: 8px;">
          <label style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-muted); font-weight: 700; display: block; margin-bottom: 6px;">
            3. Post Content (${this.currentFormat.toUpperCase()})
          </label>
          ${formatSpecificFieldsHtml}
        </div>

        <!-- Submit & Actions -->
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

    this.attachEvents(container, existing);
  }

  renderPhotoPreviews() {
    return this.attachedPhotos.map((p, idx) => `
      <div style="position: relative; width: 56px; height: 56px; border-radius: 4px; overflow: hidden; border: 1px solid var(--color-paper); flex-shrink: 0;">
        <img src="${p.src}" alt="${p.alt || 'Photo'}" style="width: 100%; height: 100%; object-fit: cover;" />
        <button type="button" class="btn-remove-preview-photo" data-index="${idx}" style="position: absolute; top: 0; right: 0; background: rgba(0,0,0,0.7); color: #fff; width: 18px; height: 18px; font-size: 12px; line-height: 1; display: flex; align-items: center; justify-content: center;">×</button>
      </div>
    `).join('');
  }

  attachEvents(container, existing) {
    const form = container.querySelector('#compose-trail-form');
    if (!form) return;

    // Format Choice Cards
    container.querySelectorAll('.format-choice-card').forEach(card => {
      card.addEventListener('click', () => {
        this.captureCurrentInputs(container);
        this.currentFormat = card.dataset.format;
        this.render();
      });
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

    // Remove photo from preview
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
