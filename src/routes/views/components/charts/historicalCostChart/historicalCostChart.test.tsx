import { render, screen } from '@testing-library/react';
import { intl as defaultIntl } from 'components/i18n';
import React from 'react';

import { HistoricalCostChart, HistoricalCostChartProps } from './historicalCostChart';
import { HistoricalCostChartTestProps } from './testProps/historicalCostChartProps';

const props: HistoricalCostChartProps = {
  ...HistoricalCostChartTestProps,
  formatter: jest.fn(),
  formatOptions: {},
  intl: defaultIntl,
  height: 100,
  name: 'exampleCostChart',
  title: 'Usage Title',
};

test('reports are propertly generated', () => {
  const view = render(<HistoricalCostChart {...props} />);

  expect(screen.getByText(/Cost.*"count":30,"startDate":"1","endDate":"30","month":3,"year":2022/)).not.toBeNull();
  expect(screen.getByText(/Cost.*"count":17,"startDate":"1","endDate":"17","month":4,"year":2022/)).not.toBeNull();
  expect(
    screen.getByText(/Infrastructure cost.*"count":30,"startDate":"1","endDate":"30","month":3,"year":2022/)
  ).not.toBeNull();
  expect(
    screen.getByText(/Infrastructure cost.*"count":17,"startDate":"1","endDate":"17","month":4,"year":2022/)
  ).not.toBeNull();

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
  expect(linesWithNoData.length).toBe(4);
  // below is to capture all the graph points which are contained within an svg
  expect(view.container).toMatchSnapshot();
});

test('height from props is used', () => {
  render(<HistoricalCostChart {...props} />);
  expect(screen.getByTestId('historical-chart-wrapper').getAttribute('style')).toContain('height: 100px');
});
