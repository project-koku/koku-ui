import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { WithPriceListSearch } from './withPriceListSearch';

jest.mock('routes/settings/costModels/components/logic/selectCheckbox', () => ({
	__esModule: true,
	checkBoxLogic: (arr: string[] = [], value: string) => (arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]),
	deleteChip: (arr: string[] = [], chip: string) => arr.filter(v => v !== chip),
}));

describe('WithPriceListSearch', () => {
	test('handleChange updates filters', () => {
		const { getByTestId } = render(
			<WithPriceListSearch initialFilters={{ primary: 'metrics', metrics: [], measurements: [] }}>
				{({ setSearch, search }) => (
					<button data-testid="btn" onClick={() => setSearch({ primary: 'measurements' })}>{search.primary}</button>
				)}
			</WithPriceListSearch>
		);
		fireEvent.click(getByTestId('btn'));
		expect(getByTestId('btn').textContent).toBe('measurements');
	});

	test('onClearAll clears metrics and measurements', () => {
		const { getByTestId } = render(
			<WithPriceListSearch initialFilters={{ primary: 'metrics', metrics: ['cpu'], measurements: ['hrs'] }}>
				{({ onClearAll, search }) => (
					<button data-testid="btn" onClick={onClearAll}>{`${search.metrics?.length}-${search.measurements?.length}`}</button>
				)}
			</WithPriceListSearch>
		);
		fireEvent.click(getByTestId('btn'));
		expect(getByTestId('btn').textContent).toBe('0-0');
	});

	test('onRemove removes a chip from given category', () => {
		const { getByTestId } = render(
			<WithPriceListSearch initialFilters={{ primary: 'metrics', metrics: ['cpu','mem'], measurements: [] }}>
				{({ onRemove, search }) => (
					<button data-testid="btn" onClick={() => onRemove('metrics','mem')}>{`${search.metrics?.join(',')}`}</button>
				)}
			</WithPriceListSearch>
		);
		fireEvent.click(getByTestId('btn'));
		expect(getByTestId('btn').textContent).toBe('cpu');
	});

	test('onSelect toggles checkbox values', () => {
		const { getByTestId } = render(
			<WithPriceListSearch initialFilters={{ primary: 'metrics', metrics: [], measurements: [] }}>
				{({ onSelect, search }) => (
					<button data-testid="btn" onClick={() => onSelect('metrics','cpu')}>{`${search.metrics?.join(',') || 'empty'}`}</button>
				)}
			</WithPriceListSearch>
		);
		fireEvent.click(getByTestId('btn'));
		expect(getByTestId('btn').textContent).toBe('cpu');
		fireEvent.click(getByTestId('btn'));
		expect(getByTestId('btn').textContent).toBe('empty');
	});
}); 