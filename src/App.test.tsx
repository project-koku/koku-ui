import { shallow } from 'enzyme';
import React from 'react';
import App from './App';

// TODO: Replace with useful test
test('renders', () => {
  const view = shallow(<App locale="en" />);
  expect(view).toMatchSnapshot();
});
