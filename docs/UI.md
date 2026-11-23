# UI and interaction direction

**Status: working draft.** The current app implements the five-step local journey, from template selection through capture/upload, customization, review and PNG export (see [Frontend](FRONTEND.md#ui-shell-implemented)). Release scope remains provisional. Ephemora's approved application identity is inspired by ephemeral moments and the feeling of an old photo album. Photo output remains open to each person's creative choices.

## Main journey

```mermaid
flowchart LR
  Select[1 Choose look: category and template] --> Source[2 Capture or upload]
  Source --> Customize[3 Customize]
  Customize --> Review[4 Review]
  Review --> Export[5 Export]
  Source -->|retake or replace slot| Source
  Review -->|edit| Customize
  Source -->|camera or file problem| Recovery
  Recovery -->|retry| Source
```

## Screen responsibilities

| Screen | Main content | Essential states |
| --- | --- | --- |
| Choose look | Category tabs, template preview, photo count, progress, Continue | Initial, category changed, template selected, invalid URL selection, empty category |
| Capture or upload | Source choice, camera preview or local file input, filled slots | Permission request, ready, counting, capturing, file validation, denied, unavailable, error |
| Customize | Strip preview and editing controls | Default, edited, processing error |
| Review | Final preview and back/continue actions | Ready, rendering error |
| Export | Download action; later gallery and sharing actions if approved | Ready, exporting, export error, downloaded |

Use one clear primary action per screen and a persistent five-step progress indicator. Category choice and template browsing share the first screen; the progress steps are **Choose look**, **Capture or upload**, **Customize**, **Review**, and **Export**. Preserve progress when moving backward within a session. Ask for camera permission in context, after the person chooses camera capture. Provide a direct retry action when the browser allows it; otherwise explain how to enable the camera in browser settings. Upload and later sharing remain scope decisions in [Features](FEATURES.md).

**Implemented progress treatment:** On wider screens, the five steps sit in equal-width tiles with the current step highlighted. On phones, all five numbered positions stay visible and a separate label names the current step. Completed steps can be used to move back; upcoming steps remain unavailable. A slim track shows how far the session has progressed.

## Choose look screen

- Heading: **A moment to remember.** Supporting copy: **Choose a look for your photos, then make it yours.**
- Top-level categories: **Photostrips**, **Single Photo**, **Frames**, **Create Your Own**. Use segmented tabs or another equally clear control; show which category is active.
- Show a large active template preview with previous/next controls, position such as `1 / 3`, template name, and a plain-language photo-count label. Neighbouring previews may be visible on desktop.
- Make the active template visually clear and provide **Continue with this** as the primary action. A selected template is a starting point; editor controls can change supported visual properties later.
- **Surprise me** can choose a template after its behavior is decided. It should still show the chosen template before advancing.
- **Create Your Own** should start from a blank composition while making its photo count and geometry clear before continuation.

The proposed URL is `/create?category=frames&template=minimal-white`. It identifies only the public selection. A refresh should restore the category and template when those IDs still exist; an unknown ID should fall back to a valid visible choice with clear feedback. This URL behavior can be implemented when navigation is added.

## Responsive layout

- **Mobile selection:** make category navigation horizontally scrollable, center one large template preview, and keep **Continue with this** easy to reach in a sticky bottom area.
- **Desktop selection:** show the active template prominently with neighboring previews at 1024 px and wider, and clear previous/next controls. Below that width, show only the active preview. Each preview fits its available column without changing its aspect ratio. Pagination dots have 44 px touch targets.
- **Mobile capture/editor:** prioritize the camera or strip preview; place the primary action within easy reach and keep editing controls in a compact panel.
- **Phone Customize (implemented):** below the `md` breakpoint (768 px) the strip preview is pinned to the top at about 38% of the viewport height (11 to 18 rem). Controls sit under it in three tabs: **Look** (frame and filter), **Caption**, and **Stickers and text**. One group shows at a time, so the preview stays visible while a sticker's size, rotation or color is changed. Selecting a sticker or text item on the preview opens the **Stickers and text** tab. The Continue bar is pinned to the bottom. Focus scrolling leaves room for both pinned areas, so a keyboard user's focused control never ends up underneath them. At `md` and wider, which includes a phone held sideways and portrait tablets, the preview sits beside all control groups and there are no tabs.
- **Step changes** open at the top of the page and move keyboard focus to the incoming heading after the previous screen exits.
- **Desktop capture/editor:** allow preview and controls to sit side by side where space permits.
- Make previews adapt to available width without changing the composition's export aspect ratio.
- Check landscape orientation and small viewports before calling a screen complete.

## Visual foundations to explore

The shell uses an Ephemora wordmark and a small photo-frame mark. The header gives a short local-processing cue; the footer explains that photos stay in the browser during creation and that a download is needed to keep the finished image. A keyboard skip link goes directly to the main screen.

**Chosen brand direction:** the lighter vintage ivory canvas `#F8F2E8` is adapted from the original `#F3EBDD` palette; champagne `#B99B7B` supplies small decorative details; mocha `#776957` is used for secondary text and primary actions; dusty beige `#D9CBB9` defines borders; soft charcoal `#33302D` anchors high-contrast text. Sage mist `#A9A58F` is an optional quiet accent. Serif display typography, warm light, subtle grain and restrained album details set the mood. The grain belongs to the app shell and does not alter captured or exported photos. Browser-native serif and sans-serif stacks avoid a font download.

- Warm ivory UI surfaces with clear contrast for text and controls.
- Elegant serif headings, structured layouts, and subtle album details that keep attention on the photos.
- Style choices such as monochrome, pastel, and vintage belong to the photo customization tools; the application shell should support all of them.
- Consistent spacing and type scale, with readable labels before decorative typography.
- Motion can make the countdown and screen changes feel playful; respect reduced motion settings.

The chosen color and type tokens live in `core/frontend/src/index.css`. Spacing, radius and focus treatment can be refined after desktop and mobile visual review.

## Accessibility review for every screen

- Semantic buttons, labels, visible focus, and a logical keyboard order.
- Category controls and template navigation need keyboard access and an announced active selection; the carousel must not require dragging.
- **Implemented:** category, source and mobile editor tabs use Left/Right arrows and Home/End with one tab stop per list. Focusing a decoration opens its controls; Enter/Space selects it, arrows move it and Delete removes it.
- Text status for countdown, capture progress, and errors; do not rely on color or animation alone.
- Touch targets large enough for comfortable use and no hover-only essential action.
- Camera preview and final composition have appropriate accessible names or descriptions; decorative elements stay out of the accessibility tree.
- Check contrast and zoom behavior against the eventual design tokens.

## Open design questions

- Whether the current original frame mark needs refinement after visual review.
- Initial photo style presets and how users can mix their elements.
- Whether the implemented 18-template catalog is final (see [Features](FEATURES.md#first-release-template-catalog)). Each preview is the template drawn with its default frame and filter and empty slots.
- Whether the five-step indicator includes a separate landing page or begins on Choose look; the current proposal and the shell begin on Choose look.
- Whether Surprise me selects within the current category or all templates.
- Whether capture is automatic after countdown or initiated for each slot. The shell starts the countdown for each photo on request and moves to the next empty slot afterward.
- Whether the phone editing layout (below) needs more than three tabs once more editing tools exist. The current layout keeps the preview in view while any control is adjusted.

## Next design deliverable

Review **desktop and mobile Choose look** with the Ephemora palette, including an active Photostrips template, a Frames template, Create Your Own, an invalid or empty selection state, and the sticky mobile action. Then design the Capture or upload screen with permission, ready, filled-slot, and recovery states.
