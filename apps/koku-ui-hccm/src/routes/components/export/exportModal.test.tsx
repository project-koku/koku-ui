import { render } from '@testing-library/react';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { SettingsType } from 'api/settings';
import React from 'react';

import { ExportModalBase } from './exportModal';

let capturedExportSubmitProps: any;

jest.mock('./exportSubmit', () => ({
  ExportSubmit: (props: any) => {
    capturedExportSubmitProps = props;
    return <button type="button">submit</button>;
  },
}));

jest.mock('store/common', () => ({
  createMapStateToProps: () => () => ({}),
}));

jest.mock('store/featureToggle', () => ({
  FeatureToggleSelectors: {
    selectIsExportsToggleEnabled: () => false,
  },
}));

const intl = {
  formatMessage: ({ defaultMessage, id }: { defaultMessage?: string; id?: string }, values?: any) => {
    if (typeof defaultMessage === 'string') {
      return defaultMessage;
    }
    return id ?? '';
  },
};

const renderModal = (overrides: Record<string, unknown> = {}) => {
  capturedExportSubmitProps = undefined;
  return render(
    <ExportModalBase
      exportPathsType={ReportPathsType.aws}
      exportQueryString="group_by[account]=*"
      exportType={ReportType.cost}
      groupBy="account"
      intl={intl as any}
      isOpen
      onClose={jest.fn()}
      {...overrides}
    />
  );
};

describe('ExportModal', () => {
  test('omits resolution for ExportSubmit when dateFilter is unset', () => {
    renderModal({
      exportPathsType: SettingsType.currency,
      exportType: SettingsType.currency,
      groupBy: 'currency',
      showAggregateType: false,
    });

    expect(capturedExportSubmitProps.dateFilter).toBeUndefined();
    expect(capturedExportSubmitProps.resolution).toBeUndefined();
  });

  test('passes default monthly resolution when dateFilter is set', () => {
    renderModal({
      dateFilter: 'timeScope',
    });

    expect(capturedExportSubmitProps.dateFilter).toBe('timeScope');
    expect(capturedExportSubmitProps.resolution).toBe('monthly');
  });

  test('passes explicit daily resolution when provided with dateFilter', () => {
    renderModal({
      dateFilter: 'dateRange',
      resolution: 'daily',
    });

    expect(capturedExportSubmitProps.dateFilter).toBe('dateRange');
    expect(capturedExportSubmitProps.resolution).toBe('daily');
  });
});
