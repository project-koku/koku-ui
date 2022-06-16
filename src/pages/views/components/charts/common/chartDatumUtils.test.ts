import { intl } from 'components/i18n';
import messages from 'locales/messages';

import { getTooltipContent, transformReport } from './chartDatumUtils';
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
      expect(intl.formatMessage).toBeCalledWith(tc.withTranslation, { units: 'hrs', value: 10 });
    });
  });
  test('format unknown units', () => {
    expect(intl.formatMessage).not.toBeCalled();
    expect(labelFormatFunc(10)).toBe(10);
  });
});
