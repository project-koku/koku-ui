import { Title } from '@patternfly/react-core';
import { shallow } from 'enzyme';
import React from 'react';
import Item from './item';

test('render item', () => {
  const title = 'this is a title';
  const value = 'this is the view';
  const view = shallow(<Item title={title} value={value} />);
  expect(view.find(Title)).toHaveLength(2);
  expect(
    view
      .find(Title)
      .at(0)
      .props().children
  ).toBe(title);
  expect(
    view
      .find(Title)
      .at(1)
      .props().children
  ).toBe(value);
});
