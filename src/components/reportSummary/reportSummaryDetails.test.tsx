import { shallow } from 'enzyme';
import React from 'react';
import {
  ReportSummaryDetails,
  ReportSummaryDetailsProps,
} from './reportSummaryDetails';

const props: ReportSummaryDetailsProps = {
  report: { data: [], total: { value: 100, units: 'USD' } },
  label: 'label',
  description: 'description',
  formatValue: jest.fn(() => 'formatedValue'),
};

test('report total is formated', () => {
  const view = shallow(<ReportSummaryDetails {...props} />);
  expect(props.formatValue).toBeCalledWith(props.report.total.value);
  expect(view).toMatchSnapshot();
});

test('defaults value if report is not present', () => {
  const view = shallow(<ReportSummaryDetails {...props} report={null} />);
  expect(props.formatValue).not.toBeCalled();
  expect(view).toMatchSnapshot();
});

test('defaults value if report.total is not present', () => {
  const view = shallow(
    <ReportSummaryDetails
      {...props}
      report={{ ...props.report, total: null }}
    />
  );
  expect(props.formatValue).toBeCalledWith(0);
  expect(view).toMatchSnapshot();
});
