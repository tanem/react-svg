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
