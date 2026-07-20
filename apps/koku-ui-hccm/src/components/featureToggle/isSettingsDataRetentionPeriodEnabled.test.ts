describe('isSettingsDataRetentionPeriodEnabled', () => {
  const original = process.env.KOKU_UI_SETTINGS_DATA_RETENTION_PERIOD;

  const loadIsSettingsDataRetentionPeriodEnabled = (): boolean => {
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('./featureToggle').isSettingsDataRetentionPeriodEnabled;
  };

  afterEach(() => {
    jest.resetModules();
    if (original === undefined) {
      delete process.env.KOKU_UI_SETTINGS_DATA_RETENTION_PERIOD;
    } else {
      process.env.KOKU_UI_SETTINGS_DATA_RETENTION_PERIOD = original;
    }
  });

  it('is false when env is unset', () => {
    delete process.env.KOKU_UI_SETTINGS_DATA_RETENTION_PERIOD;
    expect(loadIsSettingsDataRetentionPeriodEnabled()).toBe(false);
  });

  it('is false when env is not the string true', () => {
    process.env.KOKU_UI_SETTINGS_DATA_RETENTION_PERIOD = 'false';
    expect(loadIsSettingsDataRetentionPeriodEnabled()).toBe(false);
  });

  it('is true when env is the string true', () => {
    process.env.KOKU_UI_SETTINGS_DATA_RETENTION_PERIOD = 'true';
    expect(loadIsSettingsDataRetentionPeriodEnabled()).toBe(true);
  });
});
