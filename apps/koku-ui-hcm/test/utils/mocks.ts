import React from 'react';

export type Captured = Array<{ comp: string; props: any }>;

/**
 * Mocks all ReportSummary* exports, captures their props,
 * and returns the captured array reference for assertions.
 */
export function mockReportSummaries(): { captured: Captured } {
  const names = [
    'ReportSummary',
    'ReportSummaryAlt',
    'ReportSummaryCost',
    'ReportSummaryDailyCost',
    'ReportSummaryTrend',
    'ReportSummaryDailyTrend',
    'ReportSummaryUsage',
    'ReportSummaryDetails',
    'ReportSummaryItems',
    'ReportSummaryItem',
  ] as const;

  const captured: Captured = [];

  const stubs = names.reduce((acc, name) => {
    acc[name] = (props: any) => {
      captured.push({ comp: name, props });
      if (name === 'ReportSummary' || name === 'ReportSummaryAlt') {
        return <div>{props.children}</div>;
      }
      if (name === 'ReportSummaryItems' && typeof props.children === 'function') {
        return props.children({
          items: [
            { id: 'A', label: 'A', cost: { total: { value: 1 } }, usage: { total: { value: 1 } } },
            { id: 'B', label: 'B', cost: { total: { value: 2 } }, usage: { total: { value: 2 } } },
          ],
        });
      }
      return null;
    };
    return acc;
  }, {} as Record<string, any>);

  jest.mock('routes/components/reports/reportSummary', () => ({
    __esModule: true,
    ...stubs,
  }));

  return { captured };
}

/** Stub out PF Tabs to a simple div structure */
export function mockPatternFlyTabs() {
  jest.mock('@patternfly/react-core', () => {
    const actual = jest.requireActual('@patternfly/react-core');
    return {
      __esModule: true,
      ...actual,
      Tabs: ({ children }: any) => <div data-testid="tabs">{children}</div>,
      Tab: ({ children }: any) => <div data-testid="tab">{children}</div>,
      TabTitleText: ({ children }: any) => <span>{children}</span>,
    };
  });
}

/** Stub out Link to avoid needing a router context */
export function mockRouterLink() {
  jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
      __esModule: true,
      ...actual,
      Link: ({ to, children }: any) => <a href={to}>{children}</a>,
    };
  });
} 