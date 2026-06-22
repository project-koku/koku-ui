describe('isSettingsSourcesTabEnabled', () => {
  const original = process.env.KOKU_UI_SETTINGS_SOURCES_TAB;

  const loadIsSettingsSourcesTabEnabled = (): boolean => {
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('./featureToggle').isSettingsSourcesTabEnabled;
  };

  afterEach(() => {
    jest.resetModules();
    if (original === undefined) {
      delete process.env.KOKU_UI_SETTINGS_SOURCES_TAB;
    } else {
      process.env.KOKU_UI_SETTINGS_SOURCES_TAB = original;
    }
  });

  it('is false when env is unset (e.g. Jest / local node)', () => {
    delete process.env.KOKU_UI_SETTINGS_SOURCES_TAB;
    expect(loadIsSettingsSourcesTabEnabled()).toBe(false);
  });

  it('is false when env is not the string true', () => {
    process.env.KOKU_UI_SETTINGS_SOURCES_TAB = 'false';
    expect(loadIsSettingsSourcesTabEnabled()).toBe(false);
  });

  it('is true when env is the string true', () => {
    process.env.KOKU_UI_SETTINGS_SOURCES_TAB = 'true';
    expect(loadIsSettingsSourcesTabEnabled()).toBe(true);
  });
});
