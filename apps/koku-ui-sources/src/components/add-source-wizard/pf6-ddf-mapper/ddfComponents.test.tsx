import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { TextField } from './TextField';
import { TextArea } from './TextArea';
import { SubForm } from './SubForm';
import { PlainText } from './PlainText';

beforeEach(() => {
  jest.useRealTimers();
});

const componentMapper = {
  [componentTypes.TEXT_FIELD]: TextField,
  [componentTypes.TEXTAREA]: TextArea,
  [componentTypes.SUB_FORM]: SubForm,
  [componentTypes.PLAIN_TEXT]: PlainText,
};

const FormTemplate = ({ formFields }: any) => <form>{formFields}</form>;

FormTemplate.displayName = 'FormTemplate';

describe('TextField', () => {
  it('renders with helper text', () => {
    render(
      <FormRenderer
        schema={{
          fields: [
            {
              component: componentTypes.TEXT_FIELD,
              name: 'field1',
              label: 'Username',
              helperText: 'Enter your username',
            },
          ],
        }}
        componentMapper={componentMapper}
        onSubmit={jest.fn()}
        FormTemplate={FormTemplate}
      />
    );

    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Enter your username')).toBeInTheDocument();
  });

  it('shows validated state when user types then blurs', async () => {
    const user = userEvent.setup();
    render(
      <FormRenderer
        schema={{
          fields: [
            {
              component: componentTypes.TEXT_FIELD,
              name: 'field1',
              label: 'Email',
            },
          ],
        }}
        componentMapper={componentMapper}
        onSubmit={jest.fn()}
        FormTemplate={FormTemplate}
      />
    );

    const input = screen.getByLabelText('Email');
    await user.type(input, 'hello');
    await user.tab();

    expect(input).toHaveValue('hello');
  });
});

describe('TextArea', () => {
  it('renders a text area field', () => {
    render(
      <FormRenderer
        schema={{
          fields: [
            {
              component: componentTypes.TEXTAREA,
              name: 'notes',
              label: 'Notes',
            },
          ],
        }}
        componentMapper={componentMapper}
        onSubmit={jest.fn()}
        FormTemplate={FormTemplate}
      />
    );

    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(
      <FormRenderer
        schema={{
          fields: [
            {
              component: componentTypes.TEXTAREA,
              name: 'notes',
              label: 'Notes',
            },
          ],
        }}
        componentMapper={componentMapper}
        onSubmit={jest.fn()}
        FormTemplate={FormTemplate}
      />
    );

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'some notes');
    expect(textarea).toHaveValue('some notes');
  });
});

describe('SubForm', () => {
  it('renders title, description, and nested fields', () => {
    render(
      <FormRenderer
        schema={{
          fields: [
            {
              component: componentTypes.SUB_FORM,
              name: 'section1',
              title: 'Section Title',
              description: 'Section description text',
              fields: [
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'nested_field',
                  label: 'Nested Field',
                },
              ],
            },
          ],
        }}
        componentMapper={componentMapper}
        onSubmit={jest.fn()}
        FormTemplate={FormTemplate}
      />
    );

    expect(screen.getByText('Section Title')).toBeInTheDocument();
    expect(screen.getByText('Section description text')).toBeInTheDocument();
    expect(screen.getByText('Nested Field')).toBeInTheDocument();
  });
});

describe('PlainText', () => {
  it('renders the label text', () => {
    render(
      <FormRenderer
        schema={{
          fields: [
            {
              component: componentTypes.PLAIN_TEXT,
              name: 'info',
              label: 'This is informational text',
            },
          ],
        }}
        componentMapper={componentMapper}
        onSubmit={jest.fn()}
        FormTemplate={FormTemplate}
      />
    );

    expect(screen.getByText('This is informational text')).toBeInTheDocument();
  });
});
