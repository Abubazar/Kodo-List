# Kodo List 🗒️

A minimalist, canvas-based to-do list. Instead of a plain list, tasks are rendered as connected nodes on a canvas — built with plain HTML, CSS, and JavaScript, no frameworks or build tools required.

**Live demo:** [kodo-list.netlify.app](https://kodo-list.netlify.app/)

---

## Features

- **Canvas-based UI** — todos are drawn as nodes on an HTML5 `<canvas>` rather than a plain HTML list
- **Add ToDo** — create new tasks through a simple modal dialog
- **Edit ToDo** — select a node to edit its title or mark it as **Done** from the side panel
- **Delete ToDo** — remove tasks you no longer need
- **Light / Dark theme toggle** (☀ button) — powered by CSS custom properties, so the whole UI re-themes instantly
- **Zero dependencies** — no frameworks, bundlers, or `package.json`; it's just static files

## Tech Stack

- HTML5 (Canvas API)
- Vanilla JavaScript (ES6+)
- CSS custom properties (variables) for theming
- No build step — plain static site

## Project Structure

```
Kodo-List/
├── index.html          # App shell, layout markup, and all styling
├── script.js           # Core app logic — dialog handling, todo CRUD, UI wiring
└── canvas.js           # Canvas rendering — draws todo nodes and their connections
```

## Getting Started

This is a static site — no installation or build step needed.

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abubazar/Kodo-List.git
   cd Kodo-List
   ```

2. **Run it**

   Simplest option — just open `index.html` directly in your browser:
   ```bash
   open index.html      # macOS
   start index.html     # Windows
   ```

   Or serve it locally (recommended, avoids any file:// quirks):
   ```bash
   npx serve .
   # or
   python3 -m http.server
   ```

3. Visit the local address shown in your terminal (e.g. `http://localhost:3000` or `http://localhost:8000`).

## Usage

1. Click **+ Add ToDo** to open the dialog.
2. Type what you need to do and hit **Create** (or **Cancel** to back out).
3. Click a node on the canvas to select it — its details appear in the side panel, where you can:
   - Edit the title
   - Check **Done** to mark it complete
   - Click **Delete ToDo** to remove it
4. Toggle the ☀ button in the top-right of the panel to switch between light and dark themes.
