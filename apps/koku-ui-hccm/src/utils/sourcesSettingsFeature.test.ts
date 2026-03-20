import { isSourcesSettingsTabEnabled } from './sourcesSettingsFeature';

describe('isSourcesSettingsTabEnabled', () => {
  const original = process.env.KOKU_UI_SOURCES_SETTINGS_TAB;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.KOKU_UI_SOURCES_SETTINGS_TAB;
    } else {
      process.env.KOKU_UI_SOURCES_SETTINGS_TAB = original;
    }
  });

  it('is false when env is unset (e.g. Jest / local node)', () => {
    delete process.env.KOKU_UI_SOURCES_SETTINGS_TAB;
    expect(isSourcesSettingsTabEnabled()).toBe(false);
  });

  it('is false when env is not the string true', () => {
    process.env.KOKU_UI_SOURCES_SETTINGS_TAB = 'false';
    expect(isSourcesSettingsTabEnabled()).toBe(false);
  });

  it('is true when env is the string true', () => {
    process.env.KOKU_UI_SOURCES_SETTINGS_TAB = 'true';
    expect(isSourcesSettingsTabEnabled()).toBe(true);
  });
});
