# Working on Lumiora

Lumiora is in setup and planning. Treat the documents in [docs/README.md](docs/README.md) as working drafts; a planned feature or technology is not an approved implementation decision.

Before a change, read the relevant document: [features](docs/FEATURES.md) for behavior and scope, [UI](docs/UI.md) for screens and interaction, [architecture](docs/ARCHITECTURE.md) for boundaries and data flow, [frontend](docs/FRONTEND.md) for client structure, and [coding](docs/CODING.md) for implementation and verification.

For each task:

1. Identify the user-visible outcome and the smallest coherent change.
2. Check the current code and configuration before assuming a proposed structure exists.
3. Record a material product or architecture decision in the relevant document when the task settles it. Keep unresolved choices marked **Open**.
4. Verify the changed behavior with the checks described in `docs/CODING.md`, and report what ran.

Captured and uploaded images are personal data. Keep image handling local to the browser unless the user explicitly chooses a storage or sharing action. Never add secrets or real credentials to the repository.

## Agent skills

### Issue tracker

Issues and feature specs live in GitHub Issues for LuisBandivas/lumiora. See `docs/agents/issue-tracker.md`.

### Domain docs

This is a single-context repository with the root `CONTEXT.md` and `docs/adr/`. See `docs/agents/domain.md`.
