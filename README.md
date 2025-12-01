# Etsy Replica

Pixel-aligned replica of Etsy.com's holiday storefront with dynamic content injection hooks and a lightweight Flask backend.

## 📁 Project Structure
```
/
├── index.html
├── categories.html
├── gifts.html
├── cyber-specials.html
├── home-favorites.html
├── fashion-finds.html
├── registry.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── data/
│   ├── products.json
│   └── deals.json
├── images/
│   └── .gitkeep
├── docs/
│   └── site-analysis.yaml
├── server.py
├── metadata.py
├── entity.py
└── README.md
```

## ✨ Key Features
- Pixel-perfect recreation of the Etsy hero, curated interest grids, gift guides, and deal slider using Tailwind + custom CSS.
- Dedicated section pages (`gifts.html`, `home-favorites.html`, etc.) for seamless navigation beyond the homepage screenshot.
- Responsive layout with sticky marketplace header, pill filters, and animated slider controls.
- Mock data sources (`data/*.json`) hydrated on load plus a `window.EtsyReplica.inject()` helper for runtime content injection.
- Flask backend (`server.py`) ready for Agenticverse usage with metadata schema (`metadata.py`) and entity definition (`entity.py`).

## 🧰 Tech Stack
- HTML5 + Tailwind CSS (CDN) + custom CSS tokens
- Vanilla ES6 modules for interactivity & injection helpers
- Flask web server scaffold with Agenticverse integration points

## 🚀 Getting Started
1. **Install dependencies**
   ```bash
   pip install flask agenticverse-entities
   ```
2. **Run the development server**
   ```bash
   python server.py
   ```
   The helper in `start_server` uses Agenticverse's base server runner. If you're outside that environment, simply run:
   ```bash
   flask --app server:create_app run --port 5000
   ```
3. **Open the site**
   Visit `http://localhost:5000/` to browse the homepage and linked sections.

## 🧩 Content Injection
- JSON payloads matching `EtsyReplicaMetadata` can be passed to `start_server(..., content_data=...)` or injected client-side via `window.EtsyReplica.inject(payload)`.
- Injection targets are defined with `data-injection` attributes (e.g., `[data-injection="product-grid"]`, `[data-injection="deal-track"]`).

## ⚠️ Known Limitations
- Images use royalty-free Unsplash placeholders instead of Etsy-owned media.
- Cart/auth flows are static mocks; no actual checkout or API calls occur.
- Local `file://` browsing may block `fetch()` calls. Serve via Flask (or any static server) for full functionality.

## 🧪 Testing & Linting
- Run `python -m compileall .` to confirm Python files parse.
- Use your preferred HTML/CSS/JS linters (e.g., `npx prettier --check .`, `npx eslint js`) before deployment.
