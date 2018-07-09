jest.mock('react-i18next');

import { mount } from 'enzyme';
import React from 'react';
import { testIds } from 'testIds';
import { findByTestId } from 'testUtils';
import { MastheadBase, Props } from './masthead';

const props: Props = {
  user: {
    uuid: '1234',
    username: 'David Lightman',
    email: 'david.lightman@test.test',
  },
  toggleSidebar: jest.fn(),
  logout: jest.fn(),
};

test('toggle sidebar on sidebar toggle click', () => {
  const view = mount(<MastheadBase {...props} />);
  const sidebarToggleButton = findByTestId(
    view,
    testIds.masthead.sidebarToggle
  );
  sidebarToggleButton.simulate('click');
  expect(props.toggleSidebar).toBeCalled();
});

test('renders username', () => {
  const view = mount(<MastheadBase {...props} />);
  expect(findByTestId(view, testIds.masthead.username).text()).toBe(
    props.user.username
  );
});

test('log out button calls log out on click.', () => {
  const view = mount(<MastheadBase {...props} />);
  findByTestId(view, testIds.masthead.logout).simulate('click');
  expect(props.logout).toBeCalled();
});

test('log out and username are not rendered if user is null', () => {
  const view = mount(<MastheadBase {...props} user={null} />);
  expect(findByTestId(view, testIds.masthead.logout).exists()).toBe(false);
  expect(findByTestId(view, testIds.masthead.username).exists()).toBe(false);
});
