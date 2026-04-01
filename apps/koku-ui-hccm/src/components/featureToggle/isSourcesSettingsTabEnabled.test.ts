describe('isSourcesSettingsTabEnabled', () => {
  const original = process.env.KOKU_UI_SOURCES_SETTINGS_TAB;

  const loadIsSourcesSettingsTabEnabled = (): boolean => {
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('./featureToggle').isSourcesSettingsTabEnabled;
  };

  afterEach(() => {
    jest.resetModules();
    if (original === undefined) {
      delete process.env.KOKU_UI_SOURCES_SETTINGS_TAB;
    } else {
      process.env.KOKU_UI_SOURCES_SETTINGS_TAB = original;
    }
  });

  it('is false when env is unset (e.g. Jest / local node)', () => {
    delete process.env.KOKU_UI_SOURCES_SETTINGS_TAB;
    expect(loadIsSourcesSettingsTabEnabled()).toBe(false);
  });

  it('is false when env is not the string true', () => {
    process.env.KOKU_UI_SOURCES_SETTINGS_TAB = 'false';
    expect(loadIsSourcesSettingsTabEnabled()).toBe(false);
  });

  it('is true when env is the string true', () => {
    process.env.KOKU_UI_SOURCES_SETTINGS_TAB = 'true';
    expect(loadIsSourcesSettingsTabEnabled()).toBe(true);
  });
});
