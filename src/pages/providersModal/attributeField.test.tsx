import { FormGroup } from 'components/formGroup';
import { TextInput } from 'components/textInput';
import { shallow } from 'enzyme';
import React from 'react';
import AttributeField, {
  AttributeChange,
  AttributeProps,
} from './attributeField';

const props = {
  label: 'attribute-1',
  testProps: { 'test-attribute-1': true },
  placeholder: 'placeholder-attribute-1',
  value: 'some value',
  error: null,
  onChange: jest.fn(),
};

test('FormGroup generated with label', () => {
  const view = shallow(<AttributeField {...props} />);
  expect(view.find(FormGroup).props().label).toBe(props.label);
});

test('TextInput generated with the right props', () => {
  const view = shallow(<AttributeField {...props} />);
  expect(view.find(TextInput).props()).toEqual({
    isFlat: true,
    'test-attribute-1': true,
    placeholder: props.placeholder,
    value: props.value,
    isError: false,
    autoFocus: false,
    onChange: props.onChange,
  });
});

test('TextInput isError true if error is not empty or null', () => {
  [
    { props: { error: null }, error: false },
    { props: { error: '' }, error: false },
    { props: { error: 'oh no!' }, error: true },
  ].forEach(testCase => {
    const view = shallow(<AttributeField {...props} {...testCase.props} />);
    expect(view.find(TextInput).props().isError).toBe(testCase.error);
  });
});
