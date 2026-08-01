# EntoBox V3.5 — Collection Home & Spatial Map

EntoBox is a local-first prototype for navigating storage hierarchies and mapping physical specimens inside entomological boxes.

## New in V3.5

- A real **Home** screen restores the whole-collection overview.
- Collection health shows condition counts, active alerts, unassessed records, and placement backlog.
- Alerts are actionable: click one to open the exact box and highlight the affected specimen.
- Collection overview cards show every box, its complete storage path, placed records, placement-tray backlog, zones, and alerts.
- Summary cards open all records, unidentified records, unplaced records, alerts, boxes, or the editable storage structure.
- The Home button and EntoBox logo return to the dashboard without losing the current box.
- The full-screen spatial box workflow, free-form pins, zones, spreadsheet import, and editable hierarchy from V3.4 remain available.

## Open locally

Open `index.html` in a current Chromium, Safari, or Firefox browser. For PWA features, serve the folder over HTTPS or a local development server.

## Prototype limitation

Data and compressed preview images are stored in the browser's local storage. Export a JSON backup regularly. A production multi-user deployment should use PostgreSQL/Supabase and object storage for images.
