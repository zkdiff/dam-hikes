/**
 * DAM HIKES - Hike Overview, Hiker Bio & Data Management Screen
 */

import { store } from '../state.js';
import { PCT_SECTIONS } from '../data/pct-route.js';

export class OverviewScreen {
  constructor(containerId) {
    this.containerId = containerId;
  }

  init() {
    store.subscribe((s, eventType) => {
      if (eventType === 'screen_change' && store.activeScreen === 'overview') {
        this.render();
      }
    });
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const totalMoments = store.moments.length;
    const completedMoments = store.moments.filter(m => m.mileMarker <= (store.getSelectedMoment()?.mileMarker || 0)).length;

    container.innerHTML = `
      <div class="overview-screen-layout">
        <!-- Top Navigation -->
        <header class="overview-header">
          <button class="btn-secondary" id="btn-overview-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
            <span>Back to Trail Map</span>
          </button>
          <div class="overview-title-group">
            <h2>Hike Overview & Hiker Bio</h2>
            <p class="overview-subtitle">Pacific Crest Trail · Southbound Expedition (SOBO)</p>
          </div>
        </header>

        <div class="overview-content-grid">
          <!-- 1. Hiker Bio Card -->
          <div class="overview-bio-card">
            <div class="bio-avatar-wrapper">
              <div class="bio-avatar-placeholder">DAM</div>
            </div>
            <div class="bio-info">
              <div class="bio-name-row">
                <h3>Daniel Armando Martinez</h3>
                <span class="bio-trail-name">Trail Name: <strong>DAM</strong></span>
              </div>
              <p class="bio-tagline">Southbound PCT Thru-Hiker · Cascade Locks to Campo · 2,150 Miles</p>
              <p class="bio-narrative">
                "Going Southbound (SOBO) means starting in the lush, moss-draped forests of the Pacific Northwest and racing the oncoming winter snowpack through the High Sierra before descending into the Mojave desert. This journal is a map-first living chronicle of the trail, the people, the hardships, and the quiet moments between the mountains."
              </p>
            </div>
          </div>

          <!-- 2. Thru-Hike Key Stats -->
          <div class="overview-stats-grid">
            <div class="stat-card">
              <div class="stat-icon">🥾</div>
              <div class="stat-value">2,150.0</div>
              <div class="stat-label">Total Miles Southbound</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⛰️</div>
              <div class="stat-value">13,200 ft</div>
              <div class="stat-label">Trail Zenith (Forester Pass)</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📈</div>
              <div class="stat-value">420,800+</div>
              <div class="stat-label">Total Elevation Gain (ft)</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📅</div>
              <div class="stat-value">97 Days</div>
              <div class="stat-label">Total Trail Days (4 Zeros)</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📍</div>
              <div class="stat-value">${totalMoments}</div>
              <div class="stat-label">Logged Waypoints & Stories</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🎒</div>
              <div class="stat-value">11.4 lbs</div>
              <div class="stat-label">Average Base Pack Weight</div>
            </div>
          </div>

          <!-- 3. Section Breakdown -->
          <div class="overview-sections-box">
            <h3 class="overview-heading">Trail Sections & Terrains</h3>
            <div class="sections-grid">
              ${PCT_SECTIONS.map(sec => `
                <div class="section-card sec-border-${sec.id}">
                  <div class="sec-header">
                    <span class="sec-name">${sec.name}</span>
                    <span class="sec-miles">Mile ${sec.startMile.toFixed(0)} - ${sec.endMile.toFixed(0)}</span>
                  </div>
                  <p class="sec-desc">${sec.description}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 4. Gear & Resupply Strategy -->
          <div class="overview-gear-box">
            <h3 class="overview-heading">The "Big Three" & Essential Gear</h3>
            <div class="gear-list-grid">
              <div class="gear-item">
                <strong>🎒 Pack:</strong> Gossamer Gear Mariposa 60L (31 oz)
              </div>
              <div class="gear-item">
                <strong>⛺ Shelter:</strong> Zpacks Duplex Dyneema Tent (19 oz)
              </div>
              <div class="gear-item">
                <strong>🛌 Sleep System:</strong> Katabatic Sawatch 15°F Quilt + Therm-a-Rest NeoAir XTherm
              </div>
              <div class="gear-item">
                <strong>👟 Footwear:</strong> Hoka Speedgoat 5 (4 pairs total over 2,150 mi)
              </div>
              <div class="gear-item">
                <strong>🍳 Cookware:</strong> BRS-3000T Titanium Stove + TOAKS 750ml Pot
              </div>
              <div class="gear-item">
                <strong>💧 Filtration:</strong> Sawyer Squeeze + 2L CNOC Vecto Water Bladder
              </div>
            </div>
          </div>

          <!-- 5. Data Backup & Management -->
          <div class="overview-data-management-box">
            <h3 class="overview-heading">💾 Journal Data & Backups</h3>
            <p>Export your trail journal to keep a permanent backup or transfer your entries to another device.</p>
            <div class="data-actions-row">
              <button class="btn-primary" id="btn-export-json">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <span>Export Journal (JSON)</span>
              </button>
              
              <label class="btn-secondary file-upload-label" id="label-import-json">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span>Import Backup</span>
                <input type="file" id="input-import-json" accept=".json" style="display: none;" />
              </label>

              <button class="btn-outline-danger" id="btn-reset-default-data">
                <span>Reset to Seed Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners(container);
  }

  attachEventListeners(container) {
    // Back Button
    const backBtn = container.querySelector('#btn-overview-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        store.setScreen('explorer');
      });
    }

    // Export JSON
    const exportBtn = container.querySelector('#btn-export-json');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        store.exportJSON();
      });
    }

    // Import JSON
    const importInput = container.querySelector('#input-import-json');
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const res = store.importJSON(event.target.result);
            if (res.success) {
              alert(`Successfully imported ${res.count} trail moments!`);
              store.setScreen('explorer');
            } else {
              alert(`Import failed: ${res.error}`);
            }
          };
          reader.readAsText(file);
        }
      });
    }

    // Reset Data
    const resetBtn = container.querySelector('#btn-reset-default-data');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset journal to original seed moments? Custom entries will be replaced.')) {
          store.resetToDefaults();
          alert('Journal reset to default PCT SOBO journey data.');
          store.setScreen('explorer');
        }
      });
    }
  }
}
