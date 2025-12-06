# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Aertrip Flight Finder - Notes

How to run locally:

1. Install dependencies:

```powershell
npm install
```

2. Install Redux Toolkit and React-Redux (if not present):

```powershell
npm install @reduxjs/toolkit react-redux
```

3. (Tailwind already included in `package.json`) If you haven't set up Tailwind for this repo, follow Tailwind + Vite docs. For a quick start run:

```powershell
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

4. Start dev server:

```powershell
npm run dev
```

Where to put your flights JSON:

- Place your full JSON file (the long static file provided by the assignment) into `public/data/flights.json`.
- The app fetches `/data/flights.json` so anything inside `public` is served directly.

Assumptions and tradeoffs:

- I used Redux Toolkit for predictable state and easy testing.
- The price slider is implemented with two numeric inputs for simplicity; this is reliable and easier to test across browsers. You can replace with a dual-range UI library later.
- The project uses local JSON served from `public/data/flights.json` to avoid CORS and server setup.

Next steps you might want me to do:

- Replace numeric inputs with a dual-range slider UI.
- Add tests for reducers and components.
- Add more filter options (departure/arrival time windows, stops, airlines).

