import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { CardSelect } from 'components/add-source-wizard/pf6-ddf-mapper/CardSelect';
import { TextField } from 'components/add-source-wizard/pf6-ddf-mapper/TextField';

const componentMapper = {
  [componentTypes.TEXT_FIELD]: TextField,
  'card-select': CardSelect,
};

const options = [
  { value: 'TypeA', label: 'First option' },
  { value: 'TypeB', label: 'Second option' },
  { value: 'TypeC', label: 'Third option' },
];

const renderCardSelect = (onSubmit = jest.fn()) =>
  render(
    <FormRenderer
      schema={{
        fields: [
          {
            component: 'card-select',
            name: 'choice',
            label: 'Select an option',
            options,
          },
        ],
      }}
      componentMapper={componentMapper}
      onSubmit={onSubmit}
      FormTemplate={({ formFields }: any) => (
        <form
          onSubmit={e => {
            e.preventDefault();
          }}
        >
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

    const typeBRadio = document.getElementById('card-select-TypeB')!;
    await user.click(typeBRadio);

    const typeBCard = screen.getByText('Second option').closest('.pf-v6-c-card');
    expect(typeBCard).toHaveClass('pf-m-selected');
  });

  it('changes selection when a different card is clicked', async () => {
    const user = userEvent.setup();
    renderCardSelect();

    const typeBRadio = document.getElementById('card-select-TypeB')!;
    const typeCRadio = document.getElementById('card-select-TypeC')!;

    await user.click(typeBRadio);
    const typeBCard = screen.getByText('Second option').closest('.pf-v6-c-card');
    expect(typeBCard).toHaveClass('pf-m-selected');

    await user.click(typeCRadio);
    const typeCCard = screen.getByText('Third option').closest('.pf-v6-c-card');
    expect(typeCCard).toHaveClass('pf-m-selected');
    expect(typeBCard).not.toHaveClass('pf-m-selected');
  });
});
