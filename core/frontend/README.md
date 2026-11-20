# Lumiora frontend

This is Lumiora's Vite, React, TypeScript, and Tailwind frontend. It implements template selection, local camera capture and upload, customization, review, and PNG download. Product decisions and remaining open choices are in [the planning documents](../../docs/README.md).

## Local development

From `core/frontend`:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Camera access starts only when requested; photos remain in the browser tab and are lost on refresh or close.

## Checks

```sh
npm run lint
npm run build
npm test
```

`build` includes TypeScript checking. Vitest covers the session helpers, templates, edits and upload lifecycle; see [coding guidance](../../docs/CODING.md). Use `npm.cmd` on Windows if PowerShell blocks `npm.ps1`.

## Environment

The local starter does not require environment variables. `.env.example` is present for future public client configuration. Never put private service credentials in Vite client variables.
