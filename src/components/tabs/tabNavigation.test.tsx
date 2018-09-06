import { mount, shallow } from 'enzyme';
import React from 'react';
import { TabItem } from './tabItem';
import { TabNavigation, TabNavigationProps } from './tabNavigation';

const onChangeSpy = jest.fn();

const props: TabNavigationProps = {
  tabs: [
    { id: 0, label: '1', content: '1' },
    { id: 1, label: '2', content: '2' },
  ],
  selected: { id: 0, label: '1', content: '1' },
  onChange: onChangeSpy,
};

test('tab navigation selected render', () => {
  const view = mount(<TabNavigation {...props} />).find(TabItem);
  expect(view.length).toBe(2);
  expect(view.at(0).props().isSelected).toBe(true);
  expect(view.at(1).props().isSelected).toBe(false);
});

test('left-right arrows triggers onChange', () => {
  const view = shallow(<TabNavigation {...props} />).filter(
    'div[role="tablist"]'
  );
  view.simulate('keyDown', { key: 'ArrowRight' });
  expect(onChangeSpy.mock.calls.length).toBe(1);
  expect(onChangeSpy).toBeCalledWith(1);
  view.simulate('keyDown', { key: 'ArrowLeft' });
  expect(onChangeSpy.mock.calls.length).toBe(1);
  view.simulate('keyDown', { key: 'ArrowUp' });
  expect(onChangeSpy.mock.calls.length).toBe(1);
});
