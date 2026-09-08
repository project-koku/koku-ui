describe('isOnPremEnabled', () => {
  const original = process.env.KOKU_UI_ONPREM_ENABLED;

  const loadIsOnPremEnabled = (): boolean => {
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('./featureToggle').isOnPremEnabled;
  };

  afterEach(() => {
    jest.resetModules();
    if (original === undefined) {
      delete process.env.KOKU_UI_ONPREM_ENABLED;
    } else {
      process.env.KOKU_UI_ONPREM_ENABLED = original;
    }
  });

  it('is false when env is unset (e.g. Jest / local node)', () => {
    delete process.env.KOKU_UI_ONPREM_ENABLED;
    expect(loadIsOnPremEnabled()).toBe(false);
  });

  it('is false when env is not the string true', () => {
    process.env.KOKU_UI_ONPREM_ENABLED = 'false';
    expect(loadIsOnPremEnabled()).toBe(false);
  });

  it('is true when env is the string true', () => {
    process.env.KOKU_UI_ONPREM_ENABLED = 'true';
    expect(loadIsOnPremEnabled()).toBe(true);
  });
});
