const mockGetUser = jest.fn(async () => ({ account_number: '12345' }));

jest.mock('../init', () => ({
  getUserIdentity: mockGetUser,
}))

let utils: any;

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  sessionStorage.clear();
  // Shared module under test
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  utils = require('./sessionStorage');
});

describe('utils/sessionStorage', () => {
  test('get/set item creates storage with account number', async () => {
    expect(utils.getStorage()).toBeUndefined();
    await utils.setItem('foo', 'bar');
    const storage = utils.getStorage();
    expect(storage.account_number).toBe('12345');
    expect(utils.getItem('foo')).toBe('bar');
  });

  test('setItem ignores falsy values', async () => {
    await utils.setItem('foo', undefined as any);
    expect(utils.getStorage()).toBeUndefined();
  });

  type AvailabilityCase = {
    label: string;
    get: keyof typeof utils;
    is: keyof typeof utils;
    set: keyof typeof utils;
    setValue: string;
    defaultValue?: string;
  };

  const availabilityCases: AvailabilityCase[] = [
    {
      label: 'cost distribution',
      get: 'getCostDistribution',
      is: 'isCostDistributionAvailable',
      set: 'setCostDistribution',
      setValue: 'raw',
    },
    {
      label: 'cost type',
      get: 'getCostType',
      is: 'isCostTypeAvailable',
      set: 'setCostType',
      setValue: 'blended',
    },
    {
      label: 'currency',
      get: 'getCurrency',
      is: 'isCurrencyAvailable',
      set: 'setCurrency',
      setValue: 'EUR',
      defaultValue: 'USD',
    },
  ];

  test.each(availabilityCases)('helpers: %s', async ({ get, is, set, setValue, defaultValue }) => {
    await utils.setItem('init', '1');
    if (defaultValue) {
      expect(utils[get]()).toBe(defaultValue);
    } else {
      expect(utils[get]()).toBeDefined();
    }
    expect(utils[is]()).toBeFalsy();
    utils[set](setValue);
    expect(utils[is]()).toBeTruthy();
    expect(utils[get]()).toBe(setValue);
  });

  test('account currency helpers', async () => {
    await utils.setItem('init', '1');
    expect(utils.getAccountCurrency()).toBe('USD');
    utils.setAccountCurrency('GBP');
    expect(utils.getAccountCurrency()).toBe('GBP');
  });

  test('inactive sources helpers and session validity', async () => {
    await utils.setItem('init', '1');
    expect(utils.getInactiveSources()).toBeUndefined();
    utils.setInactiveSources('my-sources');
    expect(utils.getInactiveSources()).toBe('my-sources');
    expect(utils.isInactiveSourcesValid()).toBeTruthy();
    utils.deleteInactiveSources();
    expect(utils.getInactiveSources()).toBeUndefined();
  });

  test('invalidateSession removes storage when account changes', async () => {
    jest.useRealTimers();
    await utils.setItem('foo', 'bar');
    // change user
    mockGetUser.mockResolvedValueOnce({ identity: { account_number: '99999' } });
    utils.invalidateSession();
    await new Promise(res => setTimeout(res, 0));
    expect(sessionStorage.getItem('cost_management')).toBeNull();
  });

  test('invalidateSession(force) removes storage', async () => {
    await utils.setItem('foo', 'bar');
    utils.invalidateSession(true);
    expect(sessionStorage.getItem('cost_management')).toBeNull();
  });
}); 