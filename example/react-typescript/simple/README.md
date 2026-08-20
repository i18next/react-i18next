# react-i18next TypeScript example (simple)

A minimal React + TypeScript app showing fully type-safe `t()` calls with react-i18next. The `CustomTypeOptions` declaration lives in `src/@types/i18next.d.ts` and is fed by `src/@types/resources.ts`, which is generated from the `src/i18n/en` JSON files via `npm run i18next-resources-for-ts`.

This project uses [Vite](https://vite.dev).

## Available Scripts

- `npm start` (or `npm run dev`): start the dev server at [http://localhost:5173](http://localhost:5173)
- `npm run build`: type-check and production build into `dist/`
- `npm run preview`: serve the production build locally
- `npm run typecheck`: run `tsc --noEmit`
- `npm run i18next-resources-for-ts`: regenerate `src/@types/resources.ts` from `src/i18n/en`
