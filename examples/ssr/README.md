# ReactSVG SSR Example

This project was bootstrapped with [Next.js](https://nextjs.org/).

`ReactSVG` is published with a `"use client"` directive, so it can be imported
directly into a Server Component - see `app/page.js`. Props that take functions
(`afterInjection`, `beforeInjection`, `fallback`, `loading`) can't cross the
server/client boundary, so pass those from your own Client Component.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.