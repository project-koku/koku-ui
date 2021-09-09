import { Progress } from '@patternfly/react-core';
import { shallow } from 'enzyme';
import React from 'react';

import { ReportSummaryItem, ReportSummaryItemProps } from './reportSummaryItem';

const props: ReportSummaryItemProps = {
  label: 'Label',
  intl: {
    formatMessage: jest.fn(v => v),
  } as any,
  totalValue: 1000,
  units: 'units',
  value: 100,
  valueFormatterOptions: {},
  valueFormatter: jest.fn(v => `formatted ${v}`),
};

// Temporarily disabled formatValue test until PF4 progress bar supports custom labels
xtest('formats value', () => {
  shallow(<ReportSummaryItem {...props} />);
  expect(props.valueFormatter).toBeCalledWith(props.value, props.units, props.valueFormatterOptions);
});

test('gets percentage from value and total value', () => {
  const view = shallow(<ReportSummaryItem {...props} />);
  expect(view.find(Progress).props().value).toMatchSnapshot('Progress Bar Value');
  expect(view.find('.pf-c-progress__measure')).toMatchSnapshot('Rendered Label');
});

test('sets percent to 0 if totalValue is 0', () => {
  const view = shallow(<ReportSummaryItem {...props} totalValue={0} />);
  expect(view.find(Progress).props().value).toMatchSnapshot('Progress Bar Value');
  expect(view.find('.pf-c-progress__measure')).toMatchSnapshot('Rendered label');
});
