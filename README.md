# EntoBox V3.6 — Start Your Collection

EntoBox is a local-first prototype for navigating storage hierarchies and mapping physical specimens inside entomological boxes.

## New in V3.6

- A first-run welcome screen offers **Start a new collection**, **Explore the demo**, or **Restore a backup**.
- A clean collection contains no sample buildings, boxes, specimens, alerts, zones, or placement records.
- **Collection setup** lets users rename their collection, start over, restore JSON, reload the demo, or export a backup.
- Destructive replacement requires explicit confirmation, and a backup can be downloaded first.
- Demo workspaces are visibly labelled and include a direct **Start your own collection** action.
- Empty collections guide users directly into creating their first storage location and specimen box.

## Open locally

Open `index.html` in a current Chromium, Safari, or Firefox browser. For PWA features, serve the folder over HTTPS or a local development server.

## Local-first behavior

Data and compressed preview images are stored in the browser's local storage. Each browser/device has its own workspace. Export a JSON backup regularly. A production multi-user deployment should use PostgreSQL/Supabase and object storage for images.
