jest.mock('react-i18next');

import { css } from '@patternfly/react-styles';
import { mount } from 'enzyme';
import React from 'react';
import { testIds } from 'testIds';
import { findByTestId } from 'testUtils';
import { MastheadBase, Props } from './masthead';
import { styles } from './masthead.styles';

const props: Props = {
  user: {
    uuid: '1234',
    username: 'David Lightman',
    email: 'david.lightman@test.test',
  },
  isSidebarOpen: true,
  toggleSidebar: jest.fn(),
  logout: jest.fn(),
};

jest.spyOn(window, 'addEventListener');

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

test('listens for scroll events', () => {
  mount(<MastheadBase {...props} user={null} />);
  expect(window.addEventListener).toBeCalledWith(
    'scroll',
    expect.any(Function)
  );
});

test('adds masthead styles once scrolled past 0', () => {
  const view = mount(<MastheadBase {...props} user={null} />);
  (window as any).scrollY = 1;
  const handler: () => void = (window.addEventListener as jest.Mock).mock.calls.find(
    ([event]) => event === 'scroll'
  )[1];
  handler();
  view.update();
  expect(view.find(`.${css(styles.masthead, styles.scrolled)}`).exists()).toBe(
    true
  );
});

test('remove masthead styles once scrolled past 0', () => {
  const view = mount(<MastheadBase {...props} user={null} />);
  (window as any).scrollY = 1;
  const handler: () => void = (window.addEventListener as jest.Mock).mock.calls.find(
    ([event]) => event === 'scroll'
  )[1];
  handler();
  view.update();
  (window as any).scrollY = 0;
  handler();
  view.update();
  expect(view.find(`.${css(styles.masthead, styles.scrolled)}`).exists()).toBe(
    false
  );
});
