jest
  .mock('react-i18next')
  .mock('components/verticalNav/verticalNavItem', () => ({
    VerticalNavItem: () => <div />,
  }));

import { VerticalNavItem } from 'components/verticalNav';
import { mount } from 'enzyme';
import React from 'react';
import { routes } from 'routes';
import { testIds } from 'testIds';
import { findByTestId } from 'testUtils';
import { Props, SidebarBase } from './sidebar';

const mockToggleSidebar = jest.fn();

const props: Props = {
  isSidebarOpen: false,
  toggleSidebar: mockToggleSidebar,
};

test('backdrop is not rendered if sidebar is not open', () => {
  const view = mount(<SidebarBase {...props} />);
  expect(findByTestId(view, testIds.sidebar.backdrop).exists()).toBe(false);
});

test('clicking backdrop toggles sidebar', () => {
  const view = mount(<SidebarBase {...props} isSidebarOpen />);
  findByTestId(view, testIds.sidebar.backdrop).simulate('click');
  expect(mockToggleSidebar).toBeCalled();
});

test('renders routes in order', () => {
  const view = mount(<SidebarBase {...props} />);
  const navItems = view.find(VerticalNavItem);
  expect(navItems.length).toBe(routes.length);
  navItems.forEach((navItem, i) => {
    const matchingRoute = routes[i];
    const navItemProps = navItem.props();
    expect(navItemProps.path).toBe(matchingRoute.path);
    expect(navItemProps.labelKey).toBe(matchingRoute.labelKey);
  });
});

test('clicking a NavItem calls toggleSidebar if it is open', () => {
  const view = mount(<SidebarBase {...props} isSidebarOpen />);
  view
    .find(VerticalNavItem)
    .first()
    .props()
    .onClick({} as any);
  expect(props.toggleSidebar).toBeCalled();
});

test('clicking a NavItem does not call toggleSidebar if it is close', () => {
  const view = mount(<SidebarBase {...props} />);
  expect(
    view
      .find(VerticalNavItem)
      .first()
      .props().onClick
  ).toBe(null);
});
