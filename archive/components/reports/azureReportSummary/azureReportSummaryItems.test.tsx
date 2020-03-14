import { shallow } from 'enzyme';
import React from 'react';
import * as utils from 'utils/computedReport/getComputedAzureReportItems';
import {
  AzureReportSummaryItems,
  AzureReportSummaryItemsProps,
} from './azureReportSummaryItems';

jest.spyOn(utils, 'getComputedAzureReportItems');

const props: AzureReportSummaryItemsProps = {
  report: { data: [] },
  idKey: 'date',
  labelKey: 'account',
  children: jest.fn(() => null),
  t: jest.fn(v => `t(${v})`),
};

test('computes report items', () => {
  shallow(<AzureReportSummaryItems {...props} />);
  expect(utils.getComputedAzureReportItems).toBeCalledWith({
    report: props.report,
    idKey: props.idKey,
    labelKey: props.labelKey,
  });
  expect(props.children).toBeCalledWith({ items: [] });
});

test('does not update if the report is unchanged', () => {
  const view = shallow(<AzureReportSummaryItems {...props} />);
  view.setProps(props as any);
  expect(utils.getComputedAzureReportItems).toHaveBeenCalledTimes(1);
  expect(props.children).toHaveBeenCalledTimes(1);
});
