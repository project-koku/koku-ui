import React from 'react';
import { render, screen } from '@testing-library/react';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { TextField } from '../../components/add-source-wizard/pf6-ddf-mapper/TextField';
import localeEn from '../../../locales/data.json';
import { IntlProvider } from 'react-intl';

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
    <IntlProvider locale="en" defaultLocale="en" messages={localeEn.en}>
      <FormRenderer
        schema={{
          fields: [{ component: 'review-summary', name: 'review' }],
        }}
        componentMapper={componentMapper}
        onSubmit={jest.fn()}
        initialValues={initialValues}
        FormTemplate={({ formFields }: any) => <form>{formFields}</form>}
      />
    </IntlProvider>
  );

describe('ReviewSummary', () => {
  it('renders source name and type from form values', () => {
    renderWithForm({ source_name: 'Test Source', source_type: 'OCP' });

    expect(screen.getByText('Integration name')).toBeInTheDocument();
    expect(screen.getByText('Test Source')).toBeInTheDocument();
    expect(screen.getByText('Integration type')).toBeInTheDocument();
    expect(screen.getByText('OCP')).toBeInTheDocument();
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
