import { shallow } from 'enzyme';
import React from 'react';
import * as utils from 'utils/getComputedOcpOnAwsReportItems';
import {
  OcpOnAwsReportSummaryItems,
  OcpOnAwsReportSummaryItemsProps,
} from './ocpOnAwsReportSummaryItems';

jest.spyOn(utils, 'getComputedOcpOnAwsReportItems');

const props: OcpOnAwsReportSummaryItemsProps = {
  report: { data: [] },
  idKey: 'date',
  labelKey: 'account',
  children: jest.fn(() => null),
  t: jest.fn(v => `t(${v})`),
};

test('computes report items', () => {
  shallow(<OcpOnAwsReportSummaryItems {...props} />);
  expect(utils.getComputedOcpOnAwsReportItems).toBeCalledWith({
    report: props.report,
    idKey: props.idKey,
    labelKey: props.labelKey,
  });
  expect(props.children).toBeCalledWith({ items: [] });
});

test('returns null if a report is not present', () => {
  shallow(<OcpOnAwsReportSummaryItems {...props} report={null} />);
  expect(utils.getComputedOcpOnAwsReportItems).not.toBeCalled();
  expect(props.children).not.toBeCalled();
});

test('does not update if the report is unchanged', () => {
  const view = shallow(<OcpOnAwsReportSummaryItems {...props} />);
  view.setProps(props as any);
  expect(utils.getComputedOcpOnAwsReportItems).toHaveBeenCalledTimes(1);
  expect(props.children).toHaveBeenCalledTimes(1);
});
