import { shallow } from 'enzyme';
import React from 'react';
import {
  AwsReportSummaryDetails,
  AwsReportSummaryDetailsProps,
} from './awsReportSummaryDetails';

const props: AwsReportSummaryDetailsProps = {
  report: { data: [], total: { value: 100, units: 'USD' } },
  label: 'label',
  formatValue: jest.fn(() => 'formatedValue'),
};

test('report total is formated', () => {
  const view = shallow(<AwsReportSummaryDetails {...props} />);
  expect(props.formatValue).toBeCalledWith(
    props.report.total.value,
    props.report.total.units,
    props.formatOptions
  );
  expect(view).toMatchSnapshot();
});

test('defaults value if report is not present', () => {
  const view = shallow(<AwsReportSummaryDetails {...props} report={null} />);
  expect(props.formatValue).not.toBeCalled();
  expect(view).toMatchSnapshot();
});

test('defaults value if report.total is not present', () => {
  const view = shallow(
    <AwsReportSummaryDetails
      {...props}
      report={{ ...props.report, total: null }}
    />
  );
  expect(props.formatValue).not.toBeCalled();
  expect(view).toMatchSnapshot();
});
