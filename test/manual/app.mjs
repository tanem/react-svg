// The screen-reader harness. See README.md for how to run it and what to
// record. No JSX: the page is served as-is with no build step, so the harness
// always exercises whatever `npm run build` last produced rather than a
// separately-compiled copy.

import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { ReactSVG } from 'react-svg'

const h = React.createElement

// Eight is enough for "one announcement per icon" to be unmistakable in the
// caption panel without flooding it.
const ICON_COUNT = 8
const iconSrcs = Array.from(
  { length: ICON_COUNT },
  (_, index) => `/icons/${index + 1}.svg`,
)

const stage = document.getElementById('stage')
const logElement = document.getElementById('log')

let root = null
let warmed = false

const log = (line) => {
  logElement.textContent += `\n${line}`
  logElement.scrollTop = logElement.scrollHeight
}

const clearLog = (line) => {
  logElement.textContent = line
}

// The loading components. Case A carries live-region semantics, which is how
// loading indicators are conventionally written; case B carries none. The
// answer plausibly differs between them, and that difference is what any
// documentation would have to say.
const statusLoading = (label) => () =>
  h('span', { 'data-loading': label, role: 'status' }, `Loading ${label}`)

const plainLoading = (label) => () =>
  h('span', { 'data-loading': label }, `Loading ${label}`)

// Hoisted rather than built per render like the two above. Step 5 re-renders
// the same root to swap `src`, and a fresh component type each time would make
// React unmount and remount the loading element on its own - mutations the
// probe would then count as the thing it is measuring.
const probeLoading = statusLoading('probe')

const Grid = ({ makeLoading, srcs }) =>
  h(
    'div',
    { className: 'grid' },
    srcs.map((src, index) =>
      h(ReactSVG, {
        key: src,
        loading: makeLoading ? makeLoading(index + 1) : undefined,
        src,
      }),
    ),
  )

// Records every loading element entering and leaving the DOM, with how long it
// stayed. Assistive technology observes the DOM rather than the screen, so
// this is the closest thing to the input AT actually receives — but it says
// nothing about whether an announcement was queued, which is why the caption
// panel is the real instrument.
const enteredAt = new Map()
const lifetimes = []

// Set while step 5 is running. That step does 30 runs a phase, so the
// per-element lines below would bury the result; it counts instead.
let probeRun = null

const noteLoadingNodes = (node, kind) => {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return
  }
  const matches = [
    ...(node.matches('[data-loading]') ? [node] : []),
    ...node.querySelectorAll('[data-loading]'),
  ]
  for (const element of matches) {
    if (probeRun) {
      if (kind === 'added' && probeRun.swapped) {
        probeRun.mountsAfterSwap += 1
      }
      continue
    }
    const label = element.dataset.loading
    if (kind === 'added') {
      enteredAt.set(label, performance.now())
      log(`  + loading ${label} entered the DOM`)
    } else {
      const start = enteredAt.get(label)
      if (start === undefined) {
        log(`  - loading ${label} left the DOM (never seen entering)`)
        continue
      }
      const lifetime = performance.now() - start
      lifetimes.push(lifetime)
      enteredAt.delete(label)
      log(`  - loading ${label} left the DOM after ${lifetime.toFixed(1)}ms`)
    }
  }
}

new MutationObserver((records) => {
  for (const record of records) {
    for (const node of record.addedNodes) {
      noteLoadingNodes(node, 'added')
    }
    for (const node of record.removedNodes) {
      noteLoadingNodes(node, 'removed')
    }
  }
}).observe(stage, { childList: true, subtree: true })

const readHits = async () => {
  const response = await fetch('/hits', { cache: 'no-store' })
  return (await response.json()).total
}

const mount = (element) => {
  root = createRoot(stage)
  root.render(element)
}

const unmount = () => {
  root?.unmount()
  root = null
}

const waitForInjections = (expected) =>
  new Promise((resolve, reject) => {
    const deadline = performance.now() + 15000
    const poll = () => {
      if (stage.querySelectorAll('.injected-svg').length >= expected) {
        resolve()
        return
      }
      if (performance.now() > deadline) {
        reject(new Error(`timed out waiting for ${expected} injections`))
        return
      }
      // setTimeout rather than requestAnimationFrame: rAF is paused in a
      // background tab, and the harness should not silently stall if the
      // window loses focus mid-run.
      setTimeout(poll, 16)
    }
    poll()
  })

const summarise = () => {
  if (lifetimes.length === 0) {
    log('  no loading element entered the DOM at all')
    return
  }
  const sorted = [...lifetimes].sort((a, b) => a - b)
  const median = sorted[Math.floor(sorted.length / 2)]
  log(
    `  ${lifetimes.length} loading element(s), median lifetime ${median.toFixed(1)}ms, ` +
      `range ${sorted[0].toFixed(1)}–${sorted[sorted.length - 1].toFixed(1)}ms`,
  )
}

const resetRun = () => {
  lifetimes.length = 0
  enteredAt.clear()
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Step 5's two phases. Both bring the loader up, then re-inject while the first
// request is still in flight and hold `loadingDelay` constant across the swap -
// the case where neither of the delay effect's dependencies moves, so nothing
// about the swap is visible to it unless the injection itself says so.
//
// They are each other's control. `rearm` gives the second injection long enough
// that the loader has to come back; `suppress` gives it less than the delay, so
// the loader must stay down. A zero from `suppress` only means something
// because `rearm` is non-zero in the same sitting: together they say the probe
// could see a loader and still saw none.
const PROBE_RUNS = 30

const PROBE_PHASES = [
  {
    expectation: 'the loader has to come back',
    firstMs: 600,
    loadingDelay: 80,
    name: 'rearm  ',
    secondMs: 600,
    swapAt: 200,
  },
  {
    expectation: 'the loader must stay down',
    firstMs: 800,
    loadingDelay: 300,
    name: 'suppress',
    secondMs: 120,
    swapAt: 400,
  },
]

// Three figures per phase, and they answer different questions.
//
// `mounted` comes from the MutationObserver and catches an element however
// briefly it existed. `painted` comes from rAF sampling and says whether one
// was ever on screen at a paint; a mount the frame count misses is real but
// sub-frame, which is the whole reason this step runs in a browser rather than
// in jsdom, where only the first figure is available at all.
//
// `lingering` is the one that keeps the other two honest. Both of those only
// see an element that arrives after the swap, so a loader left over from
// before it - the failure the flag-clearing in the injection effect exists to
// prevent - would read as two clean zeroes. Checking what is still on screen
// when the run ends closes that off.
const runProbePhase = async (phase) => {
  let lingering = 0
  let mounted = 0
  let painted = 0
  let voided = 0

  const render = (src) =>
    root.render(
      h(ReactSVG, {
        loading: probeLoading,
        loadingDelay: phase.loadingDelay,
        src,
      }),
    )

  for (let run = 0; run < PROBE_RUNS; run += 1) {
    const stamp = `${phase.name.trim()}-${run}-${performance.now().toFixed(0)}`

    probeRun = { mountsAfterSwap: 0, swapped: false }

    root = createRoot(stage)
    render(`/slow.svg?ms=${phase.firstMs}&n=${stamp}-a`)

    await sleep(phase.swapAt)

    // The loader has to be up before the swap, or there is no elapsed delay to
    // carry across it and the run exercises nothing.
    if (!stage.querySelector('[data-loading]')) {
      voided += 1
      unmount()
      continue
    }

    let sampling = true
    let frames = 0
    const sample = () => {
      if (!sampling) {
        return
      }
      // Only frames showing a loader that arrived after the swap. The one
      // already on screen keeps painting for a frame or two while React
      // commits the swap, and counting those would report a flash where there
      // is nothing but the tail of a legitimate loader.
      if (
        probeRun.mountsAfterSwap > 0 &&
        stage.querySelector('[data-loading]')
      ) {
        frames += 1
      }
      requestAnimationFrame(sample)
    }

    probeRun.swapped = true
    requestAnimationFrame(sample)
    render(`/slow.svg?ms=${phase.secondMs}&n=${stamp}-b`)

    await waitForInjections(1)
    sampling = false

    // svg-injector inserts the SVG and only then calls back, so the injection
    // is visible in the DOM a moment before React commits `isLoading` false
    // and pulls the loader. Settle first, or this reads that gap as a loader
    // the component failed to take down.
    await sleep(100)

    if (stage.querySelector('[data-loading]')) {
      lingering += 1
    }
    if (probeRun.mountsAfterSwap > 0) {
      mounted += 1
    }
    if (frames > 0) {
      painted += 1
    }

    unmount()
  }

  probeRun = null
  return { lingering, mounted, painted, voided }
}

const announcer = document.getElementById('announcer')
const insertionPoint = document.getElementById('insertion-point')

const steps = {
  // The instrument check, and it deliberately does not go near react-svg. It
  // changes the text of a live region that has been in the DOM since page
  // load, which is the pattern screen readers reliably announce. If this is
  // silent, VoiceOver is not reaching the caption panel and nothing else on
  // this page can be interpreted.
  //
  // Step 4 cannot do this job: it inserts an element that already carries
  // role="status" and its text, and whether AT announces a newly-inserted
  // live region is itself an open question — the same one the cached cases
  // turn on. Conflating the two would make a silent run unreadable.
  instrument() {
    unmount()
    resetRun()
    clearLog('Step 0: instrument check, no react-svg involved.')
    announcer.textContent = 'Instrument check, one two three'
    log('  live region text set; the caption panel must show it')
    setTimeout(() => {
      announcer.textContent = ''
    }, 5000)
  },

  // The mechanism check, and like step 0 it stays away from react-svg. Where
  // step 0 mutates a region already in the DOM, this inserts one that arrives
  // already carrying role="status" and its text — which is structurally what
  // react-svg does with a `loading` component, minus React and svg-injector.
  //
  // Read against step 0 it says whether any silence is about insertion versus
  // mutation, rather than about this package. If step 0 announces and this
  // does not, the finding belongs to the platform and react-svg merely
  // inherits it.
  inserted() {
    unmount()
    resetRun()
    clearLog('Step 0b: inserting a populated live region, no react-svg.')
    insertionPoint.replaceChildren()
    const region = document.createElement('div')
    region.setAttribute('role', 'status')
    region.textContent = 'Inserted region, four five six'
    insertionPoint.append(region)
    log('  populated role="status" element inserted')
    setTimeout(() => {
      insertionPoint.replaceChildren()
    }, 5000)
  },

  // Mounts the grid with no loading component at all, so nothing in this step
  // can announce, then unmounts. Its only job is to leave svg-injector's cache
  // holding all eight icons.
  async warm() {
    unmount()
    resetRun()
    clearLog('Step 1: warming the cache.')
    const before = await readHits()
    mount(h(Grid, { srcs: iconSrcs }))
    await waitForInjections(ICON_COUNT)
    const after = await readHits()
    unmount()
    log(`  ${ICON_COUNT} icons injected, ${after - before} request(s) served`)
    log('  stage cleared, cache warm')
    warmed = true
    for (const button of document.querySelectorAll(
      '[data-step="status"], [data-step="plain"]',
    )) {
      button.disabled = false
    }
    log('Ready. Watch the caption panel, then run step 2.')
  },

  // The only step that swaps `src` on a live component rather than remounting a
  // fresh tree, and the only one whose question needs a real browser: whether a
  // frame was ever painted with the loader on screen. Needs no screen reader,
  // so unlike the rest of this harness it reads the same however it is driven.
  async probe() {
    unmount()
    resetRun()
    clearLog(`Step 5: mid-flight re-injection, ${PROBE_RUNS} runs per phase.`)
    log('  keep this tab foregrounded - rAF stops in a background tab')

    const results = []
    for (const phase of PROBE_PHASES) {
      log(`  ${phase.name}  ${phase.expectation}`)
      const result = await runProbePhase(phase)
      results.push(result)
      log(
        `            mounted after the swap ${result.mounted}/${PROBE_RUNS}, ` +
          `painted ${result.painted}/${PROBE_RUNS}, ` +
          `still up at the end ${result.lingering}/${PROBE_RUNS}` +
          (result.voided ? `, ${result.voided} void` : ''),
      )
    }

    const [rearm, suppress] = results
    log('')
    log(
      rearm.mounted === PROBE_RUNS &&
        suppress.mounted === 0 &&
        rearm.lingering === 0 &&
        suppress.lingering === 0
        ? '  PASS: the delay re-arms for the second injection, and still holds' +
            ' back a loader the injection beats'
        : '  FAIL: read the three figures against each other before believing' +
            ' any of them',
    )
  },

  async status() {
    await cachedRemount('A', statusLoading, 'role="status"')
  },

  async plain() {
    await cachedRemount('B', plainLoading, 'plain span, no live region')
  },

  // A cold load held open for seconds, so the loading element is mounted for
  // a human-scale stretch rather than a couple of milliseconds. Read against
  // the cached cases this separates two different reasons for silence: if this
  // announces and the cached cases do not, lifetime is what matters; if
  // neither announces while step 0 does, react-svg's loading element never
  // announces at all, because it is always freshly inserted rather than a
  // region already present whose content changed.
  async control() {
    unmount()
    resetRun()
    clearLog('Step 4: slow cold load, role="status", ~2.5s response.')
    const src = `/slow.svg?ms=2500&n=${performance.now().toFixed(0)}`
    mount(
      h(Grid, {
        makeLoading: () => statusLoading('slow control'),
        srcs: [src],
      }),
    )
    await waitForInjections(1)
    summarise()
    log('  read this one against step 0 and the cached cases')
  },
}

// Both cached cases are the same procedure with a different loading component,
// and the request delta is the part that matters: it has to be 0, or the
// remount refetched and is not the cache-hit path this ticket is about.
const cachedRemount = async (name, makeLoading, description) => {
  if (!warmed) {
    log('Run step 1 first.')
    return
  }
  unmount()
  resetRun()
  clearLog(`Case ${name}: cached remount, ${description}.`)
  const before = await readHits()
  mount(h(Grid, { makeLoading, srcs: iconSrcs }))
  await waitForInjections(ICON_COUNT)
  const after = await readHits()
  const requests = after - before
  summarise()
  log(
    requests === 0
      ? '  0 requests served: every injection came from the cache'
      : `  ${requests} request(s) served — NOT a cache hit, this run is void`,
  )
}

document.querySelector('.steps').addEventListener('click', async (event) => {
  const step = event.target.dataset?.step
  if (!step) {
    return
  }
  if (step === 'reset') {
    unmount()
    resetRun()
    clearLog('Reset. Run step 1.')
    return
  }
  try {
    await steps[step]()
  } catch (error) {
    log(`  failed: ${error.message}`)
  }
})
