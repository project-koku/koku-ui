import { shallow } from 'enzyme';
import React from 'react';
import * as utils from 'utils/computedReport/getComputedReportItems';
import {
  OcpCloudReportSummaryItems,
  OcpCloudReportSummaryItemsProps,
} from './ocpCloudReportSummaryItems';

jest.spyOn(utils, 'getComputedReportItems');

const props: OcpCloudReportSummaryItemsProps = {
  report: { data: [] },
  idKey: 'date',
  labelKey: 'account',
  children: jest.fn(() => null),
  t: jest.fn(v => `t(${v})`),
};

test('computes report items', () => {
  shallow(<OcpCloudReportSummaryItems {...props} />);
  expect(utils.getComputedReportItems).toBeCalledWith({
    report: props.report,
    idKey: props.idKey,
    labelKey: props.labelKey,
  });
  expect(props.children).toBeCalledWith({ items: [] });
});

test('does not update if the report is unchanged', () => {
  const view = shallow(<OcpCloudReportSummaryItems {...props} />);
  view.setProps(props as any);
  expect(utils.getComputedReportItems).toHaveBeenCalledTimes(1);
  expect(props.children).toHaveBeenCalledTimes(1);
});
