import { shallow } from 'enzyme';
import React from 'react';
import {
  OcpOnCloudReportSummaryDetails,
  OcpOnCloudReportSummaryDetailsProps,
} from './ocpOnCloudReportSummaryDetails';

const props: OcpOnCloudReportSummaryDetailsProps = {
  formatValue: jest.fn(() => 'formatedValue'),
  report: { data: [], meta: { total: { cost: { value: 100, units: 'USD' } } } },
  t: jest.fn(v => v),
};

test('report total is formated', () => {
  const view = shallow(<OcpOnCloudReportSummaryDetails {...props} />);
  expect(props.formatValue).toBeCalledWith(
    props.report.meta.total.cost.value,
    props.report.meta.total.cost.units,
    props.formatOptions
  );
  expect(view).toMatchSnapshot();
});

test('defaults value if report is not present', () => {
  const view = shallow(
    <OcpOnCloudReportSummaryDetails {...props} report={null} />
  );
  expect(props.formatValue).not.toBeCalled();
  expect(view).toMatchSnapshot();
});

test('defaults value if report.meta is not present', () => {
  const view = shallow(
    <OcpOnCloudReportSummaryDetails
      {...props}
      report={{ ...props.report, meta: null }}
    />
  );
  expect(props.formatValue).not.toBeCalled();
  expect(view).toMatchSnapshot();
});
