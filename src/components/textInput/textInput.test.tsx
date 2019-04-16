import * as emotion from 'emotion';
import { shallow } from 'enzyme';
import { createMatchers } from 'jest-emotion';
import React from 'react';
import { TextInput } from './textInput';

expect.extend(createMatchers(emotion));

test('text input on change triggers onChange', () => {
  const onChangeSpy = jest.fn();
  const evt = { currentTarget: { value: 'username' } };
  const view = shallow(<TextInput onChange={onChangeSpy} value={''} />);
  view.simulate('change', evt);
  expect(onChangeSpy).toBeCalledWith('username', evt);
  expect(onChangeSpy.mock.calls.length).toBe(1);
});

test('text input on enter triggers onKeyPress', () => {
  const onKeyPressSpy = jest.fn();
  const evt = { key: 'Enter', preventDefault: jest.fn() };
  const view = shallow(
    <TextInput onKeyPress={onKeyPressSpy} onChange={jest.fn()} value={''} />
  );
  view.simulate('keyPress', evt);
  expect(onKeyPressSpy).toBeCalledWith(evt);
  expect(evt.preventDefault).toBeCalled();
});

test('text input flat render', () => {
  expect(
    shallow(<TextInput onChange={jest.fn()} value={''} isFlat />)
  ).toHaveStyleRule('border-bottom', '1px solid #d2d2d2');
});

test('text input error render', () => {
  expect(
    shallow(<TextInput onChange={jest.fn()} value={''} isError />)
  ).toHaveStyleRule('border-color', '#c9190b');
});
