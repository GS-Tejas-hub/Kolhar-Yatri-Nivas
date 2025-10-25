Kolhar Yatri Nivas

Frontend-only React app (Vite) with Tailwind via CDN. Data is stored in localStorage; initial data is seeded from src/data/lodges.json.

Scripts
- npm run dev — start dev server
- npm run build — build to dist
- npm run preview — preview built app

Vercel
- Build command: npm run build
- Output directory: dist
- SPA rewrite is configured in vercel.json

Re-seed lodges
- In the browser console run localStorage.removeItem('kyn_lodges') and refresh, or use Manage Lodges → Import Seed / Import JSON.

