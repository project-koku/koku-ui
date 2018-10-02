import { AwardIcon } from '@patternfly/react-icons';
import { mount } from 'enzyme';
import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { VerticalNavItem } from './verticalNavItem';

test('verticalNavItem renders a page navigation link with icon', () => {
  const path = '/item-1';
  const view = mount(
    <BrowserRouter>
      <VerticalNavItem
        labelKey="label-key"
        onClick={jest.fn()}
        icon={AwardIcon}
        path={path}
      />
    </BrowserRouter>
  );
  expect(view.find(AwardIcon).length).toBe(1);
  expect(view.find(Link).length).toBe(1);
  expect(view.find(Link).props().to).toBe(path);
  expect(view.find(Link).props()['aria-current']).toBe(null);
  expect(view.find(Link).props()['aria-disabled']).toBe(null);
});

test('verticalNavItem disabled renders a disabled link', () => {
  const view = mount(
    <BrowserRouter>
      <VerticalNavItem
        labelKey="label-key"
        onClick={jest.fn()}
        icon={AwardIcon}
        path={'something'}
        isDisabled
      />
    </BrowserRouter>
  );
  expect(view.find(AwardIcon).length).toBe(1);
  expect(view.find(Link).length).toBe(1);
  expect(view.find(Link).props()['aria-disabled']).toBe(true);
});
