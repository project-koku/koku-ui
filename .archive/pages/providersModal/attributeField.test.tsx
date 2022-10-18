import { TextInput } from '@patternfly/react-core';
import { FormGroup } from 'components/formGroup';
import { shallow } from 'enzyme';
import React from 'react';
import AttributeField from './attributeField';

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
    'aria-label': `input-${props.label}`,
    className: '',
    'test-attribute-1': true,
    placeholder: props.placeholder,
    value: props.value,
    isValid: true,
    autoFocus: false,
    onChange: props.onChange,
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
    type: 'text',
  });
});

test('TextInput isError true if error is not empty or null', () => {
  [
    { props: { error: null }, error: true },
    { props: { error: '' }, error: true },
    { props: { error: 'oh no!' }, error: false },
  ].forEach(testCase => {
    const view = shallow(<AttributeField {...props} {...testCase.props} />);
    expect(view.find(TextInput).props().isValid).toBe(testCase.error);
  });
});
