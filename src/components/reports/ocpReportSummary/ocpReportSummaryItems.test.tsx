import { shallow } from 'enzyme';
import React from 'react';
import * as utils from 'utils/getComputedOcpReportItems';
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

test('returns null if a report is not present', () => {
  shallow(<OcpReportSummaryItems {...props} report={null} />);
  expect(utils.getComputedOcpReportItems).not.toBeCalled();
  expect(props.children).not.toBeCalled();
});

test('does not update if the report is unchanged', () => {
  const view = shallow(<OcpReportSummaryItems {...props} />);
  view.setProps(props as any);
  expect(utils.getComputedOcpReportItems).toHaveBeenCalledTimes(1);
  expect(props.children).toHaveBeenCalledTimes(1);
});
