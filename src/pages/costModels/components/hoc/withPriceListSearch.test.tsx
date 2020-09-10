import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { WithPriceListSearch } from './withPriceListSearch';

test('with price list search', () => {
  const { getByRole, getByText } = render(
    <WithPriceListSearch
      initialFilters={{ primary: 'metrics', metrics: [], measurements: [] }}
    >
      {({ onClearAll, onRemove, onSelect, setSearch, search }) => {
        return (
          <div>
            <button onClick={onClearAll}>Clear all</button>
            <button onClick={() => onRemove('metrics', 'CPU')}>
              Remove CPU
            </button>
            <button onClick={() => onSelect('metrics', 'CPU')}>
              Select CPU
            </button>
            <button onClick={() => onRemove('measurements', 'Request')}>
              Remove request
            </button>
            <button onClick={() => onSelect('measurements', 'Request')}>
              Select request
            </button>
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
  expect(getByRole('main').outerHTML).toEqual(
    `<main><div>Primary: metrics</div><div>Metrics: None</div><div>Measurements: None</div></main>`
  );
  fireEvent.click(getByText('Select CPU'));
  expect(getByRole('main').outerHTML).toEqual(
    `<main><div>Primary: metrics</div><div>Metrics: CPU</div><div>Measurements: None</div></main>`
  );
  fireEvent.click(getByText('Remove CPU'));
  expect(getByRole('main').outerHTML).toEqual(
    `<main><div>Primary: metrics</div><div>Metrics: None</div><div>Measurements: None</div></main>`
  );
  fireEvent.click(getByText('Select request'));
  expect(getByRole('main').outerHTML).toEqual(
    `<main><div>Primary: metrics</div><div>Metrics: None</div><div>Measurements: Request</div></main>`
  );
  fireEvent.click(getByText('Remove request'));
  expect(getByRole('main').outerHTML).toEqual(
    `<main><div>Primary: metrics</div><div>Metrics: None</div><div>Measurements: None</div></main>`
  );
  fireEvent.click(getByText('Set search'));
  expect(getByRole('main').outerHTML).toEqual(
    `<main><div>Primary: measurements</div><div>Metrics: Memory</div><div>Measurements: Usage</div></main>`
  );
  fireEvent.click(getByText('Clear all'));
  expect(getByRole('main').outerHTML).toEqual(
    `<main><div>Primary: measurements</div><div>Metrics: None</div><div>Measurements: None</div></main>`
  );
});
