import { intl } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/i18n/locales/messages';

import { getTooltipContent, transformReport } from './chartDatum';
import { transformReportProps } from './testProps/transformReportProps';
import { transformReportReturns } from './testProps/transformReportReturns';

jest.spyOn(intl, 'formatMessage');

const labelFormatFunc = getTooltipContent(jest.fn(v => v));

describe('transformReport', () => {
  test('should return transformed report', () => {
    expect(
      transformReport(
        transformReportProps.report,
        transformReportProps.type,
        transformReportProps.idKey,
        transformReportProps.reportItem,
        transformReportProps.reportItemValue
      )
    ).toStrictEqual(transformReportReturns);
  });
});
describe('getTooltipContent', () => {
  test('format hrs and gb', () => {
    [
      { unit: 'hrs', withTranslation: messages.unitTooltips },
      { unit: 'gb', withTranslation: messages.unitTooltips },
      { unit: 'gb-mo', withTranslation: messages.unitTooltips },
    ].forEach(tc => {
      labelFormatFunc(10, tc.unit);
      expect(intl.formatMessage).toHaveBeenCalledWith(tc.withTranslation, { units: 'hrs', value: 10 });
    });
  });
  test('format unknown units', () => {
    expect(intl.formatMessage).not.toHaveBeenCalled();
    expect(labelFormatFunc(10)).toBe(10);
  });
});
