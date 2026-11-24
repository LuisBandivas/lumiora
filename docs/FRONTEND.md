# Frontend implementation guide

**Status: proposed.** Check the code before using any path below. The frontend implements the full local journey (see [UI shell](#ui-shell-implemented)); some directories from the structure below are still empty.

## Current setup

The app lives in `core/frontend`. `package.json` provides `dev`, `build`, `lint`, `test`, and `preview` scripts. Vite uses React and Tailwind plugins, and Vitest runs the unit tests. No router or global state library is installed. `motion` is installed for transitions and the capture countdown. The app uses it for step transitions (`AnimatePresence` in `App.tsx`), the progress bar fill, the template preview swap and button press feedback. `App.tsx` wraps everything in `MotionConfig reducedMotion="user"`, so keep new animations under it.

### UI shell (implemented)

The shell follows the [UI](UI.md) journey. It starts on Choose look, has no landing page, and uses no router.

- `src/App.tsx` holds the journey step (`select`, `source`, `customize`, `review`, `export`) in React state and owns the template selection hook, so the choice survives step changes.
- `src/app/journey.ts` defines the five steps. `components/layout/` holds `AppHeader`, `StepIndicator` (earlier steps are clickable, later ones disabled) and `AppFooter`.
- `features/templates/` holds:
  - `catalog.ts`, the 18-template first-release catalog (see [Features](FEATURES.md#first-release-template-catalog)). Each template has its photo count, columns, a layout, a derived export aspect ratio and default frame and filter IDs.
  - `layout.ts`, the layout proportions (padding, gap, caption band and font size as a percent of composition width) and `aspectFor`, which derives a template's aspect ratio from the photo shape. Previews and the export renderer both read these, so they stay in step.
  - `useTemplateSelection.ts`, the selection hook that reads and writes `/create?category=…&template=…` with `history.replaceState` and validates IDs with a fallback notice.
  - `TemplatePreview.tsx`, which draws a template with empty slots through `CompositionPreview`, so the preview shows its real geometry and default look.
  - `ChooseLook.tsx`, the Choose look screen.
- All five journey screens are implemented. The placeholder page was removed.
- `features/auth/AuthProvider.tsx` owns the optional Supabase Auth session and exposes email/password, signup, Google OAuth, and sign-out operations to the login screens and app header. `lib/supabase.ts` creates the browser client from the frontend's public Vite environment variables. Auth does not gate the photo journey or upload photos.
- `features/editor/ReviewScreen.tsx` shows the final `CompositionPreview` with **Continue to export** and **Edit**.
- `features/export/` implements Export. `ExportScreen.tsx` has the states `ready`, `exporting`, `downloaded` and `error`, with **Try again** on failure. `editor/renderComposition.ts` draws the PNG on a canvas from the original photos and the edits, using the same proportions as the preview (`templates/layout.ts`). It also draws stickers and text. `downloadBlob.ts` triggers the download. **Start over** releases every photo and resets the edits.
- Export checks that the browser's canvas really applies filters, because Safari accepts `ctx.filter` without applying it. If it does not, an export with a filter fails with a message instead of producing an image that differs from the preview.
- Application UI tokens (colors, font, radius, focus ring, reduced motion) are in `src/index.css`. They are a first pass pending wireframe review.
- `features/camera/` implements Capture or upload:
  - `usePhotoSession.ts` keeps image slots per template ID as object URLs, with an active slot. Switching template neither loses photos nor mismatches slot counts. Slots are not persisted, so a refresh clears them.
  - `useCamera.ts` has the states `idle`, `requesting`, `ready`, `denied`, `unavailable` and `error`. It requests the camera only when the person presses **Turn on camera**, ignores a permission result that arrives after leaving the screen, and stops tracks on unmount or **Turn off camera**.
  - `CameraPanel.tsx` runs a 3-second countdown and captures the mirrored frame to the active slot. `captureFrame.ts` draws the frame to a canvas and returns a JPEG object URL.
  - `UploadPanel.tsx` and `readImageFile.ts` accept JPEG, PNG or WebP up to 15 MB, check that the image decodes, and fill the active slot and then the empty ones. Files never leave the browser.
  - `SlotStrip.tsx` shows the template geometry with photos. Selecting a slot targets it for retake or replace, and each filled slot has a remove button. `CaptureScreen.tsx` composes these, and **Continue** stays disabled until every slot is filled.

  - Capture clips are implemented: a camera photo may gain a silent three-second clip from its countdown; uploads and recording failures leave still-only slots. `recordClip.ts` records the camera stream and checks that the resulting clip opens for playback. `usePhotoSession.ts` holds clip URLs beside photo URLs and releases both on replacement or removal. Capture shows available slot clips moving together; Review shows the styled composition with moving capture slots and still-only slots. `drawCompositionFrame.ts` gives PNG and video export the same geometry and edit rendering. `renderCompositionVideo.ts` records one three-second composition clip locally, 720 px wide and about 30 fps. PNG and video downloads have independent failure states. See [Features](FEATURES.md) and [UI](UI.md) for behavior and device verification still open.
- `features/editor/` implements Customize:
  - `presets.ts` holds the photo style presets (6 frame/background colors, 5 filters), kept apart from the app UI tokens. Filters are CSS filter strings so export can reuse them with canvas `ctx.filter`; this has not been checked in every target browser.
  - `useEditSettings.ts` holds the edits as data (`frameId`, `filterId`, `caption`, `overlays`) for the whole session. A null frame or filter means "use the template's default", so each template shows its own look until the person picks something. Edits apply to the original photos at render time.
  - `overlays.ts` defines stickers and text. An item stores its center position as a fraction of the composition, its size as a percent of composition width, its rotation and its color, so the preview and the export arrange it the same way at any pixel size. The six stickers are original SVG path data in a 24 × 24 box. SVG draws them in the preview and canvas `Path2D` draws them in the export. Limits: 20 items, 24 characters of text.
  - `OverlayLayer.tsx` renders items above the composition. When the Customize screen passes controls, an item can be selected, dragged with the pointer (touch included), nudged with the arrow keys (Shift for larger steps) and removed with Delete. Which item is selected is temporary UI state in `CustomizeScreen`, not part of the edit data. `OverlayPanel.tsx` adds stickers and text and edits the selected item's size, rotation, color and text.
  - `CompositionPreview.tsx` renders template geometry, photos, frame, filter and caption at the export aspect ratio, sized with container units so it scales without changing the ratio. A caption band is always reserved. It shows an alert if a photo fails to load. Review and Export should reuse it.
  - `CustomizeScreen.tsx` pairs the preview with controls built from `components/ui/ChoiceGroup.tsx` (native radio inputs whose invisible input covers the whole chip) and a caption field, plus **Reset edits**. Below `md` the preview is sticky and the controls are three tabs; from `md` up it is a two-column layout with every group visible (see [UI](UI.md#responsive-layout)). The open tab and the selected item are local state in this screen, not edit data. The preview height comes from the `--preview-h` CSS variable set on the layout container, which the panels also use for `scroll-margin-top` so focus scrolling clears the pinned preview.
- Create Your Own is five fixed blank templates (1, 2, 3, 4 and 6 photos). Surprise me is not built.
- `App.tsx` focuses the incoming heading and scrolls to the top when the new screen mounts after its predecessor exits.
- `components/ui/tabNavigation.ts` provides Left/Right and Home/End navigation for category, source and mobile editor tabs; each list uses a single active tab stop.
- Previews use an aspect-derived preferred width capped by the available container width. Capture and Customize use bounded grid columns so wide templates cannot push controls offscreen. Choose look shows neighboring previews only at `lg` and wider.
- `camera/uploadBatch.ts` serializes image decoding, rejects overlapping batches and releases pending URLs on cancellation. `UploadPanel` disables file selection while reading and uses the latest placement callback when decoding finishes, preserving slot changes made during the read.
- Layout gotchas found in browser testing: `main` uses `overflow-x-clip` because `overflow-x-hidden` makes it a scroll container and stops the sticky bottom bars from sticking. Empty photo slots are tinted from the frame's ink color (`placeholderBackground` in `presets.ts`) because a fixed dark tint is invisible on dark frames such as Film noir.
- Known limit: the text position in the export can differ from the preview by a pixel or two, because the browser and the canvas place text lines slightly differently.

## Suggested structure as features arrive

### Planned implementation: fonts, timer, and back camera

1. Add a small font catalog with stable IDs, local font files, and explicit canvas font names. Add a caption font ID to edit settings and a font ID to each text overlay, preserving the current look as the default. Expose both choices in Customize. Wait for the selected font to load before PNG or video rendering; use the same catalog for CSS preview and canvas so text width and truncation remain consistent. Verify the bundled files' licenses before adding them.
2. Give each template a timer setting of 0, 3, or 5 seconds, initialized from the session's last timer choice. Track which filled slots came from the camera so the choice locks while that template has camera captures, including still-only captures. Unlock it when those captures are removed or replaced by uploads. In `CameraPanel`, derive countdown and optional recording from that setting. A 0-second shot skips recording. Remove the fixed `CLIP_SECONDS` assumption from capture and composition export; the export duration follows the selected template timer when clips exist. Preserve the still photo if clip recording fails.
3. Make camera direction an explicit Front / Back selection in `useCamera` and `CameraPanel`. Stop old tracks before requesting a new camera, guard late permission responses, and recover if the requested back camera is unavailable. Carry the actual direction used with each captured slot. Apply mirroring to front captures only in the live view, still capture, clip preview, and composition renderer; do not alter existing slots when switching direction. Keep camera data and media local to the browser.
4. Verify pure timer-lock and slot-orientation rules with focused Vitest tests. Run lint, build, and tests, then manually check 0 / 3 / 5 second capture, retakes, template switching, front/back switching, mixed-camera compositions, font selection, PNG/video parity, and unavailable-camera recovery on the target browsers and devices. The existing Edge fake-camera pass cannot establish physical back-camera behavior or Safari recording support.

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

Use Vite client environment variables only for values safe to expose in a built browser bundle. `core/frontend/.env.example` lists the Supabase URL and publishable key names. Keep real values in the ignored `core/frontend/.env.local`; never put a service-role key in a Vite variable. The photo journey still works without cloud credentials.

## Open choices

- Navigation approach once there are multiple journey screens.
- The behavior when someone changes to a template with a different slot count after adding photos. The current code keeps photos separately for each template; a migration between templates is not built.
- Session state mechanism and whether drafts survive refresh.
- Preview rendering strategy and its performance on lower-powered phones.
- Browser automation tools for the camera, drag, export and responsive checks. The unit test runner is settled (Vitest).
