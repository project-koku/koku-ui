import { shallow } from 'enzyme';
import React from 'react';
import * as utils from 'utils/computedReport/getComputedOcpReportItems';
import {
  OcpReportSummaryItems,
  OcpReportSummaryItemsProps,
} from './ocpReportSummaryItems';

jest.spyOn(utils, 'getComputedOcpReportItems');

const props: OcpReportSummaryItemsProps = {
  report: { data: [] },
  idKey: 'date',
  labelKey: 'account',
  children: jest.fn(() => null),
  t: jest.fn(v => `t(${v})`),
};

test('computes report items', () => {
  shallow(<OcpReportSummaryItems {...props} />);
  expect(utils.getComputedOcpReportItems).toBeCalledWith({
    report: props.report,
    idKey: props.idKey,
    labelKey: props.labelKey,
  });
  expect(props.children).toBeCalledWith({ items: [] });
});

test('does not update if the report is unchanged', () => {
  const view = shallow(<OcpReportSummaryItems {...props} />);
  view.setProps(props as any);
  expect(utils.getComputedOcpReportItems).toHaveBeenCalledTimes(1);
  expect(props.children).toHaveBeenCalledTimes(1);
});
