import React from 'react';

export type Captured = Array<{ comp: string; props: any }>;

// Mocks all ReportSummary* exports, captures their props, and renders children when applicable
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

  const stubs: Record<string, any> = {};
  names.forEach(name => {
    stubs[name] = (props: any) => {
      captured.push({ comp: name, props });
      // Render children for wrappers so nested content mounts
      if (name === 'ReportSummary' || name === 'ReportSummaryAlt') {
        return <div>{props.children}</div>;
      }
      if (name === 'ReportSummaryItems') {
        // If render-prop, provide a minimal items array
        if (typeof props.children === 'function') {
          const items = [
            { id: 'A', label: 'A', cost: { total: { value: 1 } }, usage: { total: { value: 1 } } },
            { id: 'B', label: 'B', cost: { total: { value: 2 } }, usage: { total: { value: 2 } } },
          ];
          return <div>{props.children({ items })}</div>;
        }
        return <div>{props.children}</div>;
      }
      return null;
    };
  });

  jest.mock('routes/components/reports/reportSummary', () => ({
    __esModule: true,
    ...stubs,
  }));

  return { captured };
}

// Simplifies PF Tabs/Tab components to avoid complex behaviors in tests
export function mockPatternFlyTabs(): void {
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

// Stubs Link to simple anchor to avoid Router context when not necessary
export function mockRouterLink(): void {
  jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
      __esModule: true,
      ...actual,
      Link: ({ to, children, ...rest }: any) => (
        <a href={typeof to === 'string' ? to : to?.pathname || '#'} {...rest}>
          {children}
        </a>
      ),
    };
  });
} 