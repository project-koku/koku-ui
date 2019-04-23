import { shallow } from 'enzyme';
import React from 'react';
import { PageBase, Props } from './page';

const Sidebar = () => null;
const Masthead = () => null;

const props: Props = {
  masthead: <Masthead />,
  sidebar: <Sidebar />,
  isSidebarOpen: false,
};

test('sidebar and mastead are rendered', () => {
  const view = shallow(<PageBase {...props} />);
  expect(view).toMatchSnapshot();
});

test('body has noscroll class added if sidebar is open', () => {
  const view = shallow(<PageBase {...props} isSidebarOpen />);
  expect(view.find('body')).toMatchSnapshot();
});
