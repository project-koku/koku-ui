import { shallow } from 'enzyme';
import React from 'react';

import { App, AppOwnProps } from './app';
import { FetchStatus } from './store/common';

const props: AppOwnProps = {
  fetchProviders: jest.fn(),
  awsProviders: null,
  awsProvidersFetchStatus: FetchStatus.none,
  awsProvidersQueryString: '',
  history: {
    push: jest.fn(),
    listen: jest.fn(),
  },
  location: null,
  ocpProviders: null,
  ocpProvidersFetchStatus: FetchStatus.none,
  ocpProvidersQueryString: '',
} as any;

test('does not fetch current user if not logged in', () => {
  shallow(<App {...props} />);
});

test('renders login if isLoggedIn is false', () => {
  const view = shallow(<App {...props} />);
  expect(view).toMatchSnapshot();
});

test('renders page layout', () => {
  const view = shallow(<App {...props} />);
  expect(view).toMatchSnapshot();
});
