import { shallow } from 'enzyme';
import React from 'react';

import { mockDate } from 'testUtils';
import { ChartLegendItem, ChartLegendItemProps } from './chartLegendItem';
import * as utils from './chartUtils';

mockDate();

const props: ChartLegendItemProps = {
  data: [createDatum('2018-01-10'), createDatum('2018-01-15')],
};

test('range is formated with start and end date', () => {
  const view = shallow(<ChartLegendItem {...props} />);
  expect(view.text()).toMatchSnapshot();
});

test('range is formated with start and end date for an empty report', () => {
  const view = shallow(<ChartLegendItem data={[]} />);
  expect(view.text()).toMatchSnapshot();
});

function createDatum(key: string): utils.ChartDatum {
  return {
    key,
    x: 1,
    y: 1,
    units: 'units',
  };
}
