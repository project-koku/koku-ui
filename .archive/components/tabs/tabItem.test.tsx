import { shallow } from 'enzyme';
import React from 'react';
import { TabItem, TabItemProps } from './tabItem';

const onSelectSpy = jest.fn();

const props: TabItemProps = {
  data: {
    id: 'someid',
    label: 'label',
    content: 'this is my content',
  },
  isSelected: false,
  onSelect: onSelectSpy,
};

test('tab item not selected render', () => {
  const item = <TabItem {...props} />;
  expect(shallow(item).props().tabIndex).toBe(-1);
  expect(shallow(item).props()['aria-selected']).toBe(false);
});

test('tab item selected render', () => {
  const item = <TabItem {...props} isSelected />;
  expect(shallow(item).props().tabIndex).toBe(0);
  expect(shallow(item).props()['aria-selected']).toBe(true);
});

test('selecting tab item triggers onSelect with tab item id', () => {
  const view = shallow(<TabItem {...props} />);
  view.simulate('click');
  expect(onSelectSpy.mock.calls.length).toBe(1);
  expect(onSelectSpy).toBeCalledWith(props.data.id);
});
