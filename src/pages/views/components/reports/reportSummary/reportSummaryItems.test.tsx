import { shallow } from 'enzyme';
import React from 'react';
import * as utils from 'utils/computedReport/getComputedReportItems';

import { ReportSummaryItems, ReportSummaryItemsProps } from './reportSummaryItems';

jest.spyOn(utils, 'getComputedReportItems');

const props: ReportSummaryItemsProps = {
  report: { data: [] },
  idKey: 'date',
  children: jest.fn(() => null),
  t: jest.fn(v => `t(${v})`),
};

test('computes report items', () => {
  shallow(<ReportSummaryItems {...props} />);
  expect(utils.getComputedReportItems).toBeCalledWith({
    report: props.report,
    idKey: props.idKey,
  });
  expect(props.children).toBeCalledWith({ items: [] });
});

test('does not update if the report is unchanged', () => {
  const view = shallow(<ReportSummaryItems {...props} />);
  view.setProps(props as any);
  expect(utils.getComputedReportItems).toHaveBeenCalledTimes(1);
  expect(props.children).toHaveBeenCalledTimes(1);
});
