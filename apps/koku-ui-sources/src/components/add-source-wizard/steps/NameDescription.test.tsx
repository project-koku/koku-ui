import { render, screen } from '@testing-library/react';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import Description from 'components/pf6-ddf-mapper/description';
import TextField from 'components/pf6-ddf-mapper/textField';
import NameDescription from './NameDescription';

const componentMapper = {
  [componentTypes.TEXT_FIELD]: TextField,
  description: Description,
};

const FormTemplate: React.FC<any> = ({ formFields }) => (
  <form onSubmit={e => e.preventDefault()}>{formFields}</form>
);

describe('NameDescription', () => {
  it('renders the product name based on selected source type', () => {
    render(
      <FormRenderer
        schema={{
          fields: [
            {
              component: 'description',
              name: 'desc',
              Content: NameDescription,
            },
          ],
        }}
        componentMapper={componentMapper}
        FormTemplate={FormTemplate}
        onSubmit={jest.fn()}
        initialValues={{ source_type: 'AWS' }}
      />
    );

    expect(
      screen.getByText('Enter a name for your Amazon Web Services source.')
    ).toBeInTheDocument();
  });

  it('falls back to "your" when source_type is not set', () => {
    render(
      <FormRenderer
        schema={{
          fields: [
            {
              component: 'description',
              name: 'desc',
              Content: NameDescription,
            },
          ],
        }}
        componentMapper={componentMapper}
        FormTemplate={FormTemplate}
        onSubmit={jest.fn()}
        initialValues={{}}
      />
    );

    expect(
      screen.getByText('Enter a name for your your source.')
    ).toBeInTheDocument();
  });
});
