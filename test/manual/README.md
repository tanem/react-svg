# Manual screen-reader checks

A node server and a page driven by hand under VoiceOver. It answers what the jsdom suite cannot: whether assistive technology announces a `loading` element, and whether a frame is ever painted with the loader on screen. jsdom has no accessibility layer and no paint, so the suite pins the ARIA wiring as markup only. It is outside `npm test` and CI because the instrument is a real screen reader.

Run it, and update the recorded runs below, when you change the ARIA wiring or the `loading` element's lifecycle.

## Running it

```
npm run build
node test/manual/server.mjs
```

Then open <http://localhost:4191>, with:

- **VoiceOver on, caption panel open** (`VO`+`Command`+`F10`). The panel shows queued announcements as text.
- **The window foregrounded** for the entire run.

Safari is the representative pairing for VoiceOver. Worth a second run in Chrome if the two disagree, since the AT-to-browser bridge differs.

## The steps

Run them in order. Each prints a DOM log, but the caption panel is the instrument: the log shows that a loading element entered and left the DOM, not that anything was announced. Do not report a finding from the log alone.

- **0 — check the instrument.** Changes the text of a live region that has been in the DOM since page load, with no react-svg involved. It must appear in the caption panel. If it does not, VoiceOver is not reaching the panel and the run is void.
- **0b — insert a populated live region.** Inserts a `role="status"` element with its text already in it, again with no react-svg. Structurally that is what react-svg does with a `loading` component, minus React and svg-injector, so if step 0 announces and this does not, the silence belongs to the platform rather than this package.
- **1 — warm the cache.** Mounts eight icons with no `loading` component and unmounts them, leaving svg-injector's cache holding all eight.
- **A — cached remount, `role="status"`.** Remounts the same eight with a loading component carrying live-region semantics. The log must report `0 requests served`, or the remount refetched and the run is void.
- **B — cached remount, plain span.** The same again with no live-region semantics.
- **4 — slow cold load, `role="status"`.** Holds a cold load open for ~2.5 seconds, so the loading element is mounted for a human-scale stretch. It is not an instrument check: a silent step 4 cannot tell a broken setup from a real finding. Only step 0 can.
- **5 — mid-flight re-injection probe.** Needs no screen reader, only a foregrounded tab, and takes about a minute. It sets `loadingDelay`, swaps `src` while the first request is still in flight, and counts the runs where a loader mounted after the swap, was painted, or was still up at the end. Its two phases control each other: under `rearm` the loader has to come back, under `suppress` it must stay down.

The comments in `app.mjs`, `server.mjs` and `index.html` say why each piece is built the way it is.

## Recording a run

| Case                           | Loading elements in DOM | Median lifetime | Caption panel |
| ------------------------------ | ----------------------- | --------------- | ------------- |
| 0 — instrument check           | n/a                     | n/a             |               |
| 0b — inserted populated region | n/a                     | n/a             |               |
| A — cached, `role="status"`    |                         |                 |               |
| B — cached, plain span         |                         |                 |               |
| 4 — slow cold, `role="status"` |                         |                 |               |

Browser and version:
VoiceOver / macOS version:

svg-injector defers its callbacks, so a second mount of the same `src` commits the `loading` element and removes it a couple of milliseconds later; `should render the specified loader for a cached src` in `test/browser.spec.tsx` pins that. A cold load has always mounted and unmounted `loading`; what changed is how often, so report any finding as a frequency change rather than a new defect.

## What it doesn't cover

- `loadingDelay` under a screen reader. Only the probe sets it, so steps 0 through 4 check the default path. A delay long enough to suppress the mount leaves no element to announce, which the DOM log settles without a screen reader.
- A re-injection that starts after the previous one has finished. A and B remount a fresh tree, and the probe swaps `src` mid-flight only.
- Mounts shorter than a frame, in the probe's painted count. rAF samples at about 60Hz, so the count is a floor and mounts are the sensitive figure.
- The `role="img"` / `<title>` / `<desc>` / `aria-labelledby` path.

## Last run

19.0.0 plus the `loadingDelay` work and the mid-flight re-injection fix, 2026-08-06, Safari 26.5 on macOS 15.7.7, VoiceOver with the caption panel open:

| Case                                                    | Caption panel | DOM                                                 |
| ------------------------------------------------------- | ------------- | --------------------------------------------------- |
| 0 — existing live region, text changed                  | announces     | n/a                                                 |
| 0b — `role="status"` element inserted already-populated | silent        | n/a                                                 |
| A — cached remount, `role="status"`                     | silent        | 8 elements, median 7.0ms, range 6.0-7.0, 0 requests |
| B — cached remount, plain span                          | silent        | 8 elements, median 8.0ms, range 7.0-8.0, 0 requests |
| 4 — `loading`, `role="status"`, ~2.5s mounted           | silent        | 1 element, 2514.0ms                                 |

**No announcement, and lifetime is not the variable.** VoiceOver announces a live region whose content changes and ignores one that arrives already populated. Step 0b establishes that with neither React nor svg-injector in the picture, so it is platform behaviour react-svg inherits: React always mounts `loading` as a complete element. 2.5 seconds was as silent as 7ms, and live-region semantics made no difference. Unchanged across all three recorded runs.

Lifetimes drift about a millisecond a run (B's median has gone 2.0ms, 7.0ms, 8.0ms across the three) while the shape never changes. That tracks the machine and browser build rather than the package, so it is recorded rather than read as a change.

The mechanics were re-checked in Chrome 151 on 2026-08-04, after the move here and to React from `node_modules`: all six steps ran, both cached remounts served 0 requests, the control held its loading element for 2509ms, and the console was clean apart from React's DevTools notice. No screen reader was running, so that run says only that the harness works.

## Last probe run

Chrome 151 on macOS, 30 runs per phase, against `dist/` built from this commit:

| Phase      | Expectation                 | Mounted after the swap | Painted | Still up at the end |
| ---------- | --------------------------- | ---------------------- | ------- | ------------------- |
| `rearm`    | the loader has to come back | 30/30                  | 30/30   | 0/30                |
| `suppress` | the loader must stay down   | 0/30                   | 0/30    | 0/30                |

`suppress` returning zero only means something because `rearm` returned thirty in the same sitting. Against `dist/` built from b06a2cb4, the commit before the fix, `rearm` reads 0/30: the loader never comes back for the second injection, which is the regression this step exists to catch.
