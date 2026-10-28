# Frontend implementation guide

**Status: proposed.** Check the code before using any path below. The current frontend has a placeholder `App.tsx`; most named directories are empty.

## Current setup

The app lives in `core/frontend`. `package.json` provides `dev`, `build`, `lint`, and `preview` scripts. Vite uses React and Tailwind plugins. No router, global state library, camera integration, or test runner is installed yet.

## Suggested structure as features arrive

```text
core/frontend/src/
  app/             application composition and navigation
  components/      reusable, product-neutral UI pieces
  features/
    camera/        stream lifecycle and capture UI
    templates/     category catalog, template definitions and selection UI
    editor/        edits and composition preview
    gallery/       later, if approved
    sharing/       later, if approved
  lib/             browser and rendering helpers shared across features
  pages/           route or journey-level screens if useful
```

Create files when the feature needs them. Keep code for a feature together, including its tests. Use `components/` for pieces reused across features; avoid moving every component there by default.

## State and flow

Start with local React state for isolated controls. A session-wide model should hold the selected template ID, ordered image slots, and edit settings. The template catalog defines stable IDs, category, slot count, geometry, and defaults. Keep user edits separate from those defaults; changing a frame color or filter does not change the template's photo count. Add a state library only if cross-screen state becomes hard to maintain with the simpler model. Keep temporary UI state, such as an open panel, separate from image data and export settings.

Prefer explicit journey states (`select`, `source`, `customize`, `review`, `export`) and explicit capture states (`requesting`, `ready`, `counting`, `capturing`, `error`) over several unrelated booleans. Preserve enough information to retry camera acquisition or one photo slot after failure.

The proposed selection URL is `/create?category=frames&template=minimal-white`. Parse and validate IDs against the catalog, reflect a changed selection in the URL, and restore a valid selection on refresh. Query parameters hold public selection data only. Adding a router is an implementation choice; this URL alone does not require one.

## Camera and image work

- Acquire camera access in response to the capture journey, handle denial and missing devices, and stop old tracks when leaving or switching cameras.
- If local upload is included, validate file type and size and decode it into the same slot model used for camera captures.
- Store photos in a form suitable for preview and rendering while watching memory use on phones.
- Define template geometry independently from screen pixels so a responsive preview and exported image use the same arrangement.
- Keep editing choices as data. Render from the original captures plus choices so edits can be changed or undone without degrading the source images.
- Test export dimensions and orientation with representative portrait and landscape inputs once those requirements are fixed.

## Styling

Tailwind is installed. Introduce design tokens for the minimal, light-themed application UI as the visual design settles. Keep photo style presets and their colors/effects separate from application UI tokens so a new composition aesthetic does not require a new app theme. Put repeated visual patterns in components or shared styles. The composition preview must maintain the export aspect ratio at every viewport size.

## Environment

Use Vite client environment variables only for values safe to expose in a built browser bundle. Keep `core/frontend/.env.example` as a list of required names once integration needs them; it is currently empty. The local-only first release should not require cloud credentials.

## Open choices

- Navigation approach once there are multiple journey screens.
- The behavior when someone changes to a template with a different slot count after adding photos.
- Session state mechanism and whether drafts survive refresh.
- Preview rendering strategy and its performance on lower-powered phones.
- Test runner and browser automation tools when the first testable feature is added.
