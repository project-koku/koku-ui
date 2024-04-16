import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { WithPriceListSearch } from './withPriceListSearch';

test('with price list search', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  render(
    <WithPriceListSearch initialFilters={{ primary: 'metrics', metrics: [], measurements: [] }}>
      {({ onClearAll, onRemove, onSelect, setSearch, search }) => {
        return (
          <div>
            <button onClick={onClearAll}>Clear all</button>
            <button onClick={() => onRemove('metrics', 'CPU')}>Remove CPU</button>
            <button onClick={() => onSelect('metrics', 'CPU')}>Select CPU</button>
            <button onClick={() => onRemove('measurements', 'Request')}>Remove request</button>
            <button onClick={() => onSelect('measurements', 'Request')}>Select request</button>
            <button
              onClick={() =>
                setSearch({
                  primary: 'measurements',
                  metrics: ['Memory'],
                  measurements: ['Usage'],
                })
              }
            >
              Set search
            </button>
            <main>
              <div>Primary: {search.primary || 'None'}</div>
              <div>Metrics: {search.metrics[0] || 'None'}</div>
              <div>Measurements: {search.measurements[0] || 'None'}</div>
            </main>
          </div>
        );
      }}
    </WithPriceListSearch>
  );
  expect(screen.getByRole('main').outerHTML).toEqual(
    `<main><div>Primary: metrics</div><div>Metrics: None</div><div>Measurements: None</div></main>`
  );
  await act(async () => user.click(screen.getByText('Select CPU')));
  expect(screen.getByRole('main').outerHTML).toEqual(
    `<main><div>Primary: metrics</div><div>Metrics: CPU</div><div>Measurements: None</div></main>`
  );
  await act(async () => user.click(screen.getByText('Remove CPU')));
  expect(screen.getByRole('main').outerHTML).toEqual(
    `<main><div>Primary: metrics</div><div>Metrics: None</div><div>Measurements: None</div></main>`
  );
  await act(async () => user.click(screen.getByText('Select request')));
  expect(screen.getByRole('main').outerHTML).toEqual(
    `<main><div>Primary: metrics</div><div>Metrics: None</div><div>Measurements: Request</div></main>`
  );
  await act(async () => user.click(screen.getByText('Remove request')));
  expect(screen.getByRole('main').outerHTML).toEqual(
    `<main><div>Primary: metrics</div><div>Metrics: None</div><div>Measurements: None</div></main>`
  );
  await act(async () => user.click(screen.getByText('Set search')));
  expect(screen.getByRole('main').outerHTML).toEqual(
    `<main><div>Primary: measurements</div><div>Metrics: Memory</div><div>Measurements: Usage</div></main>`
  );
  await act(async () => user.click(screen.getByText('Clear all')));
  expect(screen.getByRole('main').outerHTML).toEqual(
    `<main><div>Primary: measurements</div><div>Metrics: None</div><div>Measurements: None</div></main>`
  );
});
