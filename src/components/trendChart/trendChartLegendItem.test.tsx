import { shallow } from 'enzyme';
import React from 'react';

import { mockDate } from 'testUtils';
import {
  TrendChartLegendItem,
  TrendChartLegendItemProps,
} from './trendChartLegendItem';
import * as utils from './trendChartUtils';

mockDate();

const props: TrendChartLegendItemProps = {
  data: [createDatum('2018-01-10'), createDatum('2018-01-15')],
};

test('range is formated with start and end date', () => {
  const view = shallow(<TrendChartLegendItem {...props} />);
  expect(view.text()).toMatchSnapshot();
});

test('range is formated with start and end date for an empty report', () => {
  const view = shallow(<TrendChartLegendItem data={[]} />);
  expect(view.text()).toMatchSnapshot();
});

function createDatum(date: string): utils.TrendChartDatum {
  return {
    date,
    x: 1,
    y: 1,
    units: 'units',
  };
}
