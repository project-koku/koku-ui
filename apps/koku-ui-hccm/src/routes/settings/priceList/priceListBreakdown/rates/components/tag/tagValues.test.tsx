import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import messages from 'locales/messages';

import { TagValues } from './tagValues';

describe('TagValues', () => {
  test('fires value, rate, description, default, and delete handlers', () => {
    const onValueChange = jest.fn();
    const onRateChange = jest.fn();
    const onDescriptionChange = jest.fn();
    const onDefaultChange = jest.fn();
    const onDelete = jest.fn();

    render(
      <IntlProvider defaultLocale="en" locale="en">
        <TagValues
          currency="USD"
          onDefaultChange={onDefaultChange}
          onDelete={onDelete}
          onDescriptionChange={onDescriptionChange}
          onRateChange={onRateChange}
          onValueChange={onValueChange}
          tagValues={[
            { default: false, description: 'd', tag_value: 'prod', unit: 'USD', value: '1.5' },
            { default: true, description: '', tag_value: 'stage', unit: 'USD', value: '2' },
          ]}
        />
      </IntlProvider>
    );

    fireEvent.change(document.getElementById('tag-values-value-0')!, { target: { value: 'x' } });
    expect(onValueChange).toHaveBeenCalled();

    fireEvent.change(document.getElementById('tag-values-rate-0')!, { target: { value: '3' } });
    expect(onRateChange).toHaveBeenCalled();

    fireEvent.change(document.getElementById('tag-values-description-0')!, { target: { value: 'z' } });
    expect(onDescriptionChange).toHaveBeenCalled();

    const defaultBoxes = screen.getAllByRole('checkbox', { name: /default/i });
    fireEvent.click(defaultBoxes[0]);
    expect(onDefaultChange).toHaveBeenCalled();

    const removeButtons = screen.getAllByRole('button', { name: /remove tag/i });
    fireEvent.click(removeButtons[1]);
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  test('shows validation helper text when errors provided', () => {
    render(
      <IntlProvider defaultLocale="en" locale="en">
        <TagValues
          currency="USD"
          errors={[{ tag_value: messages.requiredField }]}
          tagValues={[{ default: false, description: '', tag_value: '', unit: 'USD', value: '' }]}
        />
      </IntlProvider>
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });
});
