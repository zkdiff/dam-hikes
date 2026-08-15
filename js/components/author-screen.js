/**
 * DAM HIKES - Discrete Author & Entry Composer Screen
 */

import { store } from '../state.js';
import { MAJOR_LANDMARKS, PCT_SECTIONS, getRoutePointForMile } from '../data/pct-route.js';

export class AuthorScreen {
  constructor(containerId) {
    this.containerId = containerId;
    this.formData = this.getEmptyFormState();
    this.isEditing = false;
    this.editingId = null;
  }

  getEmptyFormState() {
    return {
      title: '',
      date: new Date().toISOString().split('T')[0],
      dayNumber: 1,
      mileMarker: 0.0,
      locationName: '',
      elevationFt: 180,
      category: 'reflection',
      layoutStyle: 'story',
      quote: '',
      story: '',
      photos: [],
      metrics: {
        tempF: 68,
        condition: 'Sunny & Clear',
        waterSource: '',
        waterReliability: 'flowing',
        packWeightLbs: 28.0,
        dayMileage: 22.0,
        gearNotes: ''
      }
    };
  }

  init() {
    store.subscribe((s, eventType) => {
      if (eventType === 'screen_change' && store.activeScreen === 'author') {
        this.setupForm(store.editingMomentId);
        this.render();
      }
    });
  }

  setupForm(momentId = null) {
    if (momentId) {
      const existing = store.moments.find(m => m.id === momentId);
      if (existing) {
        this.isEditing = true;
        this.editingId = momentId;
        this.formData = JSON.parse(JSON.stringify(existing));
        return;
      }
    }

    this.isEditing = false;
    this.editingId = null;
    this.formData = this.getEmptyFormState();

    // Default to approximate next day/mile based on last moment
    if (store.moments.length > 0) {
      const last = store.moments[store.moments.length - 1];
      this.formData.dayNumber = last.dayNumber + 1;
      this.formData.mileMarker = Math.min(2150, Math.round((last.mileMarker + 20) * 10) / 10);
      const pt = getRoutePointForMile(this.formData.mileMarker);
      this.formData.elevationFt = pt[2];
    }
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const isEdit = this.isEditing;
    const form = this.formData;

    container.innerHTML = `
      <div class="author-screen-layout">
        <!-- Top Action Bar -->
        <header class="author-header">
          <div class="author-header-left">
            <button class="btn-secondary" id="btn-author-back">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
              <span>Back to Map</span>
            </button>
            <div class="author-title-group">
              <h2>${isEdit ? 'Edit Trail Entry' : 'Compose New Trail Entry'}</h2>
              <p class="author-subtitle">Log your journey along the Southbound Pacific Crest Trail</p>
            </div>
          </div>

          <div class="author-header-right">
            ${isEdit ? `
              <button class="btn-danger" id="btn-author-delete">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                <span>Delete Entry</span>
              </button>
            ` : ''}
            <button class="btn-primary" id="btn-author-save">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              <span>${isEdit ? 'Save Changes' : 'Publish to Trail'}</span>
            </button>
          </div>
        </header>

        <!-- Two Column Workspace: Form on Left, Live Preview on Right -->
        <div class="author-workspace-grid">
          <!-- Left Column: Form Controls -->
          <div class="author-form-col">
            <form id="author-form" class="author-form" onsubmit="return false;">
              
              <!-- 1. Route Location & Milestone Section -->
              <section class="form-section">
                <h3 class="section-title">📍 Trail Location & Mile</h3>
                
                <div class="form-row">
                  <div class="form-group flex-2">
                    <label for="input-landmark-preset">Jump to Major Landmark / Milestone</label>
                    <select id="input-landmark-preset" class="form-select">
                      <option value="">-- Choose a landmark or set mile manually --</option>
                      ${MAJOR_LANDMARKS.map(lm => `
                        <option value="${lm.mile}" data-lat="${lm.lat}" data-lng="${lm.lng}" data-elev="${lm.elevFt}" data-name="${lm.name}">
                          Mile ${lm.mile.toFixed(1)}: ${lm.name} (${lm.elevFt} ft)
                        </option>
                      `).join('')}
                    </select>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group flex-1">
                    <label for="input-mile">SOBO Mile Marker (0.0 to 2,150.0)</label>
                    <input type="number" id="input-mile" step="0.1" min="0" max="2150" value="${form.mileMarker}" required />
                  </div>
                  <div class="form-group flex-1">
                    <label for="input-elev">Elevation (ft)</label>
                    <input type="number" id="input-elev" value="${form.elevationFt}" />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group flex-2">
                    <label for="input-location">Location / Landmark Name</label>
                    <input type="text" id="input-location" placeholder="e.g. Forester Pass, Kings Canyon / Sequoia" value="${form.locationName || ''}" required />
                  </div>
                </div>
              </section>

              <!-- 2. Date & Timing -->
              <section class="form-section">
                <h3 class="section-title">📅 Date & Hike Timeline</h3>
                <div class="form-row">
                  <div class="form-group flex-1">
                    <label for="input-day">Day # on Trail</label>
                    <input type="number" id="input-day" min="1" max="200" value="${form.dayNumber}" required />
                  </div>
                  <div class="form-group flex-1">
                    <label for="input-date">Date</label>
                    <input type="date" id="input-date" value="${form.date}" required />
                  </div>
                </div>
              </section>

              <!-- 3. Category & Layout Style -->
              <section class="form-section">
                <h3 class="section-title">🏷️ Category & Display Style</h3>
                <div class="form-row">
                  <div class="form-group flex-1">
                    <label for="input-category">Moment Category</label>
                    <select id="input-category" class="form-select">
                      <option value="campsite" ${form.category === 'campsite' ? 'selected' : ''}>⛺ Campsite / Nights</option>
                      <option value="milestone" ${form.category === 'milestone' ? 'selected' : ''}>🏔️ Milestones & High Passes</option>
                      <option value="resupply" ${form.category === 'resupply' ? 'selected' : ''}>🍕 Town Resupply & Trail Magic</option>
                      <option value="wildlife" ${form.category === 'wildlife' ? 'selected' : ''}>🐻 Wildlife & Flora</option>
                      <option value="hardship" ${form.category === 'hardship' ? 'selected' : ''}>⚡ Hardship & Trail Conditions</option>
                      <option value="reflection" ${form.category === 'reflection' ? 'selected' : ''}>📖 Journal Reflections</option>
                    </select>
                  </div>

                  <div class="form-group flex-1">
                    <label for="input-layout">Layout Format</label>
                    <select id="input-layout" class="form-select">
                      <option value="story" ${form.layoutStyle === 'story' ? 'selected' : ''}>Rich Story (Narrative + Gallery)</option>
                      <option value="minimal" ${form.layoutStyle === 'minimal' ? 'selected' : ''}>Minimalist (Quote + Single Photo)</option>
                      <option value="fieldlog" ${form.layoutStyle === 'fieldlog' ? 'selected' : ''}>Field Log (Structured Metrics Grid)</option>
                    </select>
                  </div>
                </div>
              </section>

              <!-- 4. Story & Narrative -->
              <section class="form-section">
                <h3 class="section-title">✍️ Story & Reflections</h3>
                
                <div class="form-group">
                  <label for="input-title">Moment Title</label>
                  <input type="text" id="input-title" placeholder="e.g. Standing on the Highest Step of the PCT" value="${form.title}" required />
                </div>

                <div class="form-group">
                  <label for="input-quote">Lead / Pull Quote (Optional)</label>
                  <input type="text" id="input-quote" placeholder="e.g. To step onto the trail is to make a promise..." value="${form.quote || ''}" />
                </div>

                <div class="form-group">
                  <label for="input-story">Journal Narrative</label>
                  <textarea id="input-story" rows="8" placeholder="Write your journal entry here. Separate paragraphs with a blank line...">${form.story || ''}</textarea>
                </div>
              </section>

              <!-- 5. Photography -->
              <section class="form-section">
                <h3 class="section-title">📷 Trail Photography</h3>
                
                <div class="photo-management-box">
                  <div class="form-row">
                    <div class="form-group flex-2">
                      <label for="input-photo-url">Add Photo by URL</label>
                      <input type="url" id="input-photo-url" placeholder="https://images.unsplash.com/..." />
                    </div>
                    <div class="form-group flex-2">
                      <label for="input-photo-caption">Caption</label>
                      <input type="text" id="input-photo-caption" placeholder="Description of scene" />
                    </div>
                    <div class="form-group flex-1 form-btn-align">
                      <button class="btn-secondary" id="btn-add-photo-url" type="button">+ Add</button>
                    </div>
                  </div>

                  <!-- Quick Presets -->
                  <div class="photo-presets-row">
                    <span class="preset-label">Quick Trail Presets:</span>
                    <button type="button" class="btn-preset" data-url="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" data-caption="Cascade alpine wilderness vista">Cascades</button>
                    <button type="button" class="btn-preset" data-url="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80" data-caption="High Sierra granite pass">Sierra Pass</button>
                    <button type="button" class="btn-preset" data-url="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80" data-caption="Camp pitched at alpine lake">Camp Lake</button>
                    <button type="button" class="btn-preset" data-url="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80" data-caption="Desert stretch in the afternoon sun">Desert Trail</button>
                  </div>

                  <!-- Photo Upload File -->
                  <div class="form-group" style="margin-top: 12px;">
                    <label for="input-photo-file">Or Upload Image File from Device:</label>
                    <input type="file" id="input-photo-file" accept="image/*" />
                  </div>

                  <!-- Attached Photos List -->
                  <div class="attached-photos-list" id="attached-photos-list">
                    ${this.renderAttachedPhotos(form.photos)}
                  </div>
                </div>
              </section>

              <!-- 6. Field Conditions & Metrics -->
              <section class="form-section">
                <h3 class="section-title">📊 Field Metrics & Conditions</h3>
                <div class="form-row">
                  <div class="form-group flex-1">
                    <label for="input-temp">Temperature (°F)</label>
                    <input type="number" id="input-temp" value="${form.metrics?.tempF || 68}" />
                  </div>
                  <div class="form-group flex-1">
                    <label for="input-condition">Weather Condition</label>
                    <input type="text" id="input-condition" placeholder="e.g. Crisp & Windy, 25mph gusts" value="${form.metrics?.condition || ''}" />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group flex-1">
                    <label for="input-water">Water Source & Status</label>
                    <input type="text" id="input-water" placeholder="e.g. Spring 0.1mi off trail (gushing)" value="${form.metrics?.waterSource || ''}" />
                  </div>
                  <div class="form-group flex-1">
                    <label for="input-pack">Pack Weight (lbs)</label>
                    <input type="number" id="input-pack" step="0.5" value="${form.metrics?.packWeightLbs || 26.0}" />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group flex-1">
                    <label for="input-day-mileage">Day's Mileage (mi)</label>
                    <input type="number" id="input-day-mileage" step="0.1" value="${form.metrics?.dayMileage || 24.0}" />
                  </div>
                  <div class="form-group flex-2">
                    <label for="input-gear-notes">Gear & Resupply Notes</label>
                    <input type="text" id="input-gear-notes" placeholder="e.g. Repaired trekking pole tip, picked up 5 days food" value="${form.metrics?.gearNotes || ''}" />
                  </div>
                </div>
              </section>

            </form>
          </div>

          <!-- Right Column: Live Card Preview -->
          <div class="author-preview-col">
            <div class="preview-sticky-container">
              <div class="preview-header">
                <span class="preview-badge">👁️ Live Interactive Preview</span>
                <span class="preview-style-indicator">Format: ${form.layoutStyle.toUpperCase()}</span>
              </div>
              <div class="preview-card-wrapper" id="author-live-preview">
                <!-- Dynamically rendered -->
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners(container);
    this.updateLivePreview();
  }

  renderAttachedPhotos(photos = []) {
    if (photos.length === 0) {
      return `<p class="no-photos-msg">No photos attached yet. Add a URL or choose a preset above.</p>`;
    }

    return photos.map((p, idx) => `
      <div class="attached-photo-item">
        <img src="${p.url}" alt="${p.caption || 'Attached'}" />
        <div class="attached-photo-info">
          <span class="attached-photo-caption">${p.caption || 'No caption'}</span>
        </div>
        <button type="button" class="btn-remove-photo" data-index="${idx}" title="Remove photo">×</button>
      </div>
    `).join('');
  }

  attachEventListeners(container) {
    // Back Button
    const backBtn = container.querySelector('#btn-author-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        store.setScreen('explorer');
      });
    }

    // Save Button
    const saveBtn = container.querySelector('#btn-author-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.handleSave());
    }

    // Delete Button
    const delBtn = container.querySelector('#btn-author-delete');
    if (delBtn) {
      delBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this trail entry?')) {
          store.deleteMoment(this.editingId);
        }
      });
    }

    // Landmark Preset Selection
    const landmarkSelect = container.querySelector('#input-landmark-preset');
    if (landmarkSelect) {
      landmarkSelect.addEventListener('change', (e) => {
        const selected = landmarkSelect.options[landmarkSelect.selectedIndex];
        if (selected.value) {
          const mile = parseFloat(selected.value);
          const elev = parseInt(selected.dataset.elev, 10);
          const name = selected.dataset.name;

          this.formData.mileMarker = mile;
          this.formData.elevationFt = elev;
          this.formData.locationName = name;

          const mileInput = container.querySelector('#input-mile');
          const elevInput = container.querySelector('#input-elev');
          const locInput = container.querySelector('#input-location');

          if (mileInput) mileInput.value = mile;
          if (elevInput) elevInput.value = elev;
          if (locInput) locInput.value = name;

          this.syncFormState();
        }
      });
    }

    // Inputs Live Sync
    const liveInputs = [
      '#input-title', '#input-date', '#input-day', '#input-mile',
      '#input-elev', '#input-location', '#input-category', '#input-layout',
      '#input-quote', '#input-story', '#input-temp', '#input-condition',
      '#input-water', '#input-pack', '#input-day-mileage', '#input-gear-notes'
    ];

    liveInputs.forEach(selector => {
      const input = container.querySelector(selector);
      if (input) {
        input.addEventListener('input', () => this.syncFormState());
        input.addEventListener('change', () => this.syncFormState());
      }
    });

    // Add Photo URL Button
    const addPhotoBtn = container.querySelector('#btn-add-photo-url');
    if (addPhotoBtn) {
      addPhotoBtn.addEventListener('click', () => {
        const urlInput = container.querySelector('#input-photo-url');
        const capInput = container.querySelector('#input-photo-caption');
        if (urlInput && urlInput.value.trim()) {
          this.formData.photos.push({
            id: 'p-' + Date.now(),
            url: urlInput.value.trim(),
            caption: capInput.value.trim() || 'Trail photo'
          });
          urlInput.value = '';
          capInput.value = '';
          this.refreshPhotoList(container);
          this.updateLivePreview();
        }
      });
    }

    // Preset Photo Buttons
    const presetBtns = container.querySelectorAll('.btn-preset');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.formData.photos.push({
          id: 'p-' + Date.now(),
          url: btn.dataset.url,
          caption: btn.dataset.caption
        });
        this.refreshPhotoList(container);
        this.updateLivePreview();
      });
    });

    // Upload Local File
    const fileInput = container.querySelector('#input-photo-file');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.formData.photos.push({
              id: 'p-' + Date.now(),
              url: event.target.result,
              caption: file.name
            });
            this.refreshPhotoList(container);
            this.updateLivePreview();
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Remove photo delegation
    const photosList = container.querySelector('#attached-photos-list');
    if (photosList) {
      photosList.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.btn-remove-photo');
        if (removeBtn) {
          const idx = parseInt(removeBtn.dataset.index, 10);
          this.formData.photos.splice(idx, 1);
          this.refreshPhotoList(container);
          this.updateLivePreview();
        }
      });
    }
  }

  refreshPhotoList(container) {
    const listEl = container.querySelector('#attached-photos-list');
    if (listEl) {
      listEl.innerHTML = this.renderAttachedPhotos(this.formData.photos);
    }
  }

  syncFormState() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    this.formData.title = container.querySelector('#input-title')?.value || '';
    this.formData.date = container.querySelector('#input-date')?.value || '';
    this.formData.dayNumber = parseInt(container.querySelector('#input-day')?.value || '1', 10);
    this.formData.mileMarker = parseFloat(container.querySelector('#input-mile')?.value || '0');
    this.formData.elevationFt = parseInt(container.querySelector('#input-elev')?.value || '180', 10);
    this.formData.locationName = container.querySelector('#input-location')?.value || '';
    this.formData.category = container.querySelector('#input-category')?.value || 'reflection';
    this.formData.layoutStyle = container.querySelector('#input-layout')?.value || 'story';
    this.formData.quote = container.querySelector('#input-quote')?.value || '';
    this.formData.story = container.querySelector('#input-story')?.value || '';

    this.formData.metrics = {
      tempF: parseInt(container.querySelector('#input-temp')?.value || '68', 10),
      condition: container.querySelector('#input-condition')?.value || '',
      waterSource: container.querySelector('#input-water')?.value || '',
      packWeightLbs: parseFloat(container.querySelector('#input-pack')?.value || '26'),
      dayMileage: parseFloat(container.querySelector('#input-day-mileage')?.value || '20'),
      gearNotes: container.querySelector('#input-gear-notes')?.value || ''
    };

    const styleIndicator = container.querySelector('.preview-style-indicator');
    if (styleIndicator) {
      styleIndicator.textContent = `Format: ${this.formData.layoutStyle.toUpperCase()}`;
    }

    this.updateLivePreview();
  }

  updateLivePreview() {
    const previewEl = document.getElementById('author-live-preview');
    if (!previewEl) return;

    const m = this.formData;
    const heroPhoto = m.photos && m.photos.length > 0 ? m.photos[0] : null;

    let bodyHtml = '';
    if (m.layoutStyle === 'minimal') {
      bodyHtml = `
        <div class="minimal-layout-content">
          ${m.quote ? `<blockquote class="minimal-lead-quote">“${m.quote}”</blockquote>` : ''}
          ${heroPhoto ? `
            <div class="minimal-hero-container">
              <img src="${heroPhoto.url}" alt="${heroPhoto.caption || 'Preview'}" />
            </div>
          ` : ''}
          <div class="moment-story-text minimal-body">
            <p>${m.story || 'Your reflection story will appear here...'}</p>
          </div>
        </div>
      `;
    } else if (m.layoutStyle === 'fieldlog') {
      bodyHtml = `
        <div class="fieldlog-layout-content">
          <div class="fieldlog-grid">
            <div class="field-cell"><div class="field-label">Weather</div><div class="field-value">${m.metrics?.tempF || 68}°F · ${m.metrics?.condition || 'Clear'}</div></div>
            <div class="field-cell"><div class="field-label">Water</div><div class="field-value">${m.metrics?.waterSource || 'Stream on trail'}</div></div>
            <div class="field-cell"><div class="field-label">Pack Weight</div><div class="field-value">${m.metrics?.packWeightLbs || 26} lbs</div></div>
            <div class="field-cell"><div class="field-label">Day Miles</div><div class="field-value">${m.metrics?.dayMileage || 22} mi</div></div>
          </div>
          <div class="moment-story-text fieldlog-text">
            <p>${m.story || 'Your field log notes will appear here...'}</p>
          </div>
          ${heroPhoto ? `
            <div class="fieldlog-photo-strip">
              <div class="fieldlog-photo-item"><img src="${heroPhoto.url}" alt="Preview" /></div>
            </div>
          ` : ''}
        </div>
      `;
    } else {
      // Story layout
      bodyHtml = `
        <div class="story-layout-content">
          ${heroPhoto ? `
            <div class="detail-gallery">
              <div class="gallery-main-view">
                <img src="${heroPhoto.url}" alt="${heroPhoto.caption || 'Preview'}" />
                ${heroPhoto.caption ? `<div class="photo-caption">${heroPhoto.caption}</div>` : ''}
              </div>
            </div>
          ` : ''}
          ${m.quote ? `<blockquote class="detail-pull-quote">"${m.quote}"</blockquote>` : ''}
          <div class="moment-story-text">
            <p>${m.story ? m.story.replace(/\n\n/g, '</p><p>') : 'Your narrative story will appear here...'}</p>
          </div>
        </div>
      `;
    }

    previewEl.innerHTML = `
      <article class="detail-card layout-${m.layoutStyle} category-${m.category}">
        <header class="detail-card-header">
          <div class="header-badges">
            <span class="badge badge-category badge-cat-${m.category}">
              ${this.getCategoryIcon(m.category)} ${m.category.toUpperCase()}
            </span>
            <span class="badge badge-section">
              SOBO Mile ${m.mileMarker.toFixed(1)}
            </span>
          </div>
        </header>

        <div class="detail-card-body">
          <div class="moment-headline-group">
            <div class="moment-meta-row">
              <span class="meta-date">📅 ${m.date || 'Today'}</span>
              <span class="meta-day">Day ${m.dayNumber}</span>
              <span class="meta-location">📍 ${m.locationName || 'Trail Location'}</span>
            </div>
            <h1 class="moment-title">${m.title || 'Untitled Moment'}</h1>
          </div>
          ${bodyHtml}
        </div>
      </article>
    `;
  }

  handleSave() {
    this.syncFormState();

    if (!this.formData.title.trim()) {
      alert('Please provide a title for your trail moment.');
      return;
    }

    if (this.isEditing && this.editingId) {
      store.updateMoment(this.editingId, this.formData);
    } else {
      store.addMoment(this.formData);
    }
  }

  getCategoryIcon(cat) {
    const icons = {
      campsite: '⛺',
      milestone: '🏔️',
      resupply: '🍕',
      wildlife: '🐻',
      hardship: '⚡',
      reflection: '📖'
    };
    return icons[cat] || '📍';
  }
}
