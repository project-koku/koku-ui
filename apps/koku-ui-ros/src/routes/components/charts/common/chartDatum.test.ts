import { intl } from 'components/i18n';
import messages from 'locales/messages';

import { getTooltipContent } from './chartDatum';

jest.spyOn(intl, 'formatMessage');

const labelFormatFunc = getTooltipContent(jest.fn(v => v));

describe('getTooltipContent', () => {
  test('format hrs and gb', () => {
    [
      { unit: 'cores', withTranslation: messages.unitTooltips },
      { unit: 'gi', withTranslation: messages.unitTooltips },
      { unit: 'mi', withTranslation: messages.unitTooltips },
    ].forEach(tc => {
      labelFormatFunc(10, tc.unit);
      expect(intl.formatMessage).toHaveBeenCalledWith(tc.withTranslation, { units: 'cores', value: 10 });
    });
  });
  test('format unknown units', () => {
    expect(intl.formatMessage).not.toHaveBeenCalled();
    expect(labelFormatFunc(10)).toBe(10);
  });
});
