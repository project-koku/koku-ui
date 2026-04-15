import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { TextField } from './TextField';
import { Select } from './Select';

beforeEach(() => {
  jest.useRealTimers();
});

const componentMapper = {
  [componentTypes.TEXT_FIELD]: TextField,
  [componentTypes.SELECT]: Select,
};

const options = [
  { value: 'opt1', label: 'Option One' },
  { value: 'opt2', label: 'Option Two' },
];

const renderSelect = (props: Record<string, any> = {}) =>
  render(
    <FormRenderer
      schema={{
        fields: [
          {
            component: componentTypes.SELECT,
            name: 'test_select',
            label: 'Pick one',
            options,
            ...props,
          },
        ],
      }}
      componentMapper={componentMapper}
      onSubmit={jest.fn()}
      FormTemplate={({ formFields }: any) => <form>{formFields}</form>}
    />
  );

describe('Select', () => {
  it('renders the label and toggle', () => {
    renderSelect();

    expect(screen.getByText('Pick one')).toBeInTheDocument();
    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  it('shows options when toggle is clicked', async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByText('Select...'));

    expect(screen.getByText('Option One')).toBeInTheDocument();
    expect(screen.getByText('Option Two')).toBeInTheDocument();
  });

  it('selects an option when clicked', async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByText('Select...'));
    await user.click(screen.getByRole('option', { name: 'Option One' }));

    expect(screen.getByRole('button', { name: /Option One/ })).toBeInTheDocument();
  });

  it('uses placeholder when provided', () => {
    renderSelect({ placeholder: 'Choose...' });
    expect(screen.getByText('Choose...')).toBeInTheDocument();
  });
});
