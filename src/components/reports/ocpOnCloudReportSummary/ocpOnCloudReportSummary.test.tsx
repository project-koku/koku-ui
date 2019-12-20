import { CardBody, CardFooter } from '@patternfly/react-core';
import { mount } from 'enzyme';
import React from 'react';
import { FetchStatus } from 'store/common';
import {
  OcpOnCloudReportSummary,
  OcpOnCloudReportSummaryProps,
} from './ocpOnCloudReportSummary';

const props: OcpOnCloudReportSummaryProps = {
  title: 'report title',
  status: FetchStatus.complete,
  t: jest.fn(v => `t(${v})`),
};

test('on fetch status complete display reports', () => {
  const view = mount(
    <OcpOnCloudReportSummary {...props}>hello world</OcpOnCloudReportSummary>
  );
  expect(view.find(CardBody).text()).toEqual('hello world');
});

test('show subtitle if given', () => {
  const view = mount(
    <OcpOnCloudReportSummary {...props} subTitle={'sub-title'} />
  );
  expect(view.find('p').length).toBe(1);
  expect(view.find('p').text()).toEqual('sub-title');
});

test('show details link in card footer if given', () => {
  const view = mount(
    <OcpOnCloudReportSummary {...props} detailsLink={<a href="#">link</a>} />
  );
  expect(view.find(CardFooter).length).toBe(1);
  expect(view.find(CardFooter).text()).toEqual('link');
});
