import { shallow } from 'enzyme';
import React from 'react';
import * as utils from 'utils/getComputedOcpCloudReportItems';
import {
  OcpCloudReportSummaryItems,
  OcpCloudReportSummaryItemsProps,
} from './ocpCloudReportSummaryItems';

jest.spyOn(utils, 'getComputedOcpCloudReportItems');

const props: OcpCloudReportSummaryItemsProps = {
  report: { data: [] },
  idKey: 'date',
  labelKey: 'account',
  children: jest.fn(() => null),
  t: jest.fn(v => `t(${v})`),
};

test('computes report items', () => {
  shallow(<OcpCloudReportSummaryItems {...props} />);
  expect(utils.getComputedOcpCloudReportItems).toBeCalledWith({
    report: props.report,
    idKey: props.idKey,
    labelKey: props.labelKey,
  });
  expect(props.children).toBeCalledWith({ items: [] });
});

test('does not update if the report is unchanged', () => {
  const view = shallow(<OcpCloudReportSummaryItems {...props} />);
  view.setProps(props as any);
  expect(utils.getComputedOcpCloudReportItems).toHaveBeenCalledTimes(1);
  expect(props.children).toHaveBeenCalledTimes(1);
});
