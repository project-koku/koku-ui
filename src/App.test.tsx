jest.mock('./i18next');

import { shallow } from 'enzyme';
import React from 'react';
import App from './App';

// TODO: Replace with useful test
test('renders', () => {
  const view = shallow(<App language="en" />);
  expect(view).toMatchSnapshot();
});
