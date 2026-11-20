# Feature scope

**Status: proposed.** The [project README](../README.md) describes the broader vision. This document suggests a smaller first release so the basic journey can be built and evaluated before adding cloud features.

## Product goal

A person can choose a starting template, make a personalized photo in a browser, and download it without an account. The experience should be simple across desktop and mobile while allowing different creative styles instead of steering every result toward one aesthetic.

## Template Selection System

**Proposed.** The first creation screen combines category browsing and template selection. The four proposed categories are **Photostrips**, **Single Photo**, **Frames**, and **Create Your Own**. Categories are a way to browse; each template supplies the concrete photo count and geometry. A frame template may therefore contain a strip or a single photo.

| Category | Initial direction |
| --- | --- |
| Photostrips | 2-cut, 3-cut, and 4-cut formats. |
| Single Photo | Portrait and instant-film starting points. |
| Frames | Pre-designed compositions with visible frame previews. |
| Create Your Own | A blank starting point; photo count and geometry must still be defined before capture. |

A template defines its stable ID, category, photo count, image-slot geometry, and default appearance. Selecting it starts a session. The editor may override supported colors, filters, frames, stickers, and text without silently changing the required photo count or slot geometry. Changing to a template with different geometry after capture needs an explicit migration or restart decision.

The selection screen should show category navigation, large previews with previous/next controls, the required photo count, a clear selected state, and a primary **Continue with this** action. **Surprise me** is an optional later browsing aid. The selected category and template may be represented by public URL parameters; photos must not be placed in the URL.

### First-release template catalog

**Implemented, pending sign-off.** Template IDs are stable because they appear in the selection URL. A template sets its photo count, layout and default frame and filter. The person's own edits override the defaults and never change the photo count or slot geometry.

| Category | Templates (photos) |
| --- | --- |
| Photostrips | 2-cut strip (2), 3-cut strip (3), 4-cut strip (4), all vertical with landscape-leaning photos |
| Single Photo | Portrait (1, 3:4), Square (1, 1:1), Instant film (1, square with a deep caption band, cream frame, vintage filter), Postcard (1, 3:2) |
| Frames | Minimal white (3), Film noir (3, black frame, mono), Pastel duo (2, pink, pastel), Retro grid (4, 2 × 2, cream, vintage), Sky quad (4, 2 × 2, sky), Sage pair (2, side by side, sage, warm) |
| Create Your Own | Blank with 1, 2, 3, 4 or 6 photos and the default white frame |

Photo shapes are fixed per template; no template resizes its photos to fit the capture.

## First release: one complete local journey

| Step | Expected behavior | Acceptance criteria to refine during implementation |
| --- | --- | --- |
| Choose look | Browse a category and select one template on the same screen. | The preview shows the required photo count; selection can change before capture; no sign-in or camera permission is required for browsing. |
| Capture or upload | Fill the template's image slots from a live camera or local files, if both entry methods are included in the release. | Camera errors have recovery paths; uploaded files are validated; each slot can be filled or replaced. |
| Customize | Pick a frame/background and apply a small set of visual treatments from different styles. | Edits appear in the preview and can be changed without recapturing; style choices are not tied to one theme. |
| Review | Show the complete composition at its export aspect ratio. | The person can return to customization and see the exact result intended for export. |
| Export | Render one image file locally for download. | The downloaded image has the selected template and edits; failure gives a retry path. |

The table describes proposed behavior, not a promise that every control or visual treatment must ship at once. A vertical slice may start with one template, camera capture, and download, then broaden after the full path works. Whether file upload joins the first release remains open.

**Implemented in the shell (provisional):** Capture or upload offers both camera and local upload. The camera starts only on request, the countdown is 3 seconds and runs once per photo, and the captured image is mirrored to match the preview. Upload accepts JPEG, PNG and WebP up to 15 MB. Both of these remain **Open** below. Customize offers frame/background colors, five filters, a caption of up to 30 characters, six stickers and movable text. Stickers and text can be dragged, nudged with the keyboard, resized, rotated, recolored and removed, up to 20 items. Review shows the final composition with a shortcut back to editing. Export renders a PNG locally, 1200 px wide with the template's height, named `lumiora-<template-id>.png`; these values are provisional. No step sends photos anywhere.

## Later candidates

- More stickers, text fonts, pinch-to-resize and rotate gestures, more filters, and more layouts.
- Surprise-me selection and additional templates in each category.
- Personal gallery and optional accounts.
- Cloud storage, generated share links, and QR codes.
- Rear camera selection where supported.

Gallery and sharing depend on product and privacy decisions in [Architecture](ARCHITECTURE.md). Local file upload can be added independently because it need not send photographs to a server.

## Cross-cutting behavior

- A session should make clear when its photos exist only in the browser and may be lost on refresh or close.
- Camera permission denial, unavailable hardware, capture failure, and export failure need distinct user-facing states.
- Controls should work with keyboard and touch; countdown status and errors need text equivalents.
- Captured images and generated strips should not leave the device without an explicit user action.

## Open decisions

| Decision | Why it matters |
| --- | --- |
| Minimum supported browsers and devices | Sets the camera, download, and compatibility test matrix. |
| Whether the [first-release catalog](#first-release-template-catalog) is final | It is implemented and ready for review, but the product owner has not signed it off. |
| Whether local upload ships with camera capture in the first release | Determines the source-choice UI and file validation work. |
| Whether Surprise me chooses within the active category or across all categories | Determines how predictable the action feels. |
| What happens when a template changes after photos exist | Avoids unexpected loss or mismatched slot counts. |
| Countdown length and whether it is configurable | Affects accessibility and session timing. |
| Export format, dimensions, and filename | Determines visual quality and download behavior. |
| Whether editing survives refresh | Determines if local persistence is needed. |
| Later gallery retention and deletion rules | Must be settled before any cloud storage is added. |
