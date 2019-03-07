import { shallow } from 'enzyme';
import React from 'react';
import {
  OcpOnAwsReportSummaryDetails,
  OcpOnAwsReportSummaryDetailsProps,
} from './ocpOnAwsReportSummaryDetails';

const props: OcpOnAwsReportSummaryDetailsProps = {
  report: { data: [], meta: { total: { cost: { value: 100, units: 'USD' } } } },
  label: 'label',
  formatValue: jest.fn(() => 'formatedValue'),
};

test('report total is formated', () => {
  const view = shallow(<OcpOnAwsReportSummaryDetails {...props} />);
  expect(props.formatValue).toBeCalledWith(
    props.report.meta.total.cost.value,
    props.report.meta.total.cost.units,
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

test('defaults value if report.meta is not present', () => {
  const view = shallow(
    <OcpOnAwsReportSummaryDetails
      {...props}
      report={{ ...props.report, meta: null }}
    />
  );
  expect(props.formatValue).not.toBeCalled();
  expect(view).toMatchSnapshot();
});
