import { shallow } from 'enzyme';
import React from 'react';
import { VerticalNav } from './verticalNav';

test('verticalNav renders nav', () => {
  const label = 'navigation-app';
  const view = shallow(<VerticalNav label={label} />);
  expect(view.find('nav').length).toBe(1);
  expect(view.find('nav').props()['aria-label']).toBe(label);
  expect(view.find('ul').length).toBe(1);
  expect(view.find('ul').props().children).toBe(undefined);
});

test('verticalNav renders vertical nav with items', () => {
  const view = shallow(
    <VerticalNav label="label-1">
      <li key="1">item 1</li>
      <li key="2">item 2</li>
    </VerticalNav>
  );
  expect(view.find('ul').length).toBe(1);
  expect(view.find('ul').props().children).toEqual([
    <li key="1">item 1</li>,
    <li key="2">item 2</li>,
  ]);
});
