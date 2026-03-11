import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import CardSelect from './cardSelect';
import TextField from './textField';

const componentMapper = {
  [componentTypes.TEXT_FIELD]: TextField,
  'card-select': CardSelect,
};

const options = [
  { value: 'OCP', label: 'OpenShift Container Platform' },
  { value: 'AWS', label: 'Amazon Web Services' },
  { value: 'Azure', label: 'Microsoft Azure' },
  { value: 'GCP', label: 'Google Cloud Platform' },
];

const renderCardSelect = (onSubmit = jest.fn()) =>
  render(
    <FormRenderer
      schema={{
        fields: [
          {
            component: 'card-select',
            name: 'source_type',
            label: 'Select a source type',
            options,
          },
        ],
      }}
      componentMapper={componentMapper}
      onSubmit={onSubmit}
      FormTemplate={({ formFields, schema }: any) => (
        <form onSubmit={(e) => { e.preventDefault(); }}>
          {formFields}
          <button type="submit">Submit</button>
        </form>
      )}
    />
  );

describe('CardSelect', () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  it('renders all option cards', () => {
    renderCardSelect();

    options.forEach(opt => {
      expect(screen.getByText(opt.label)).toBeInTheDocument();
    });
  });

  it('selects a card when clicked', async () => {
    const user = userEvent.setup();
    renderCardSelect();

    const awsRadio = document.getElementById('card-select-AWS')!;
    await user.click(awsRadio);

    const awsCard = screen.getByText('Amazon Web Services').closest('.pf-v6-c-card');
    expect(awsCard).toHaveClass('pf-m-selected');
  });

  it('changes selection when a different card is clicked', async () => {
    const user = userEvent.setup();
    renderCardSelect();

    const awsRadio = document.getElementById('card-select-AWS')!;
    const gcpRadio = document.getElementById('card-select-GCP')!;

    await user.click(awsRadio);
    const awsCard = screen.getByText('Amazon Web Services').closest('.pf-v6-c-card');
    expect(awsCard).toHaveClass('pf-m-selected');

    await user.click(gcpRadio);
    const gcpCard = screen.getByText('Google Cloud Platform').closest('.pf-v6-c-card');
    expect(gcpCard).toHaveClass('pf-m-selected');
    expect(awsCard).not.toHaveClass('pf-m-selected');
  });
});
