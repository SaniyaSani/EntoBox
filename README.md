# EntoKit website

This folder contains a complete static version of the EntoKit portal. It can be
published free of charge with GitHub Pages and does not need Python, Streamlit,
Node.js, a database, or a paid server.

## Files

- `index.html` — the website content and links
- `styles.css` — colours, layout, animations and mobile styling
- `pinned-beetle.png` — the specimen illustration
- `.nojekyll` — tells GitHub Pages to serve the files directly

## Publish it on GitHub Pages

1. Sign in to GitHub.
2. Click the `+` in the upper-right corner and choose **New repository**.
3. Name the repository `EntoKit`.
4. Select **Public** and create the repository.
5. In the empty repository choose **Add file → Upload files**.
6. Upload the *contents* of this folder: `index.html`, `styles.css`,
   `pinned-beetle.png`, `.nojekyll`, and `README.md`.
7. At the bottom of the page click **Commit changes**.
8. Open **Settings → Pages**.
9. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
10. Select branch **main**, folder **/(root)**, and click **Save**.

GitHub will show the website address in the Pages settings when publishing is
complete.

## Replace the GitHub button

Open `index.html`, search for:

`https://github.com/YOUR-GITHUB-USERNAME/EntoKit`

Replace `YOUR-GITHUB-USERNAME` with your actual GitHub username, then commit the
change.

## Update tool links later

Search `index.html` for the tool name. Replace its `href="..."` value with the
new application address. Tools marked as planned do not have clickable links
yet.

## License


EntoKit is licensed under the **PolyForm Noncommercial License 1.0.0**.

You may use, study, modify and distribute the software for permitted non-commercial purposes.

Commercial use, including the incorporation of EntoKit or substantial portions of its code into paid products, commercial services or other commercial projects, requires prior written permission from the copyright holder.

For commercial licensing inquiries, please contact Sanny.

Copyright © 2026 Sanny (SaniyaSani).

