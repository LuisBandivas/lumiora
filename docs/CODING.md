# Coding and verification guide

**Status: proposed.** This gives human and AI contributors a shared loop during early development. Adjust it when real constraints appear.

## Work loop

1. Pick one user-visible outcome from [Features](FEATURES.md) and identify its relevant UI states.
2. Inspect the current code and scripts; write down any open decision the outcome depends on.
3. Make the smallest complete change, including error and recovery behavior where the feature needs it.
4. Verify with the available checks and a focused manual browser pass for camera or visual behavior.
5. Update the relevant planning document when the implementation settles a decision.

For AI-assisted work, give the agent a concrete outcome, relevant files or docs, constraints, and a completion check. Ask it to report changed files, commands run, and remaining open decisions. Review camera permissions, photo handling, and any network transfer especially carefully.

## Code conventions

- Use TypeScript types for session data and feature boundaries; avoid `any` where the shape is known.
- Keep React components focused on rendering and interaction. Put camera lifecycle and pixel rendering behind small functions or hooks with clear inputs and outputs.
- Use accessible HTML elements before custom controls.
- Handle loading, empty, permission, and failure states where a feature can reach them.
- Name concepts consistently with the feature and architecture documents: session, template, image slot, edit settings, strip.
- Keep dependencies purposeful. Add a library when it removes meaningful complexity, and record why if it changes an architecture boundary.

## Testing and TDD

Use test-first development when behavior can be specified before UI implementation: session transitions, template selection and URL validation, slot geometry, retake logic, and export composition are good candidates. Start with a failing behavior test, implement it, then refactor. For exploratory visual work, build a small slice, inspect it in the browser, and add focused tests around stable behavior afterward.

Vitest is the unit test runner (node environment, `src/**/*.test.ts`). Pull logic that can be tested out of components into pure functions, as with `resolveSelection`, `placePhotos` and `compositionGeometry`, and test those. Favor tests of behavior and visible outcomes over tests that repeat the code's internal structure. Browser and device checks are needed for permission handling, responsive layout, and download behavior; unit tests alone cannot cover those browser interactions.

## Available checks today

Run from `core/frontend`:

```text
npm run lint
npm run build
npm test
```

`npm run build` includes TypeScript checking. `npm test` runs 30 unit tests covering the template catalog and its geometry, selection URL validation, photo slot placement, edit and overlay data, and upload overlap/cancellation/error recovery. On Windows with PowerShell script execution disabled, use `npm.cmd` for these commands. Report any check that could not run and why.

There is no automated browser test in the repository. The camera, upload, drag, export and responsive behavior were checked once by hand-driving Edge with Playwright and a fake camera (26 steps across the whole journey on desktop and a 390 px phone, including a real PNG download compared with the preview). That script is not committed. Adding browser automation to the project is still **Open**; until then, repeat that pass in a real browser after changes to capture, the editor or export.

The 2026-11-20 browser pass used headless Edge and a temporary local Playwright script. All 18 templates fit at 320, 768 and 1280 px with their aspect ratios preserved. It also verified wide-template Customize/Review/Export layouts at those widths, heading focus, tab navigation, keyboard decoration selection/movement/deletion, upload placement after slot changes, cancellation and URL cleanup during decoding, fake-camera capture and a successful PNG download. Mobile screenshots were inspected. Safari, Firefox, physical-camera behavior and touch dragging were not rechecked in this pass.

## Change review

A feature is ready for review when its acceptance criteria are demonstrable, relevant failures have recovery paths, keyboard and touch use have been considered, and the checks above pass. Leave unresolved product choices in the docs as **Open** rather than silently deciding them in code.
