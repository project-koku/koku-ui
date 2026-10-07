import { ReportPathsType, ReportType } from 'api/reports/report';
import { SettingsType } from 'api/settings';
import messages from 'locales/messages';

import { ExportSubmitBase } from './exportSubmit';

jest.mock('utils/dates', () => ({
  getToday: () => new Date(2026, 7, 1),
}));

jest.mock('components/featureToggle', () => ({
  isOnPremEnabled: false,
}));

const createSubmit = (overrides: Partial<ConstructorParameters<typeof ExportSubmitBase>[0]> = {}) => {
  const formatMessage = jest.fn((message, values) => {
    if (message?.id === messages.exportFileName.id) {
      if (values?.groupBy === 'currency') {
        return `exchange_rates_${values.date}`;
      }
      return `${values?.provider}_${values?.groupBy}_${values?.resolution}_${values?.startDate}_${values?.endDate}`;
    }
    return message?.id ?? '';
  });

  const props = {
    dateFilter: undefined,
    endDate: '2026-08-31',
    exportError: null,
    exportFetchStatus: undefined,
    exportPathsType: SettingsType.currency,
    exportQueryString: 'limit=10',
    exportReport: undefined,
    exportType: SettingsType.currency,
    formatType: 'csv' as const,
    groupBy: 'currency',
    intl: { formatMessage },
    isAllItems: true,
    onClose: jest.fn(),
    onError: jest.fn(),
    resolution: undefined,
    startDate: '2026-08-01',
    ...overrides,
  };

  return {
    formatMessage,
    instance: new ExportSubmitBase(props as any, {} as any),
  };
};

describe('ExportSubmit getFileName', () => {
  test('uses exchange_rates_<today> for currency exports', () => {
    const { formatMessage, instance } = createSubmit();

    expect((instance as any).getFileName()).toBe('exchange_rates_2026-08-01.csv');
    expect(formatMessage).toHaveBeenCalledWith(
      messages.exportFileName,
      expect.objectContaining({
        date: '2026-08-01',
        groupBy: 'currency',
        provider: SettingsType.currency,
      })
    );
  });

  test('keeps provider/groupBy/resolution/date range filename for report exports', () => {
    const { instance } = createSubmit({
      dateFilter: 'timeScope',
      exportPathsType: ReportPathsType.aws,
      exportType: ReportType.cost,
      groupBy: 'account',
      resolution: 'monthly',
    });

    expect((instance as any).getFileName()).toBe('aws_account_monthly_2026-08-01_2026-08-31.csv');
  });
});
