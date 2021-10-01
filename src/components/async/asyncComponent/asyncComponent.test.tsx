import { waitFor } from '@testing-library/react';
import { shallow } from 'enzyme';
import React from 'react';

import { asyncComponent } from './asyncComponent';

const UnwrappedComponent = () => <div />;

test('renders empty while loading', async () => {
  const loader = jest.fn(() => Promise.resolve(UnwrappedComponent));
  const Wrapped = asyncComponent(loader);
  const view = shallow(<Wrapped />);
  expect(loader).toBeCalled();
  expect(view.isEmptyRender()).toBe(true);
});

test('component is loaded on mount', async () => {
  const loader = jest.fn(() => Promise.resolve(UnwrappedComponent));
  const Wrapped = asyncComponent(loader);
  const view = shallow(<Wrapped />);
  await waitFor(() => expect(loader).toHaveBeenCalled);
  view.update();
  expect(view.find(UnwrappedComponent).exists()).toBe(true);
});

test('component with default export is used', async () => {
  const loader = jest.fn(() => Promise.resolve({ default: UnwrappedComponent }));
  const Wrapped = asyncComponent(loader);
  const view = shallow(<Wrapped />);
  await waitFor(() => expect(loader).toHaveBeenCalled);
  view.update();
  expect(view.find(UnwrappedComponent).exists()).toBe(true);
});

test('only loades the component once', async () => {
  const loader = jest.fn(() => Promise.resolve(UnwrappedComponent));
  const Wrapped = asyncComponent(loader);
  shallow(<Wrapped />);
  await waitFor(() => expect(loader).toHaveBeenCalled);
  shallow(<Wrapped />);
  expect(loader).toHaveBeenCalledTimes(1);
});

test('spreads props to wrapped component', async () => {
  const loader = jest.fn(() => Promise.resolve(UnwrappedComponent));
  const Wrapped = asyncComponent<any>(loader);
  const view = shallow(<Wrapped quote="The only winning move is not to play." />);
  await waitFor(() => expect(loader).toHaveBeenCalled);
  view.update();
  expect(view.find(UnwrappedComponent).props()).toMatchSnapshot();
});
