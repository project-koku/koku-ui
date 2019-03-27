import { shallow } from 'enzyme';
import React from 'react';
import * as utils from 'utils/getComputedAwsReportItems';
import {
  AwsReportSummaryItems,
  AwsReportSummaryItemsProps,
} from './awsReportSummaryItems';

jest.spyOn(utils, 'getComputedAwsReportItems');

const props: AwsReportSummaryItemsProps = {
  report: { data: [] },
  idKey: 'date',
  labelKey: 'account',
  children: jest.fn(() => null),
  t: jest.fn(v => `t(${v})`),
};

test('computes report items', () => {
  shallow(<AwsReportSummaryItems {...props} />);
  expect(utils.getComputedAwsReportItems).toBeCalledWith({
    report: props.report,
    idKey: props.idKey,
    labelKey: props.labelKey,
  });
  expect(props.children).toBeCalledWith({ items: [] });
});

test('returns null if a report is not present', () => {
  shallow(<AwsReportSummaryItems {...props} report={null} />);
  expect(utils.getComputedAwsReportItems).not.toBeCalled();
  expect(props.children).not.toBeCalled();
});

test('does not update if the report is unchanged', () => {
  const view = shallow(<AwsReportSummaryItems {...props} />);
  view.setProps(props as any);
  expect(utils.getComputedAwsReportItems).toHaveBeenCalledTimes(1);
  expect(props.children).toHaveBeenCalledTimes(1);
});
