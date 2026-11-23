# Ephemora planning documents

**Status: working drafts.** These documents organize the current idea so development can start in small, reviewable steps. They are not a final product specification. The root [README](../README.md) is the project introduction; the files below hold working decisions and open questions.

| Document | Use it for |
| --- | --- |
| [Features](FEATURES.md) | Product scope, first release, behavior, acceptance criteria |
| [UI](UI.md) | User journeys, screen states, visual direction, accessibility |
| [Architecture](ARCHITECTURE.md) | System boundaries, data flow, privacy, later services |
| [Frontend](FRONTEND.md) | Frontend modules, state, browser APIs, rendering |
| [Coding](CODING.md) | AI-assisted workflow, conventions, testing and checks |

## Status vocabulary

- **Current**: visible in the repository today.
- **Proposed**: a useful starting direction that may change through implementation or feedback.
- **Open**: needs a decision or a small experiment before implementation depends on it.

Update the relevant document when a decision is made. Replace an outdated proposal instead of adding a second, conflicting rule. Keep acceptance criteria aligned with the actual feature scope.

## Suggested first decisions

1. Confirm the smallest complete selection-to-download journey and whether local upload joins camera capture in [Features](FEATURES.md).
2. Create desktop and mobile Choose look mockups using the brief in [UI](UI.md), then design camera and upload states.
3. Set export dimensions and the supported browser/device targets before building capture and rendering.
4. Decide whether accounts, gallery, and sharing belong in a later release; that is the current proposal.
