import { mount } from 'enzyme';
import React from 'react';
import { testIds } from 'testIds';
import { findByTestId } from 'testUtils';
import { NavToggleButtonBase, Props } from './navToggleButton';

const props: Props = {
  isSidebarOpen: true,
  title: 'nav_toggle',
  onClick: jest.fn(),
};

test('clicking on navigation toggle button calls onClick', () => {
  const view = mount(<NavToggleButtonBase {...props} />);
  const sidebarToggleButton = findByTestId(
    view,
    testIds.masthead.sidebarToggle
  );
  sidebarToggleButton.simulate('click');
  expect(props.onClick).toBeCalled();
});

test('show BarsIcon when sidebar is closed', () => {
  const view = mount(<NavToggleButtonBase {...props} isSidebarOpen={false} />);
  expect(view.find('BarsIcon').length).toBe(1);
});

test('show TimesIcon when sidebar is open', () => {
  const view = mount(<NavToggleButtonBase {...props} />);
  expect(view.find('TimesIcon').length).toBe(1);
});
