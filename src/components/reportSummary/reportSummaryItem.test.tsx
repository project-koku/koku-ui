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
  formatValue: jest.fn(),
};

test('fromats value', () => {
  shallow(<ReportSummaryItem {...props} />);
  expect(props.formatValue).toBeCalledWith(props.value);
});

test('gets percentage from value and total value', () => {
  const view = shallow(<ReportSummaryItem {...props} />);
  expect(view.find(ProgressBar).props().progress).toMatchSnapshot();
  expect(view.find(`.${css(styles.info)}`)).toMatchSnapshot();
});
