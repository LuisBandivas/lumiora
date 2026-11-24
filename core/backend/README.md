# Backend boundary

This folder is reserved for trusted server-side APIs. The current product has no backend server or API endpoints yet.

Supabase Auth for this browser app runs in `core/frontend` with the publishable key. Add backend code here only when a feature needs server-side work, such as privileged operations or integration secrets. Backend endpoints must verify the caller's Supabase access token before handling user-specific requests. Never expose a service-role key or other server credential through Vite or a `VITE_` variable.
