/**
 * How this repo's manifests declare their dependencies, as checks.
 * `check-dependencies.mts` reads the manifests and runs them.
 */
export interface Manifest {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

const EXACT_VERSION = /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/

/**
 * devDependencies are pinned, so a build only changes when a Renovate PR says
 * so. dependencies keep caret ranges, so consumers can dedupe them and pick up
 * fixes without waiting on a release here.
 */
export const checkRanges = ({
  dependencies = {},
  devDependencies = {},
}: Manifest) => [
  ...Object.entries(devDependencies)
    .filter(([, range]) => !EXACT_VERSION.test(range))
    .map(
      ([name, range]) =>
        `devDependencies.${name} is "${range}". Pin it to an exact version: npm install --save-dev --save-exact ${name}@<version>.`,
    ),
  ...Object.entries(dependencies)
    .filter(([, range]) => !range.startsWith('^'))
    .map(
      ([name, range]) =>
        `dependencies.${name} is "${range}". Use a caret range, such as "^${range.replace(/^\D*/, '')}", so consumers can dedupe it.`,
    ),
]

/**
 * The dependencies each example's CodeSandbox template decides: react-vite or
 * react-vite-ts for the Vite examples, nextjs for the Next.js one. Renovate
 * skips examples/, so they move by hand, and every example on one template
 * has to move together.
 */
const PLATFORM_DEPENDENCIES = [
  '@types/react',
  '@types/react-dom',
  '@vitejs/plugin-react',
  'next',
  'typescript',
  'vite',
]

export const checkExamples = (
  examples: { manifest: Manifest; name: string }[],
) => {
  const versions = new Map<string, Map<string, string[]>>()

  for (const { manifest, name } of examples) {
    const declared = { ...manifest.dependencies, ...manifest.devDependencies }
    const template = 'next' in declared ? 'Next.js' : 'Vite'

    for (const dependency of PLATFORM_DEPENDENCIES) {
      const range = declared[dependency]
      if (range === undefined) continue

      const key = `${dependency} across the ${template} examples`
      const byRange = versions.get(key) ?? new Map<string, string[]>()
      byRange.set(range, [...(byRange.get(range) ?? []), name])
      versions.set(key, byRange)
    }
  }

  return [...versions]
    .filter(([, byRange]) => byRange.size > 1)
    .map(
      ([key, byRange]) =>
        `${key} differs: ${[...byRange].map(([range, names]) => `${range} in ${names.join(', ')}`).join('; ')}. Move every example on a template together, as far as the template has.`,
    )
}
