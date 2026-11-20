# Frontend implementation guide

**Status: proposed.** Check the code before using any path below. The current frontend has a placeholder `App.tsx`; most named directories are empty.

## Current setup

The app lives in `core/frontend`. `package.json` provides `dev`, `build`, `lint`, and `preview` scripts. Vite uses React and Tailwind plugins. No router, global state library, camera integration, or test runner is installed yet. `motion` is installed for transitions and, later, the countdown. The shell uses it for step transitions (`AnimatePresence` in `App.tsx`), the progress bar fill, the template preview swap and button press feedback. `App.tsx` wraps everything in `MotionConfig reducedMotion="user"`, so keep new animations under it.

### UI shell (implemented)

The shell follows the [UI](UI.md) journey. It starts on Choose look, has no landing page, and uses no router.

- `src/App.tsx` holds the journey step (`select`, `source`, `customize`, `review`, `export`) in React state and owns the template selection hook, so the choice survives step changes.
- `src/app/journey.ts` defines the five steps. `components/layout/` holds `AppHeader`, `StepIndicator` (earlier steps are clickable, later ones disabled) and `AppFooter`.
- `features/templates/` holds the placeholder catalog (`catalog.ts`), the selection hook that reads and writes `/create?category=…&template=…` with `history.replaceState` and validates IDs with a fallback notice (`useTemplateSelection.ts`), the placeholder preview (`TemplatePreview.tsx`) and the Choose look screen (`ChooseLook.tsx`).
- `pages/StepPlaceholder.tsx` stands in for Capture or upload, Customize, Review and Export until those features are built.
- Application UI tokens (colors, font, radius, focus ring, reduced motion) are in `src/index.css`. They are a first pass pending wireframe review.
- `features/camera/` implements Capture or upload:
  - `usePhotoSession.ts` keeps image slots per template ID as object URLs, with an active slot. Switching template neither loses photos nor mismatches slot counts. Slots are not persisted, so a refresh clears them.
  - `useCamera.ts` has the states `idle`, `requesting`, `ready`, `denied`, `unavailable` and `error`. It requests the camera only when the person presses **Turn on camera**, ignores a permission result that arrives after leaving the screen, and stops tracks on unmount or **Turn off camera**.
  - `CameraPanel.tsx` runs a 3-second countdown and captures the mirrored frame to the active slot. `captureFrame.ts` draws the frame to a canvas and returns a JPEG object URL.
  - `UploadPanel.tsx` and `readImageFile.ts` accept JPEG, PNG or WebP up to 15 MB, check that the image decodes, and fill the active slot and then the empty ones. Files never leave the browser.
  - `SlotStrip.tsx` shows the template geometry with photos. Selecting a slot targets it for retake or replace, and each filled slot has a remove button. `CaptureScreen.tsx` composes these, and **Continue** stays disabled until every slot is filled.
- `features/editor/` implements Customize:
  - `presets.ts` holds the photo style presets (6 frame/background colors, 5 filters), kept apart from the app UI tokens. Filters are CSS filter strings so export can reuse them with canvas `ctx.filter`; this has not been checked in every target browser.
  - `useEditSettings.ts` holds the edits as data (`frameId`, `filterId`, `caption`) for the whole session, separate from the template defaults. Edits apply to the original photos at render time.
  - `CompositionPreview.tsx` renders template geometry, photos, frame, filter and caption at the export aspect ratio, sized with container units so it scales without changing the ratio. A caption band is always reserved. It shows an alert if a photo fails to load. Review and Export should reuse it.
  - `CustomizeScreen.tsx` pairs the preview with controls built from `components/ui/ChoiceGroup.tsx` (native radio inputs) and a caption field, plus **Reset edits**.
- The catalog is placeholder data. Create Your Own is three fixed blank templates (1, 2, 4 photos); Surprise me is not built.

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
- The behavior when someone changes to a template with a different slot count after adding photos. The current code keeps photos separately for each template; a migration between templates is not built.
- Session state mechanism and whether drafts survive refresh.
- Preview rendering strategy and its performance on lower-powered phones.
- Test runner and browser automation tools when the first testable feature is added.
