import { getLocale, ignoreDefaultMessageError } from './intl';

describe('i18n intl', () => {
  test('getLocale returns a language code', () => {
    expect(getLocale()).toMatch(/^[a-z]{2}/);
  });

  test('ignoreDefaultMessageError swallows missing translations', () => {
    expect(() => ignoreDefaultMessageError({ code: 'MISSING_TRANSLATION' })).not.toThrow();
  });

  test('ignoreDefaultMessageError rethrows other errors', () => {
    expect(() => ignoreDefaultMessageError({ code: 'OTHER' })).toThrow();
  });
});
