/**
 * DAM HIKES - Compose Update Form Component
 */

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
  }

  init() {
    this.render();
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const today = new Date().toISOString().split('T')[0];

    container.innerHTML = `
      <form id="compose-trail-form" class="compose-form-stack">
        <div class="form-grid-2">
          <div class="form-field">
            <label for="compose-date">Date</label>
            <input id="compose-date" name="date" type="date" required value="${today}" />
          </div>
          <div class="form-field">
            <label for="compose-mile">PCT Mile (NOBO Marker)</label>
            <input id="compose-mile" name="mile" type="number" min="0" max="2650" step="0.1" required value="2150" />
          </div>
        </div>

        <div class="form-field">
          <label for="compose-location">Location</label>
          <input id="compose-location" name="location" required placeholder="Timberline Lodge, OR" maxlength="80" />
        </div>

        <div class="form-field">
          <label for="compose-title">Title</label>
          <input id="compose-title" name="title" required placeholder="What happened today?" maxlength="80" />
        </div>

        <div class="form-field">
          <label for="compose-body">Notes & Reflections</label>
          <textarea id="compose-body" name="body" rows="6" required placeholder="Write your journal entry here..."></textarea>
        </div>

        <div class="form-field">
          <label for="compose-photos">Photos (Choose image files)</label>
          <input id="compose-photos" name="photos" type="file" accept="image/*" multiple />
        </div>

        <button type="submit" id="btn-submit-update" class="btn-compose-submit">
          Share Update
        </button>
      </form>
    `;

    this.attachEvents(container);
  }

  attachEvents(container) {
    const form = container.querySelector('#compose-trail-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (this.busy) return;

      const submitBtn = form.querySelector('#btn-submit-update');
      this.busy = true;
      submitBtn.textContent = 'Compressing & saving…';
      submitBtn.disabled = true;

      try {
        const date = form.querySelector('#compose-date').value;
        const mile = parseFloat(form.querySelector('#compose-mile').value);
        const location = form.querySelector('#compose-location').value;
        const title = form.querySelector('#compose-title').value;
        const body = form.querySelector('#compose-body').value;
        const fileInput = form.querySelector('#compose-photos');

        const files = Array.from(fileInput.files || []).filter(f => f.size > 0);
        const photos = [];

        for (const file of files.slice(0, 6)) {
          const dataUrl = await compressImage(file);
          photos.push({
            src: dataUrl,
            alt: location || 'Trail photograph'
          });
        }

        // If no photo was uploaded, attach default scenic trail placeholder
        if (photos.length === 0) {
          photos.push({
            src: 'photos/canopy.jpg',
            alt: location
          });
        }

        store.addEntry({
          date,
          mile,
          location,
          title,
          body,
          photos
        });

        form.reset();
      } catch (err) {
        alert('Could not save update: ' + err.message);
      } finally {
        this.busy = false;
        submitBtn.textContent = 'Share Update';
        submitBtn.disabled = false;
      }
    });
  }
}
