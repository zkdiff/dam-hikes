/**
 * DAM HIKES - Full Authoring & Composer Component with Presets, Photos & Metrics
 */

import { PCT_WAYPOINTS, ELEVATION_PROFILE } from '../data/pct-route.js';
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
    this.attachedPhotos = [];
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
        this.attachedPhotos = [...(existing.photos || [])];
        return;
      }
    }
    this.attachedPhotos = [];
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const editingId = store.editingId;
    const existing = editingId ? store.entries.find(e => e.id === editingId) : null;
    const isEdit = !!existing;

    const defaultDate = existing ? existing.date : new Date().toISOString().split('T')[0];
    const defaultMile = existing ? existing.mile : 2150;
    const defaultLocation = existing ? existing.location : '';
    const defaultTitle = existing ? existing.title : '';
    const defaultBody = existing ? existing.body : '';
    const defaultCategory = existing ? existing.category : 'reflection';
    const defaultLayout = existing ? existing.layoutStyle : 'story';
    const defaultQuote = existing ? existing.quote : '';
    const metrics = existing ? (existing.metrics || {}) : {};

    container.innerHTML = `
      <form id="compose-trail-form" class="compose-form-stack" style="padding-bottom: 24px;">
        
        <!-- 1. Landmark Preset -->
        <div class="form-field">
          <label for="compose-landmark-preset">Jump to Milestone / Landmark</label>
          <select id="compose-landmark-preset" style="padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); background: var(--color-bg); color: var(--color-fg); font-size: 13px;">
            <option value="">-- Choose waypoint or enter mile manually --</option>
            ${PCT_WAYPOINTS.map(wp => `
              <option value="${wp.mile}" data-name="${wp.name}">
                Mile ${wp.mile}: ${wp.name} (${wp.state})
              </option>
            `).join('')}
          </select>
        </div>

        <div class="form-grid-2">
          <div class="form-field">
            <label for="compose-date">Date</label>
            <input id="compose-date" name="date" type="date" required value="${defaultDate}" />
          </div>
          <div class="form-field">
            <label for="compose-mile">PCT Mile (NOBO Marker)</label>
            <input id="compose-mile" name="mile" type="number" min="0" max="2650" step="0.1" required value="${defaultMile}" />
          </div>
        </div>

        <div class="form-field">
          <label for="compose-location">Location / Landmark Name</label>
          <input id="compose-location" name="location" required placeholder="e.g. Forester Pass Summit" maxlength="80" value="${defaultLocation}" />
        </div>

        <div class="form-grid-2">
          <div class="form-field">
            <label for="compose-category">Category</label>
            <select id="compose-category">
              <option value="campsite" ${defaultCategory === 'campsite' ? 'selected' : ''}>⛺ Campsite / Nights</option>
              <option value="milestone" ${defaultCategory === 'milestone' ? 'selected' : ''}>🏔️ Milestone / Pass</option>
              <option value="resupply" ${defaultCategory === 'resupply' ? 'selected' : ''}>🍕 Resupply / Town</option>
              <option value="wildlife" ${defaultCategory === 'wildlife' ? 'selected' : ''}>🐻 Wildlife & Flora</option>
              <option value="hardship" ${defaultCategory === 'hardship' ? 'selected' : ''}>⚡ Condition / Hazard</option>
              <option value="reflection" ${defaultCategory === 'reflection' ? 'selected' : ''}>📖 Journal Reflection</option>
            </select>
          </div>

          <div class="form-field">
            <label for="compose-layout">Layout Format</label>
            <select id="compose-layout">
              <option value="story" ${defaultLayout === 'story' ? 'selected' : ''}>Rich Story (Narrative + Gallery)</option>
              <option value="minimal" ${defaultLayout === 'minimal' ? 'selected' : ''}>Minimalist (Quote + Focus Hero)</option>
              <option value="fieldlog" ${defaultLayout === 'fieldlog' ? 'selected' : ''}>Field Log (Structured Metrics Grid)</option>
            </select>
          </div>
        </div>

        <div class="form-field">
          <label for="compose-title">Title</label>
          <input id="compose-title" name="title" required placeholder="What happened today?" maxlength="80" value="${defaultTitle}" />
        </div>

        <div class="form-field">
          <label for="compose-quote">Lead / Pull Quote (Optional)</label>
          <input id="compose-quote" name="quote" placeholder="e.g. To step onto the trail is to make a promise..." value="${defaultQuote || ''}" />
        </div>

        <div class="form-field">
          <label for="compose-body">Journal Narrative</label>
          <textarea id="compose-body" name="body" rows="6" required placeholder="Write your journal entry here...">${defaultBody}</textarea>
        </div>

        <!-- Field Conditions & Metrics -->
        <div style="background: rgba(18, 20, 16, 0.6); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); margin-top: 4px;">
          <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-muted); margin-bottom: 8px; font-weight: 600;">📊 Optional Field Metrics</p>
          <div class="form-grid-2">
            <div class="form-field">
              <label for="compose-temp">Temp (°F)</label>
              <input id="compose-temp" type="number" value="${metrics.tempF || 68}" />
            </div>
            <div class="form-field">
              <label for="compose-condition">Sky / Wind</label>
              <input id="compose-condition" placeholder="e.g. Crisp & Windy" value="${metrics.condition || ''}" />
            </div>
          </div>
          <div class="form-grid-2" style="margin-top: 8px;">
            <div class="form-field">
              <label for="compose-water">Water Source</label>
              <input id="compose-water" placeholder="e.g. Spring 0.1mi off trail" value="${metrics.waterSource || ''}" />
            </div>
            <div class="form-field">
              <label for="compose-pack">Pack Weight (lbs)</label>
              <input id="compose-pack" type="number" step="0.5" value="${metrics.packWeightLbs || 26.0}" />
            </div>
          </div>
        </div>

        <!-- Photos -->
        <div class="form-field" style="margin-top: 6px;">
          <label for="compose-photos">Attached Photos</label>
          
          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 6px;">
            <button type="button" class="btn-preset-thumb" data-src="photos/bridge-gods.jpg">Bridge</button>
            <button type="button" class="btn-preset-thumb" data-src="photos/mt-hood.jpg">Mt Hood</button>
            <button type="button" class="btn-preset-thumb" data-src="photos/canopy.jpg">Forest</button>
            <button type="button" class="btn-preset-thumb" data-src="photos/river-dusk.jpg">River</button>
            <button type="button" class="btn-preset-thumb" data-src="photos/hiker-back.jpg">Hiker</button>
            <button type="button" class="btn-preset-thumb" data-src="photos/gear-spread.jpg">Gear</button>
          </div>

          <input id="compose-photos" name="photos" type="file" accept="image/*" multiple />
          
          <div id="compose-photo-preview-list" style="display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap;">
            ${this.renderPhotoPreviews()}
          </div>
        </div>

        <!-- Submit & Actions -->
        <div style="display: flex; gap: 8px; margin-top: 10px;">
          ${isEdit ? `
            <button type="button" id="btn-delete-entry" style="padding: 10px 14px; border-radius: var(--radius-sm); background: #EF4444; color: #FFFFFF; font-weight: 600; font-size: 13px;">
              Delete
            </button>
          ` : ''}
          <button type="submit" id="btn-submit-update" class="btn-compose-submit" style="flex: 1;">
            ${isEdit ? 'Save Changes' : 'Share Update'}
          </button>
        </div>
      </form>
    `;

    this.attachEvents(container, existing);
  }

  renderPhotoPreviews() {
    return this.attachedPhotos.map((p, idx) => `
      <div style="position: relative; width: 60px; height: 60px; border-radius: 4px; overflow: hidden; border: 1px solid var(--color-paper);">
        <img src="${p.src}" alt="${p.alt || 'Photo'}" style="width: 100%; height: 100%; object-fit: cover;" />
        <button type="button" class="btn-remove-preview-photo" data-index="${idx}" style="position: absolute; top: 0; right: 0; background: rgba(0,0,0,0.7); color: #fff; width: 18px; height: 18px; font-size: 12px; line-height: 1; display: flex; align-items: center; justify-content: center;">×</button>
      </div>
    `).join('');
  }

  attachEvents(container, existing) {
    const form = container.querySelector('#compose-trail-form');
    if (!form) return;

    // Landmark Preset Select
    container.querySelector('#compose-landmark-preset')?.addEventListener('change', (e) => {
      const selected = e.target.options[e.target.selectedIndex];
      if (selected.value) {
        form.querySelector('#compose-mile').value = selected.value;
        form.querySelector('#compose-location').value = selected.dataset.name;
      }
    });

    // Preset Photo buttons
    container.querySelectorAll('.btn-preset-thumb').forEach(btn => {
      btn.addEventListener('click', () => {
        this.attachedPhotos.push({
          src: btn.dataset.src,
          alt: form.querySelector('#compose-location').value || 'Trail photo'
        });
        const listEl = container.querySelector('#compose-photo-preview-list');
        if (listEl) listEl.innerHTML = this.renderPhotoPreviews();
      });
    });

    // File Input Upload with Compression
    container.querySelector('#compose-photos')?.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []).filter(f => f.size > 0);
      for (const f of files.slice(0, 4)) {
        const compressed = await compressImage(f);
        this.attachedPhotos.push({
          src: compressed,
          alt: form.querySelector('#compose-location').value || 'Trail photo'
        });
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
        const quote = form.querySelector('#compose-quote').value;
        const body = form.querySelector('#compose-body').value;
        const category = form.querySelector('#compose-category').value;
        const layoutStyle = form.querySelector('#compose-layout').value;

        const metrics = {
          tempF: parseInt(form.querySelector('#compose-temp').value || '68', 10),
          condition: form.querySelector('#compose-condition').value,
          waterSource: form.querySelector('#compose-water').value,
          packWeightLbs: parseFloat(form.querySelector('#compose-pack').value || '26')
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
        submitBtn.textContent = existing ? 'Save Changes' : 'Share Update';
        submitBtn.disabled = false;
      }
    });
  }
}
