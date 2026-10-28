# Lumiora frontend

This is the Vite, React, TypeScript, and Tailwind starter for Lumiora. It currently renders a placeholder screen. Product and implementation plans are in [the planning documents](../../docs/README.md).

## Local development

From `core/frontend`:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. The placeholder does not use the camera yet.

## Checks

```sh
npm run lint
npm run build
```

`build` includes TypeScript checking. Automated tests have not been configured yet; see [coding guidance](../../docs/CODING.md).

## Environment

The local starter does not require environment variables. `.env.example` is present for future public client configuration. Never put private service credentials in Vite client variables.
