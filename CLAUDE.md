# CLAUDE.md — Markdown Visibility

> 👁️ Hide the Markdown noise, keep the writing — a cleaner Obsidian canvas.

An Obsidian community plugin that visually hides Markdown syntax markers (`**`, `#`, `[]`, `` ` ``, `>`, list bullets) in Live Preview while keeping formatted text editable — purely visual, source files untouched. Built in TypeScript, bundled with esbuild. See [README.md](README.md).

## Future Vision

Markdown Visibility becomes the quiet default for writers who want a distraction-free editor without leaving Obsidian's native Live Preview — granular, instant, and invisible until you want it. At its best it feels like the markers were never there: type in clean prose, toggle back to raw syntax in one keystroke, and trust that nothing ever mutates the underlying file.

**How we build it:** stay purely visual and non-destructive — never rewrite the user's Markdown; respect Obsidian's editor lifecycle and CodeMirror decorations, keep the toggle instant and the settings granular, and ship a small, dependency-light bundle — in code we trust.

## Stack & structure

- TypeScript Obsidian plugin; `main.ts` entry, logic in `src/`, styles in `styles.css`.
- Build: esbuild via `esbuild.config.mjs` (`npm run dev` / `npm run build`), type-check with `tsc -noEmit`, lint with ESLint.
- Plugin metadata in `manifest.json` / `versions.json`; version bump via `version-bump.mjs`. Output to `dist/main.js`.
