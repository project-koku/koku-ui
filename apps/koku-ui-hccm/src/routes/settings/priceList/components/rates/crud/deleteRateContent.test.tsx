import { render, act } from '@testing-library/react';
import React, { createRef } from 'react';
import { IntlProvider } from 'react-intl';

import type { DeleteRateContentHandle } from './deleteRateContent';
import { DeleteRateContent } from './deleteRateContent';

describe('DeleteRateContent', () => {
  test('submit filters out rate at rateIndex and calls onDelete', () => {
    const onDelete = jest.fn();
    const priceList = {
      name: 'PL-A',
      rates: [
        { metric: { label_metric: 'M1', name: 'm1' } },
        { metric: { label_metric: 'M2', name: 'm2' } },
      ],
    } as any;

    const ref = createRef<DeleteRateContentHandle>();
    render(
      <IntlProvider defaultLocale="en" locale="en">
        <DeleteRateContent onDelete={onDelete} priceList={priceList} rateIndex={0} ref={ref} />
      </IntlProvider>
    );

    act(() => ref.current?.submit());
    expect(onDelete).toHaveBeenCalledWith([priceList.rates[1]]);
  });

  test('renders assigned cost models list when assigned_cost_model_count > 0', () => {
    const priceList = {
      assigned_cost_model_count: 2,
      assigned_cost_models: [{ name: 'CM1' }, { name: 'CM2' }],
      name: 'PL-B',
      rates: [{ metric: { label_metric: 'GPU', name: 'gpu' } }],
    } as any;

    const { container } = render(
      <IntlProvider defaultLocale="en" locale="en">
        <DeleteRateContent priceList={priceList} rateIndex={0} />
      </IntlProvider>
    );

    expect(container.textContent).toContain('CM1');
    expect(container.textContent).toContain('CM2');
  });

});
