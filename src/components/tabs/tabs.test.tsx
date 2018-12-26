import { shallow } from 'enzyme';
import React from 'react';
import { TabContent } from './tabContent';
import { TabNavigation } from './tabNavigation';
import { Tabs, TabsProps } from './tabs';

const props: TabsProps = {
  selected: 'id2',
  onChange: jest.fn(),
  tabs: [
    {
      id: 'id1',
      label: 'label1',
      content: 'content1',
    },
    {
      id: 'id2',
      label: 'label2',
      content: 'content2',
    },
  ],
};

test('tabs renders tab navigation with the right props', () => {
  const tabNav = shallow(<Tabs {...props} />).find(TabNavigation);
  expect(tabNav.length).toBe(1);
  expect(tabNav.at(0).props().selected).toBe(props.tabs[1]);
  expect(tabNav.at(0).props().tabs).toBe(props.tabs);
  expect(tabNav.at(0).props().onChange).toBe(props.onChange);
});

test('tabs renders tab content with the right props', () => {
  const tabCnt = shallow(<Tabs {...props} />).find(TabContent);
  expect(tabCnt.length).toBe(1);
  expect(tabCnt.at(0).props().data).toBe(props.tabs[1]);
});

test('tabs renders "no data was found" when tabs is an empty array', () => {
  const view = shallow(<Tabs {...props} tabs={[]} />).find('div');
  expect(view.text()).toBe('No data was found');
});

test('tabs renders first tab when selected tab does not exist in tabs', () => {
  const view = shallow(<Tabs {...props} selected={'id10'} />);
  const tabCnt = view.find(TabContent);
  const tabNav = view.find(TabNavigation);

  expect(tabCnt.length).toBe(1);
  expect(tabNav.length).toBe(1);

  expect(tabCnt.props().data).toBe(props.tabs[0]);
  expect(tabNav.at(0).props().selected).toBe(props.tabs[0]);
  expect(tabNav.at(0).props().tabs).toBe(props.tabs);
});
