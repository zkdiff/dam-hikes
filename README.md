# DAM Hikes

> **DAM Hikes** is a visual, map-first digital journal of Daniel Armando Martinez's 2,150-mile southbound (SOBO) hike along the Pacific Crest Trail from Cascade Locks (Bridge of the Gods, Oregon) to Campo (US/Mexico Border, California).

## Features

- **Map-First Route & Timeline**: Synchronous Leaflet map displaying the actual PCT route with dynamic trail splitting (completed vs. remaining trail).
- **6 Moment Categories**: ⛺ Campsites, 🏔️ Milestones & High Passes, 🍕 Town Resupply & Trail Magic, 🐻 Wildlife & Flora, ⚡ Hardships & Conditions, 📖 Journal Reflections.
- **3 Adaptive Display Formats**: Rich Story (narrative + gallery + lightbox), Minimalist (pull quote + hero photo), and Field Log (structured metrics grid).
- **Interactive Elevation Profile**: 2D Canvas profile with real-time scrubber linked to the map.
- **Discrete Author Screen**: Full-page entry composer with live card preview and photo attachments.
- **Overview & Data Portability**: Thru-hike statistics, section breakdown, gear list, and JSON Export/Import tools.
- **Topographic Editorial Aesthetic**: Warm Parchment (Light) and Alpine Slate (Dark) themes.

## Running Locally

To run the application locally, start any static file server from this directory:

```bash
# Python 3
python3 -m http.server 3000

# or Node
npx -y serve .
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
