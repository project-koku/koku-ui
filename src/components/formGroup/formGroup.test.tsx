import { mount } from 'enzyme';
import React from 'react';
import { FormGroup, formGroupIdProp } from './formGroup';

test('render form group', () => {
  const labelName = 'username';
  const idProp = 'div-id';
  const testProp = 'div-test-id';
  const view = mount(
    <FormGroup label={labelName}>
      <div id={idProp} testid={testProp} />
    </FormGroup>
  );
  expect(view.find('label').text()).toBe(labelName);
  expect(view.find('label').props().htmlFor).toBe(`${labelName}0`);
  expect(view.find(`#${idProp}`).length).toBe(1);
  expect(view.find(`#${idProp}`).props().testid).toBe(testProp);
  expect(view.find(`#${idProp}`).props()[formGroupIdProp]).toBe(
    `${labelName}0`
  );
});
