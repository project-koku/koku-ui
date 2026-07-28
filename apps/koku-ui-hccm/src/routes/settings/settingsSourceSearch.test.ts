import { buildOnPremSettingsSourceHref, findTabIndexById, SETTINGS_SOURCE_PARAM } from './settingsSourceSearch';

describe('settingsSourceSearch', () => {
  describe('buildOnPremSettingsSourceHref', () => {
    const base = '/openshift/cost-management/settings';

    it('builds detail href with encoded uuid', () => {
      expect(buildOnPremSettingsSourceHref(base, 'abc-123')).toBe(`${base}?${SETTINGS_SOURCE_PARAM}=abc-123`);
      expect(buildOnPremSettingsSourceHref(base, 'a b')).toBe(`${base}?${SETTINGS_SOURCE_PARAM}=a%20b`);
    });

    it('builds list href with empty source param', () => {
      expect(buildOnPremSettingsSourceHref(base)).toBe(`${base}?${SETTINGS_SOURCE_PARAM}`);
      expect(buildOnPremSettingsSourceHref(base, null)).toBe(`${base}?${SETTINGS_SOURCE_PARAM}`);
      expect(buildOnPremSettingsSourceHref(base, undefined)).toBe(`${base}?${SETTINGS_SOURCE_PARAM}`);
    });
  });

  describe('findTabIndexById', () => {
    const tabs = [{ tab: 'cost_models' }, { tab: 'tags' }, { tab: 'sources' }];

    it('returns index of matching tab', () => {
      expect(findTabIndexById(tabs, 'sources')).toBe(2);
    });

    it('returns -1 when missing', () => {
      expect(findTabIndexById(tabs.slice(0, 2), 'sources')).toBe(-1);
    });
  });
});
