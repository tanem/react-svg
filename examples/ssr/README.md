# ReactSVG SSR Example

`ReactSVG` is published with a `"use client"` directive, so it can be imported
directly into a Next.js Server Component - see `app/page.js`. Props that take
functions (`afterInjection`, `beforeInjection`, `fallback`, `loading`) can't
cross the server/client boundary, so pass those from your own Client Component.

`npm run dev`, then open <http://localhost:3000>.
