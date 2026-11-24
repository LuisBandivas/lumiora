# Photo creation context

Language for the browser photo-creation journey.

## Language

**Capture clip**:
A three-second video paired with a camera photo in one image slot. It records the countdown immediately before that photo is taken.

**Composition clip**:
One playable video of the complete chosen template, with its image slots arranged together. Camera-filled slots use their capture clips; uploaded or photo-only slots show still images.

**Auth session**:
The optional Supabase identity session for sign-in. It is separate from the temporary photo session, and it does not store or upload photos.
