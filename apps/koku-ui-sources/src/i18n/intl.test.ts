import { getLocale, ignoreDefaultMessageError } from './intl';

describe('intl', () => {
  it('returns a locale from the navigator', () => {
    expect(getLocale().length).toBeGreaterThan(0);
  });

  it('ignores MISSING_TRANSLATION errors', () => {
    expect(() => ignoreDefaultMessageError({ code: 'MISSING_TRANSLATION' })).not.toThrow();
  });

  it('rethrows other errors', () => {
    expect(() => ignoreDefaultMessageError({ code: 'MISSING_DATA' })).toThrow();
    expect(() => ignoreDefaultMessageError({})).toThrow();
  });
});
