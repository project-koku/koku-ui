const mockGetUser = jest.fn(async () => ({ identity: { account_number: '12345' } }));

let utils: typeof import('./sessionStorage');

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  (window as any).insights = { chrome: { auth: { getUser: mockGetUser } } };
  sessionStorage.clear();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
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

  test('removeItem clears a stored value', async () => {
    await utils.setItem('foo', 'bar');
    utils.removeItem('foo');
    expect(utils.getItem('foo')).toBeUndefined();
  });

  test('removeItem is a no-op when storage is empty', () => {
    expect(() => utils.removeItem('foo')).not.toThrow();
  });

  test('currency helpers', async () => {
    await utils.setItem('init', '1');
    expect(utils.getCurrency()).toBe('USD');
    expect(utils.getAccountCurrency()).toBe('USD');
    expect(utils.isCurrencyAvailable()).toBeFalsy();
    utils.setCurrency('EUR');
    utils.setAccountCurrency('GBP');
    expect(utils.isCurrencyAvailable()).toBeTruthy();
    expect(utils.getCurrency()).toBe('EUR');
    expect(utils.getAccountCurrency()).toBe('GBP');
  });

  test('invalidateSession removes storage when account changes', async () => {
    jest.useRealTimers();
    await utils.setItem('foo', 'bar');
    mockGetUser.mockResolvedValueOnce({ identity: { account_number: '99999' } });
    utils.invalidateSession();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(sessionStorage.getItem('cost_management_ros')).toBeNull();
  });

  test('invalidateSession keeps storage when account matches', async () => {
    jest.useRealTimers();
    await utils.setItem('foo', 'bar');
    utils.invalidateSession();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(sessionStorage.getItem('cost_management_ros')).not.toBeNull();
  });

  test('invalidateSession keeps storage when account number is missing', async () => {
    jest.useRealTimers();
    sessionStorage.setItem('cost_management_ros', JSON.stringify({ currency: 'USD' }));
    utils.invalidateSession();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(sessionStorage.getItem('cost_management_ros')).not.toBeNull();
  });

  test('invalidateSession(force) removes storage', async () => {
    await utils.setItem('foo', 'bar');
    utils.invalidateSession(true);
    expect(sessionStorage.getItem('cost_management_ros')).toBeNull();
  });
});
