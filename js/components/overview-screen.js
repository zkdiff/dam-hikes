/**
 * DAM HIKES - About The Hike, Hiker Bio, Gear List & Data Backup Panel
 */

import { store } from '../state.js';

export const GEAR = [
  {
    id: "pack",
    label: "Pack",
    items: [
      { name: "Pack", spec: "Hyperlite Southwest 40", oz: 28.6 },
      { name: "Shoulder pocket", spec: "Ultralight water bottle holster", oz: 1.1 },
      { name: "Stuff sacks", spec: "3× cuben / nylon mix", oz: 2.4 },
    ],
  },
  {
    id: "shelter",
    label: "Shelter",
    items: [
      { name: "Tent", spec: "Durston X-Mid 1 Pro", oz: 17.3 },
      { name: "Stakes", spec: "6× shepherd + 2 extras", oz: 2.6 },
      { name: "Ground sheet", spec: "Polycryo half", oz: 1.8 },
    ],
  },
  {
    id: "sleep",
    label: "Sleep",
    items: [
      { name: "Quilt", spec: "EE Revelation 20°F, regular", oz: 20.4 },
      { name: "Pad", spec: "Therm-a-Rest NeoAir XLite NXT", oz: 13.0 },
      { name: "Pillow", spec: "Inflatable + stuff sack", oz: 1.9 },
    ],
  },
  {
    id: "cook",
    label: "Cook",
    items: [
      { name: "Stove", spec: "Soto Windmaster", oz: 3.0 },
      { name: "Pot", spec: "Toaks 550 ml titanium", oz: 2.6 },
      { name: "Spork", spec: "Titanium long-handle", oz: 0.6 },
      { name: "Canister", spec: "110 g isobutane (carried)", oz: 7.4 },
    ],
  },
  {
    id: "water",
    label: "Water",
    items: [
      { name: "Filter", spec: "Sawyer Squeeze + CNOC 2L", oz: 4.2 },
      { name: "Bottles", spec: "2× Smartwater 1 L", oz: 2.6 },
      { name: "Backflush", spec: "Syringe", oz: 1.1 },
    ],
  },
  {
    id: "worn",
    label: "Worn",
    items: [
      { name: "Shoes", spec: "Altra Lone Peak 8", oz: 0, worn: true },
      { name: "Socks", spec: "Darn Tough 1/4", oz: 0, worn: true },
      { name: "Shorts", spec: "Patagonia Terrebonne", oz: 0, worn: true },
      { name: "Sun hoodie", spec: "Patagonia Capilene", oz: 0, worn: true },
      { name: "Hat", spec: "Sunday Afternoons Adventure", oz: 0, worn: true },
    ],
  },
  {
    id: "clothing",
    label: "Carried clothing",
    items: [
      { name: "Puffy", spec: "Enlightened Equipment Torrid", oz: 8.4 },
      { name: "Rain jacket", spec: "Frogg Toggs Ultra-Lite2", oz: 5.6 },
      { name: "Rain skirt", spec: "DIY silpoly", oz: 1.8 },
      { name: "Sleep clothes", spec: "Merino tee + long johns", oz: 6.2 },
      { name: "Gloves / beanie", spec: "Lightweight pair", oz: 2.4 },
      { name: "Extra socks", spec: "2 pair Darn Tough", oz: 3.6 },
    ],
  },
  {
    id: "electronics",
    label: "Electronics",
    items: [
      { name: "Phone", spec: "In a ziplock, FarOut + Gaia", oz: 7.2 },
      { name: "Power bank", spec: "Anker 10k", oz: 6.7 },
      { name: "Cables / plug", spec: "USB-C kit", oz: 1.8 },
      { name: "Headlamp", spec: "Nitecore NU25 UL", oz: 1.6 },
      { name: "Tracker", spec: "Garmin inReach Mini 2", oz: 3.5 },
    ],
  },
  {
    id: "kit",
    label: "Small kit",
    items: [
      { name: "First aid", spec: "Leukotape, ibuprofen, repair", oz: 3.2 },
      { name: "Hygiene", spec: "Trowel, soap, toothbrush", oz: 2.8 },
      { name: "Sun / bugs", spec: "Sunscreen stick + 30% DEET", oz: 2.1 },
      { name: "Knife / light", spec: "Tiny SAK + bic", oz: 1.4 },
      { name: "Wallet / ID", spec: "Permit, cards, cash", oz: 1.2 },
    ],
  },
];

function packWeightOz(groups = GEAR) {
  return groups.reduce(
    (sum, g) => sum + g.items.reduce((s, item) => s + (item.worn ? 0 : item.oz), 0),
    0
  );
}

function ozToLb(oz) {
  return `${(oz / 16).toFixed(1)} lb`;
}

export class OverviewScreen {
  constructor(containerId) {
    this.containerId = containerId;
  }

  init() {
    this.render();
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const packOz = packWeightOz();

    container.innerHTML = `
      <div style="padding-bottom: 24px;">
        <img src="photos/hiker-back.jpg" alt="Walking south into the Oregon woods" class="about-hero-img" />
        
        <div class="about-intro-text">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <h3 style="font-family: var(--font-display); font-size: 20px; color: var(--color-fg);">Daniel Armando Martinez (DAM)</h3>
            <span style="font-size: 11px; font-family: var(--font-mono); background: rgba(228, 220, 203, 0.1); padding: 2px 8px; border-radius: 4px; color: var(--color-paper);">SOBO 2026</span>
          </div>
          <p>
            Walking the PCT south from Cascade Locks — mile 2150 — toward Campo.
            Start is 14 August 2026.
          </p>
          <p>
            This feed is for family, friends, and the trail community. I post whenever I hit cell signal. If a few days go quiet, I am between mountain passes, not lost.
          </p>
        </div>

        <!-- Key Stats Grid -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 16px;">
          <div style="background: var(--color-bg); padding: 8px; border-radius: 6px; border: 1px solid var(--color-border); text-align: center;">
            <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 700; color: var(--color-fg);">2,150</div>
            <div style="font-size: 10px; text-transform: uppercase; color: var(--color-muted);">Total Miles</div>
          </div>
          <div style="background: var(--color-bg); padding: 8px; border-radius: 6px; border: 1px solid var(--color-border); text-align: center;">
            <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 700; color: var(--color-trail);">13,200'</div>
            <div style="font-size: 10px; text-transform: uppercase; color: var(--color-muted);">Forester Zenith</div>
          </div>
          <div style="background: var(--color-bg); padding: 8px; border-radius: 6px; border: 1px solid var(--color-border); text-align: center;">
            <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 700; color: var(--color-fg);">420k+</div>
            <div style="font-size: 10px; text-transform: uppercase; color: var(--color-muted);">Elevation Gain</div>
          </div>
        </div>

        <!-- Gear Breakdown -->
        <div class="gear-header-row">
          <div>
            <p class="gear-base-label">Base weight</p>
            <h3 class="gear-base-title">Gear List</h3>
          </div>
          <p class="gear-base-weight">${ozToLb(packOz)}</p>
        </div>
        <p class="gear-subtitle-note">
          Worn clothing is not counted in base weight. Food and water change every carry.
        </p>

        <div class="gear-groups-stack">
          ${GEAR.map(group => {
            const subtotal = group.items.reduce((s, item) => s + (item.worn ? 0 : item.oz), 0);
            return `
              <section>
                <div class="gear-group-header">
                  <h4 class="gear-group-title">${group.label}</h4>
                  <span class="gear-group-oz">${subtotal > 0 ? `${subtotal.toFixed(1)} oz` : 'worn'}</span>
                </div>
                <ul class="gear-items-list">
                  ${group.items.map(item => `
                    <li class="gear-item-row">
                      <span class="gear-item-name">
                        ${item.name}
                        <span class="gear-item-spec"> · ${item.spec}</span>
                      </span>
                      <span class="gear-item-weight">${item.worn ? '—' : `${item.oz.toFixed(1)}`}</span>
                    </li>
                  `).join('')}
                </ul>
              </section>
            `;
          }).join('')}
        </div>

        <!-- Data Backup & Reset Actions -->
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--color-border);">
          <h4 style="font-family: var(--font-display); font-size: 16px; color: var(--color-fg); margin-bottom: 8px;">💾 Data Backup & Portability</h4>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" id="btn-export-journal-json" style="padding: 8px 12px; border-radius: 6px; background: var(--color-primary); color: var(--color-primary-fg); font-size: 13px; font-weight: 600;">
              Export Journal (JSON)
            </button>
            <label style="padding: 8px 12px; border-radius: 6px; background: rgba(228, 220, 203, 0.1); border: 1px solid var(--color-border); color: var(--color-fg); font-size: 13px; font-weight: 600; cursor: pointer;">
              Import Backup
              <input type="file" id="input-import-journal-json" accept=".json" style="display: none;" />
            </label>
            <button type="button" id="btn-reset-journal-seed" style="padding: 8px 12px; border-radius: 6px; background: transparent; border: 1px solid #EF4444; color: #EF4444; font-size: 13px; font-weight: 600;">
              Reset to 24 Moments
            </button>
          </div>
        </div>
      </div>
    `;

    this.attachEvents(container);
  }

  attachEvents(container) {
    // Export JSON
    container.querySelector('#btn-export-journal-json')?.addEventListener('click', () => {
      store.exportJSON();
    });

    // Import JSON
    container.querySelector('#input-import-journal-json')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const res = store.importJSON(event.target.result);
          if (res.success) {
            alert(`Imported ${res.count} trail moments!`);
            store.setSheet(null);
          } else {
            alert('Import error: ' + res.error);
          }
        };
        reader.readAsText(file);
      }
    });

    // Reset to Defaults
    container.querySelector('#btn-reset-journal-seed')?.addEventListener('click', () => {
      if (confirm('Reset journal to original 24 authentic trail moments?')) {
        store.resetToDefaults();
        alert('Reset complete!');
        store.setSheet(null);
      }
    });
  }
}
