import { render, screen } from '@testing-library/react';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import TextField from 'components/pf6-ddf-mapper/textField';

import { ReviewSummary } from './ReviewSummary';

beforeEach(() => {
  jest.useRealTimers();
});

const componentMapper = {
  [componentTypes.TEXT_FIELD]: TextField,
  'review-summary': ReviewSummary,
};

const renderWithForm = (initialValues: Record<string, any> = {}) =>
  render(
    <FormRenderer
      schema={{
        fields: [{ component: 'review-summary', name: 'review' }],
      }}
      componentMapper={componentMapper}
      onSubmit={jest.fn()}
      initialValues={initialValues}
      FormTemplate={({ formFields }: any) => <form>{formFields}</form>}
    />
  );

describe('ReviewSummary', () => {
  it('renders source name and type from form values', () => {
    renderWithForm({ source_name: 'Test Source', source_type: 'AWS' });

    expect(screen.getByText('Source name')).toBeInTheDocument();
    expect(screen.getByText('Test Source')).toBeInTheDocument();
    expect(screen.getByText('Source type')).toBeInTheDocument();
    expect(screen.getByText('AWS')).toBeInTheDocument();
  });

  it('renders fallback values when fields are empty', () => {
    renderWithForm({});

    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('renders credential entries', () => {
    renderWithForm({
      source_name: 'My Source',
      source_type: 'OCP',
      credentials: { cluster_id: 'abc-123', api_key: 'secret' },
    });

    expect(screen.getByText('Cluster Id')).toBeInTheDocument();
    expect(screen.getByText('abc-123')).toBeInTheDocument();
    expect(screen.getByText('Api Key')).toBeInTheDocument();
    expect(screen.getByText('secret')).toBeInTheDocument();
  });
});
