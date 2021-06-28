jest.mock('i18next');

import { createIntlEnv } from 'components/i18n/localeEnv';
import messages from 'locales/messages';

describe('getTooltipContent', () => {
  test('format hrs and gb', () => {
    const intl = createIntlEnv();
    [
      { unit: 'hrs', golden: 'hrs', withTranslation: messages.UnitTooltips },
      { unit: 'gb', golden: 'GB', withTranslation: messages.UnitTooltips },
      { unit: 'gbMo', golden: 'GB-month', withTranslation: messages.UnitTooltips },
    ].forEach(tc => {
      const labelFormatFunc = (value, unit) => {
        return value + ' EN ' + unit;
      };
      const tValue = labelFormatFunc(10, tc.golden);
      expect(tValue).toEqual(intl.formatMessage(tc.withTranslation, { unit: tc.unit, value: '10' }));
    });
  });
  test('format unknown units', () => {
    const intl = createIntlEnv();
    expect('EN 10').toEqual(intl.formatMessage(messages.UnitTooltips, { unit: 'bogus', value: '10' }));
  });
});
