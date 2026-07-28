/** Query param for Settings → Sources deep-links (COST-7661). */
export const SETTINGS_SOURCE_PARAM = 'source';

/**
 * On-prem Settings href for Sources list (`?source`) or detail (`?source=<uuid>`).
 */
export function buildOnPremSettingsSourceHref(settingsPath: string, uuid?: string | null): string {
  if (uuid) {
    return `${settingsPath}?${SETTINGS_SOURCE_PARAM}=${encodeURIComponent(uuid)}`;
  }
  return `${settingsPath}?${SETTINGS_SOURCE_PARAM}`;
}

/** Index of tab id in available tabs, or -1 if missing. */
export function findTabIndexById(tabs: { tab: string }[], tabId: string): number {
  return tabs.findIndex(t => t.tab === tabId);
}
