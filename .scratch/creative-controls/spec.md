# Creative capture controls

## Problem Statement

People cannot choose typography, countdown duration, or which camera they use for an Ephemora composition.

## Solution

Add caption and overlay font choices, a template-scoped 0 / 3 / 5 second timer, and front/back camera switching. Keep camera images local and preserve each slot's orientation through capture, preview, and export.

## User Stories

1. As a creator, I want to choose a caption font so that the composition matches my style.
2. As a creator, I want to choose a font for each movable text item so that different notes can have distinct styles.
3. As a creator, I want font choices to match in preview, PNG, and composition video.
4. As a creator, I want to choose no countdown, three seconds, or five seconds before capturing.
5. As a creator, I want one timer duration for every camera photo in a template.
6. As a creator, I want the timer locked after the first camera photo and unlocked after all camera photos are removed or replaced with uploads.
7. As a creator, I want zero-second capture to save a still without a clip.
8. As a creator, I want timed captures to include a clip of the selected countdown.
9. As a creator, I want to switch between front and back cameras between shots.
10. As a creator, I want existing photos and clips to retain the orientation from their capture camera.
11. As a creator, I want the selected camera to carry across templates in the current session.
12. As a creator, I want a clear front-camera or upload fallback when the back camera is unavailable.

## Implementation Decisions

- Store timer by template and carry the last timer selection to a newly visited template.
- Track camera source on each slot independently from the camera preference for the next capture.
- Front captures are mirrored; back captures are unmirrored.
- A composition video runs for the selected timer duration. Still-only slots remain still.
- Font selections use stable IDs shared by the DOM and canvas renderers.
- Camera tracks, photos, and clips remain browser-local.

## Testing Decisions

- Test visible timer lock/unlock and preservation of slot contents.
- Test orientation through the composition renderer seam.
- Test editor font selection and parity between DOM and canvas mappings.
- Follow existing Vitest unit-test conventions, plus browser checks for device camera selection and downloads.

## Out of Scope

Accounts, remote storage, sharing, and persistence after refresh.

## Further Notes

Specific font files and redistribution licenses must be selected before shipping bundled fonts.
