import { shallow } from 'enzyme';
import React from 'react';
import * as utils from 'utils/getComputedOcpOnCloudReportItems';
import {
  OcpOnCloudReportSummaryItems,
  OcpOnCloudReportSummaryItemsProps,
} from './ocpOnCloudReportSummaryItems';

jest.spyOn(utils, 'getComputedOcpOnCloudReportItems');

const props: OcpOnCloudReportSummaryItemsProps = {
  report: { data: [] },
  idKey: 'date',
  labelKey: 'account',
  children: jest.fn(() => null),
  t: jest.fn(v => `t(${v})`),
};

test('computes report items', () => {
  shallow(<OcpOnCloudReportSummaryItems {...props} />);
  expect(utils.getComputedOcpOnCloudReportItems).toBeCalledWith({
    report: props.report,
    idKey: props.idKey,
    labelKey: props.labelKey,
  });
  expect(props.children).toBeCalledWith({ items: [] });
});

test('does not update if the report is unchanged', () => {
  const view = shallow(<OcpOnCloudReportSummaryItems {...props} />);
  view.setProps(props as any);
  expect(utils.getComputedOcpOnCloudReportItems).toHaveBeenCalledTimes(1);
  expect(props.children).toHaveBeenCalledTimes(1);
});
