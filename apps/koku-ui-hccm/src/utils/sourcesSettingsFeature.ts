/**
 * Settings → Sources tab and the Scalprum `sources` MFE are only bundled for on-prem
 * (`webpack-onprem.config.ts`). SaaS builds use `fec.config.js` and compile this to false.
 */
export function isSourcesSettingsTabEnabled(): boolean {
  return process.env.KOKU_UI_SOURCES_SETTINGS_TAB === 'true';
}
