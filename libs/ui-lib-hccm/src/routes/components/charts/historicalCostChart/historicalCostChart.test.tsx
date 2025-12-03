import { render, screen } from '@testing-library/react';
import { intl as defaultIntl } from '@koku-ui/i18n/i18n';
import React from 'react';

import type { HistoricalCostChartProps } from './historicalCostChart';
import HistoricalCostChart from './historicalCostChart';
import { HistoricalCostChartTestProps } from './testProps/historicalCostChartProps';

const props: HistoricalCostChartProps = {
  ...HistoricalCostChartTestProps,
  baseHeight: 100,
  formatter: jest.fn(),
  formatOptions: {},
  intl: defaultIntl,
  name: 'exampleCostChart',
  title: 'Usage Title',
};

test('reports are formatted to datums', () => {
  const view = render(<HistoricalCostChart {...props} />);

  expect(screen.getAllByText(/Cost.*/)).not.toBeNull();

  // below is to capture all the graph points which are contained within an svg
  expect(view.container).toMatchSnapshot();
});

test('null previous and current reports are handled', () => {
  const view = render(
    <HistoricalCostChart
      {...props}
      currentCostData={null}
      currentInfrastructureCostData={null}
      previousCostData={null}
      previousInfrastructureCostData={null}
    />
  );
  const linesWithNoData = screen.getAllByText(/no data/i);
  expect(linesWithNoData.length).toBe(2);
  // below is to capture all the graph points which are contained within an svg
  expect(view.container).toMatchSnapshot();
});

test('height from props is used', () => {
  render(<HistoricalCostChart {...props} />);
  expect(screen.getByTestId('historical-chart-wrapper').getAttribute('style')).toContain('height: 100px');
});
