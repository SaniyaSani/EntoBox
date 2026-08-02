# EntoBox V4.5 — Beta Bugfix Edition

EntoBox is a local-first spatial collection tool for answering a deceptively difficult question: **where, physically, is this specimen?**

It connects a storage hierarchy (building → room → cabinet → drawer → box) with photographs of real boxes, free-form pin positions, placement zones, specimen records, and actionable collection-care alerts.

## What V4 includes

### Guided first use
- First-run choice: create a collection, explore the demo, or restore a backup.
- Four-step collection setup wizard with optional storage depth.
- Five-step guided tour through Home, spatial boxes, safe editing, spreadsheet placement, and alerts.
- A Getting Started checklist on Collection Home.

### Safer spatial work
- **Browse** mode prevents accidental specimen movement.
- **Arrange** mode unlocks placement, dragging, zones, and box-photo changes.
- Zoom from 50–300%, Fit, 100%, locate selected specimen, pan, and minimap navigation.
- Free-form specimen footprints remain horizontal and readable.

### Spreadsheet placement workflow
- Import `.xlsx`, `.csv`, or `.tsv` into a box-specific placement tray.
- Choose the spreadsheet header row from a table preview.
- Assemble scientific names from several columns (for example Genus + specific epithet + subspecies).
- All mappings and identification fields are optional.
- Filter, multi-select, bulk-size, assign a preferred zone, auto-place, skip for now, and finish a placement session.

### Collection care and records
- Dedicated Alerts Centre with category, severity, status, search, exact-location navigation, resolution notes, and history.
- Structured specimen view: Identity, Collection event, Physical storage, Condition & alerts, Media, and recent activity.
- Collection Home shows health, alerts, unfinished work, storage, and boxes.

### Local-data safety
- Saved-locally timestamp.
- Undo history for recent actions.
- Recoverable trash for specimens, zones, boxes, and storage locations.
- Automatic pre-import snapshot.
- Validated JSON restore with a preview and replacement confirmation.
- Feedback form that excludes specimen fields and photographs from technical context.
- In-memory diagnostics for 100, 1,000, and 10,000 records.

## Important beta limitation

V4 stores collection data and compressed image previews **only in this browser**. It does not yet provide accounts, cloud sync, multi-user roles, institutional backups, AI identification, loan management, or data publication integrations.

Download JSON backups regularly, especially before clearing browser data or moving to another device.

## GitHub Pages deployment

The ZIP is GitHub-ready: place the extracted contents directly in the repository root so that the structure starts with:

```text
index.html
app.js
styles.css
manifest.webmanifest
sw.js
assets/
```

Then set GitHub Pages to:

```text
Source: Deploy from a branch
Branch: main
Folder: / (root)
```

Do not upload one extra wrapper folder around `index.html`.

## Open locally

Open `index.html` directly for basic testing. Camera, installability, service-worker caching, and the best PWA behavior require HTTPS (for example GitHub Pages) or a local HTTP development server.

## Suggested beta-test task

Ask a tester to:

1. Create one collection and one box.
2. Import ten specimen records.
3. Place them on a box photograph.
4. Find one specimen again.
5. Report and resolve one condition issue.
6. Export a backup and send feedback.

A tester completing that without live explanation is the main V4 success criterion.


## V4.5 bug fixes
- Fixed the **Add specimen** button in the box Details panel.
- Raised dialogs above the guided-tour overlay so modal buttons remain clickable.
- Prevented highlighted tour targets from intercepting the tour controls.
- Corrected singular/plural counts for specimens and placement-tray records.
- Kept the thin box-frame and corrected centering/navigation changes from V4.5.

## Smoke-tested workflows
The build was automatically exercised in Chromium for launch choices, demo loading, guided-tour controls, box opening, adding to tray, add-and-place, Fit/Center, CSV/XLSX import, storage creation, box creation, alerts, About, and Feedback.
