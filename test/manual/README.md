# Manual screen-reader checks

A node server and a page driven by hand under VoiceOver. It answers the
accessibility questions the jsdom suite structurally cannot, and it is
deliberately not wired into CI: the instrument is a real screen reader, and
automating it would mean simulating the thing it exists to escape.

Run it, and update the recorded runs below, when you change the ARIA wiring or
the `loading` element's lifecycle.

## Running it

```
npm run build
node test/manual/server.mjs
```

Then open <http://localhost:4191>, with:

- **VoiceOver on, caption panel open** (`VO`+`Command`+`F10`). The panel shows
  queued announcements as text, which is the whole reason it is the instrument
  of choice here.
- **The window foregrounded** for the entire run.

Safari is the representative pairing for VoiceOver. Worth a second run in Chrome
if the two disagree, since the AT-to-browser bridge differs.

## The steps

Run them in order. Each prints a DOM log; the caption panel is what you are
actually reading.

- **0 — check the instrument.** Changes the text of a live region that has been
  in the DOM since page load. No react-svg involved. This is the canonical
  live-region pattern, the one screen readers reliably announce, so it must
  appear in the caption panel. If it does not, VoiceOver is not reaching the
  panel and nothing else here can be read.
- **0b — insert a populated live region.** Inserts a `role="status"` element
  that arrives with its text already in it, again with no react-svg involved.
  Structurally that is what react-svg does with a `loading` component, minus
  React and svg-injector, so read against step 0 it puts any silence on the
  platform rather than on this package.
- **1 — warm the cache.** Mounts eight icons with no `loading` component at all,
  waits for injection, unmounts. Nothing here can announce; it exists only to
  leave svg-injector's cache holding all eight.
- **A — cached remount, `role="status"`.** Remounts the same eight `src`s with a
  loading component carrying live-region semantics, which is how loading
  indicators are conventionally written. The log must report `0 requests
  served`; anything else means the remount refetched and the run is void.
- **B — cached remount, plain span.** The same again with no live-region
  semantics.
- **4 — slow cold load, `role="status"`.** A cold load held open for ~2.5
  seconds, so the loading element is mounted for a human-scale stretch rather
  than a couple of milliseconds. It is **not** the instrument check, though an
  earlier version of this harness treated it as one: it inserts an element that
  already carries its text, which is the open question the cached cases turn on,
  so a silent step 4 cannot tell a broken setup apart from a real finding. Step
  0 is the only step that can.
- **5 — mid-flight re-injection probe.** The odd one out, and the only step that
  swaps `src` on a live component rather than remounting a fresh tree. Sets
  `loadingDelay`, re-injects while the first request is still in flight, and
  samples `requestAnimationFrame` to see whether a frame was ever painted with
  the loader on screen. Two phases that control each other: `rearm` gives the
  second injection long enough that the loader has to come back, `suppress`
  gives it less than the delay so the loader must stay down. Needs no screen
  reader, only a foregrounded tab — rAF stops in a background one. Takes about a
  minute, and is recorded separately below.

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

## Why the harness looks the way it does

**The question it answers.** Does a briefly-mounted `loading` element announce?
svg-injector defers its callbacks, so a second mount of the same `src` commits
the `loading` element and removes it a couple of milliseconds later —
`should render the specified loader for a cached src` in `test/browser.spec.tsx`
pins that DOM behaviour. Whether a screen reader queues an announcement for an
element with that lifetime is what the suite cannot answer, since assistive
technology observes the DOM rather than the screen. A cold load has always
mounted and unmounted `loading`; what changed is how often, so report any
finding as a frequency change rather than a new defect.

**Why it can't be automated.** jsdom has no accessibility layer and no paint, so
every accessibility claim this package makes is pinned as markup: `role="img"`
set, `<title>` and `<desc>` present, `aria-labelledby` pointing at their IDs.
Nothing in the suite observes what assistive technology does with any of it.
That gap matters here more than in most repos, because svg-injector ships no
ARIA behaviour of its own — the wiring and the `loading` element are the whole
contract, and this repo owns all of it.

**What the DOM log is and is not.** It records each loading element entering and
leaving the DOM, and how long it stayed, which tells an _absence of
announcements_ apart from an _absence of loading elements_. It does not prove
anything was announced. Do not report a finding from the log alone.

**Where the page's code comes from.** The working tree: react-svg from `dist/`,
svg-injector and React from `node_modules/`. So it tests the build in front of
you, needs no network, and has no second React version to keep in step with
`package.json`. React ships no ES module build, so `server.mjs` wraps the CJS
files it does ship, `index.html` loads them as classic scripts first, and the
import map points `react` and `react-dom/client` at shims over those globals —
which is how `dist/react-svg.mjs` resolves `react` to react-dom's instance.

**The pieces that look incidental.** Each one is a wrong turn already taken once.

| Piece                        | Covers                                                                                                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Step 0 against step 0b       | Mutation versus insertion. Without it a silent run cannot be told from a broken setup, which is exactly what happened first.                                |
| The `/hits` delta            | Proves a cached remount did not refetch. The screen looks identical either way, so nothing else would catch it.                                             |
| The MutationObserver log     | Tells "nothing announced" apart from "no loading element ever appeared".                                                                                    |
| Port 4191, not 4190          | 4190 is ManageSieve, on the Fetch standard's blocked port list. WebKit refuses to connect and shows `about:blank`; Chromium loads it and hides the problem.  |
| Visually hidden live regions | A visible region gets read as an announcement. This produced a contradictory reading before the region was hidden.                                          |

## What it doesn't cover

Only the probe sets `loadingDelay`, so steps 0 through 4 are a no-regression
check on the default path rather than coverage of the prop — a delay long enough
to suppress the mount leaves no element to announce, which the DOM log settles
without a screen reader.

Step 5 covers only the mid-flight re-injection path, and only the paint
question. A re-injection starting after the previous one has finished is
exercised nowhere, since A and B remount a fresh tree rather than swapping `src`
on a live component. The probe's frame count is a floor, not a measurement: rAF
samples at about 60Hz, so a mount shorter than a frame can be real and go
uncounted. Mounts are the sensitive figure.

Extending the harness to the `role="img"` / `<title>` / `<desc>` /
`aria-labelledby` path is the obvious next use, and has not been done.

## Last run

19.0.0 plus the `loadingDelay` work and the mid-flight re-injection fix,
2026-08-06, Safari 26.5 on macOS 15.7.7, VoiceOver with the caption panel open:

| Case                                                    | Caption panel | DOM                                                 |
| ------------------------------------------------------- | ------------- | --------------------------------------------------- |
| 0 — existing live region, text changed                  | announces     | n/a                                                 |
| 0b — `role="status"` element inserted already-populated | silent        | n/a                                                 |
| A — cached remount, `role="status"`                     | silent        | 8 elements, median 7.0ms, range 6.0-7.0, 0 requests |
| B — cached remount, plain span                          | silent        | 8 elements, median 8.0ms, range 7.0-8.0, 0 requests |
| 4 — `loading`, `role="status"`, ~2.5s mounted           | silent        | 1 element, 2514.0ms                                 |

**No announcement, and lifetime is not the variable.** VoiceOver announces a
live region whose content changes and ignores one that arrives already
populated. Step 0b establishes that with neither React nor svg-injector in the
picture, so it is platform behaviour react-svg inherits — React always mounts
`loading` as a complete element, the second shape. 2.5 seconds was as silent as
7ms, and live-region semantics made no difference. Unchanged across all three
recorded runs.

Lifetimes drift about a millisecond a run — B's median has gone 2.0ms, 7.0ms,
8.0ms across the three — while the shape never changes. At this scale that
tracks the machine and browser build rather than the package, so it is recorded
rather than read as a change.

The mechanics were re-checked in Chrome 151 on 2026-08-04, after the move here
and to React from `node_modules`: all six steps ran, both cached remounts served
0 requests, the control held its loading element for 2509ms, and the console was
clean apart from React's DevTools notice. No screen reader was running, so that
run says only that the harness works.

## Last probe run

Recorded separately because it is a different instrument: needing no screen
reader, it reads the same however it is driven and can be re-run by anyone.

Chrome 151 on macOS, 30 runs per phase, against `dist/` built from this commit:

| Phase      | Expectation                | Mounted after the swap | Painted | Still up at the end |
| ---------- | -------------------------- | ---------------------- | ------- | ------------------- |
| `rearm`    | the loader has to come back | 30/30                  | 30/30   | 0/30                |
| `suppress` | the loader must stay down   | 0/30                   | 0/30    | 0/30                |

**The two phases are each other's control.** `suppress` returning zero only
means something because `rearm` returned thirty in the same sitting: together
they say the probe could see a loader and still saw none where none belonged.
Run against `dist/` built from b06a2cb4, the commit before the fix, `rearm`
reads 0/30 instead — the loader never comes back for the second injection, which
is the regression the fix closes and the reason this step exists.

Two figures were wrong before they were right, and both were the probe rather
than the package. Counting every frame after the swap reported `suppress` as
3/30 painted, because the loader already legitimately on screen keeps painting
for a frame or two while React commits the swap; the count now ignores any
element that did not arrive after the swap. And checking what was still on
screen the moment `.injected-svg` appeared reported `rearm` as 1/30 lingering,
because svg-injector inserts the SVG before it calls back, so React has not yet
committed `isLoading` false; the check now settles first.
