import { shallow } from 'enzyme';
import React from 'react';
import {
  OcpOnAwsReportSummaryDetails,
  OcpOnAwsReportSummaryDetailsProps,
} from './ocpOnAwsReportSummaryDetails';

const props: OcpOnAwsReportSummaryDetailsProps = {
  report: { data: [], total: { cost: { value: 100, units: 'USD' } } },
  label: 'label',
  formatValue: jest.fn(() => 'formatedValue'),
};

test('report total is formated', () => {
  const view = shallow(<OcpOnAwsReportSummaryDetails {...props} />);
  expect(props.formatValue).toBeCalledWith(
    props.report.total.cost.value,
    props.report.total.cost.units,
    props.formatOptions
  );
  expect(view).toMatchSnapshot();
});

test('defaults value if report is not present', () => {
  const view = shallow(
    <OcpOnAwsReportSummaryDetails {...props} report={null} />
  );
  expect(props.formatValue).not.toBeCalled();
  expect(view).toMatchSnapshot();
});

test('defaults value if report.total is not present', () => {
  const view = shallow(
    <OcpOnAwsReportSummaryDetails
      {...props}
      report={{ ...props.report, total: null }}
    />
  );
  expect(props.formatValue).not.toBeCalled();
  expect(view).toMatchSnapshot();
});
