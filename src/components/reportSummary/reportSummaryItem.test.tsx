import { css } from '@patternfly/react-styles';
import { shallow } from 'enzyme';
import React from 'react';
import { ProgressBar } from '../progressBar';
import { ReportSummaryItem, ReportSummaryItemProps } from './reportSummaryItem';
import { styles } from './reportSummaryItem.styles';

const props: ReportSummaryItemProps = {
  label: 'Label',
  totalValue: 1000,
  value: 100,
  units: 'units',
  formatValue: jest.fn(v => `formatted ${v}`),
  formatOptions: {},
};

test('formats value', () => {
  shallow(<ReportSummaryItem {...props} />);
  expect(props.formatValue).toBeCalledWith(
    props.value,
    props.units,
    props.formatOptions
  );
});

test('gets percentage from value and total value', () => {
  const view = shallow(<ReportSummaryItem {...props} />);
  expect(view.find(ProgressBar).props().progress).toMatchSnapshot(
    'Progress Bar Value'
  );
  expect(view.find(`.${css(styles.info)}`)).toMatchSnapshot('Rendered Label');
});

test('sets percent to 0 if totalValue is 0', () => {
  const view = shallow(<ReportSummaryItem {...props} totalValue={0} />);
  expect(view.find(ProgressBar).props().progress).toMatchSnapshot(
    'Progress Bar Value'
  );
  expect(view.find(`.${css(styles.info)}`)).toMatchSnapshot('Rendered label');
});
