import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { Distribution } from './distribution';

jest.mock('./distributionModal', () => ({
  DistributionModal: ({ isOpen, onClose, onSave }: any) =>
    isOpen ? (
      <div data-testid="distribution-modal">
        <button type="button" onClick={() => onSave?.({ uuid: 'cm-1' })}>
          save
        </button>
        <button type="button" onClick={onClose}>
          close
        </button>
      </div>
    ) : null,
}));

const costModel = {
  uuid: 'cm-1',
  name: 'Model',
  distribution: { cost_type: 'cpu', cost_weight: { cpu: 100 } },
} as any;

describe('Distribution', () => {
  test('opens modal and saves', () => {
    const onSave = jest.fn();
    render(
      <IntlProvider locale="en">
        <Distribution canWrite costModel={costModel} onSave={onSave} />
      </IntlProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /edit distribution/i }));
    fireEvent.click(screen.getByRole('button', { name: /^save$/i }));
    expect(onSave).toHaveBeenCalled();
  });
});
