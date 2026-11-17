# Local dev example for mui-apple

This folder is **not published to npm**. Only the root `dist/` and `README.md` are included in the package (`files` in package.json).

**Run the example:**

1. From repo root, build the lib: `pnpm build`
2. Install example deps (once): `cd example && pnpm install`
3. Start the dev server: `pnpm dev` (from `example/`) or from root: `pnpm run example`

After changing the library, run `pnpm build` again from root (or run `pnpm dev` in root in another terminal for watch mode).
