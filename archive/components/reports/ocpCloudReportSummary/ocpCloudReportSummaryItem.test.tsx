import { Progress } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { shallow } from 'enzyme';
import React from 'react';
import {
  OcpCloudReportSummaryItem,
  OcpCloudReportSummaryItemProps,
} from './ocpCloudReportSummaryItem';
import { styles } from './ocpCloudReportSummaryItem.styles';

const props: OcpCloudReportSummaryItemProps = {
  formatOptions: {},
  formatValue: jest.fn(v => `formatted ${v}`),
  label: 'Label',
  t: jest.fn(v => v),
  totalValue: 1000,
  units: 'units',
  value: 100,
};

// Temporarily disabled formatValue test until PF4 progress bar supports custom labels
xtest('formats value', () => {
  shallow(<OcpCloudReportSummaryItem {...props} />);
  expect(props.formatValue).toBeCalledWith(
    props.value,
    props.units,
    props.formatOptions
  );
});

test('gets percentage from value and total value', () => {
  const view = shallow(<OcpCloudReportSummaryItem {...props} />);
  expect(view.find(Progress).props().value).toMatchSnapshot(
    'Progress Bar Value'
  );
  expect(view.find(`.${css(styles.reportSummaryItem)}`)).toMatchSnapshot(
    'Rendered Label'
  );
});

test('sets percent to 0 if totalValue is 0', () => {
  const view = shallow(<OcpCloudReportSummaryItem {...props} totalValue={0} />);
  expect(view.find(Progress).props().value).toMatchSnapshot(
    'Progress Bar Value'
  );
  expect(view.find(`.${css(styles.reportSummaryItem)}`)).toMatchSnapshot(
    'Rendered label'
  );
});
