import { intl } from 'components/i18n';
import messages from 'locales/messages';

import { getTooltipContent } from './chartDatumUtils';

jest.spyOn(intl, 'formatMessage');

const labelFormatFunc = getTooltipContent(jest.fn(v => v));

describe('getTooltipContent', () => {
  test('format hrs and gb', () => {
    [
      { unit: 'hrs', withTranslation: messages.UnitTooltips },
      { unit: 'gb', withTranslation: messages.UnitTooltips },
      { unit: 'gb-mo', withTranslation: messages.UnitTooltips },
    ].forEach(tc => {
      labelFormatFunc(10, tc.unit);
      expect(intl.formatMessage).toBeCalledWith(tc.withTranslation, { units: 'hrs', value: 10 });
    });
  });
  test('format unknown units', () => {
    expect(intl.formatMessage).not.toBeCalled();
    expect(labelFormatFunc(10)).toBe(10);
  });
});
