import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import PriceListTable from './priceListTable';

jest.mock('react-redux', () => ({ __esModule: true, connect: (_a: any) => (Comp: any) => (props: any) => <Comp {...props} /> }));

jest.mock('react-intl', () => {
	const actual = jest.requireActual('react-intl');
	return { __esModule: true, ...actual, injectIntl: (Comp: any) => (props: any) => <Comp {...props} intl={{ formatMessage: ({ id }: any) => id || 'x' }} /> };
});

jest.mock('store/metrics', () => ({ __esModule: true, metricsSelectors: { metrics: () => ({ cpu: { core_hours: { label_measurement: 'Hrs', label_measurement_unit: 'Hrs' } }, memory: { gibibyte: { label_measurement: 'GiB', label_measurement_unit: 'GiB' } } }) } }));

jest.mock('routes/settings/costModels/components/hoc/withPriceListSearch', () => ({
	__esModule: true,
	WithPriceListSearch: ({ children, initialFilters }: any) => children({
		search: { ...initialFilters },
		setSearch: jest.fn(),
		onRemove: jest.fn(),
		onSelect: jest.fn(),
		onClearAll: jest.fn(),
	}),
}));

jest.mock('routes/settings/costModels/components/priceListToolbar', () => ({
	__esModule: true,
	PriceListToolbar: ({ button, pagination, selected, secondaries }: any) => (
		<div id="price-list-toolbar" data-selected={selected} data-secondary={secondaries?.length}>
			<button id="create" onClick={button.props.onClick}>create</button>
			<div id="p-top" onClick={() => pagination.props.onSetPage(null as any, 2)} />
			<div id="pp-top" onClick={() => pagination.props.onPerPageSelect(null as any, 20)} />
		</div>
	),
}));

let lastSortCallback: any;

jest.mock('routes/settings/costModels/components/rateTable', () => ({
	__esModule: true,
	RateTable: ({ actions, sortCallback }: any) => {
		lastSortCallback = sortCallback;
		return <div id="rate-table" onClick={() => actions[0].onClick(null, 0, { data: { stateIndex: 0 } })} />;
	},
}));

jest.mock('routes/settings/costModels/components/paginationToolbarTemplate', () => ({
	__esModule: true,
	PaginationToolbarTemplate: ({ onSetPage, onPerPageSelect }: any) => (
		<div>
			<div id="p-bot" onClick={() => onSetPage(null as any, 3)} />
			<div id="pp-bot" onClick={() => onPerPageSelect(null as any, 30)} />
		</div>
	),
}));

const Wrapper = ({ children }: any) => (
	<div>
		{children({
			priceListPagination: {
				page: 1,
				perPage: 10,
				onPageSet: jest.fn(),
				onPerPageSet: jest.fn(),
			},
		})}
	</div>
);

jest.mock('./context', () => ({ __esModule: true, CostModelContext: { Consumer: (props: any) => <Wrapper>{props.children}</Wrapper> } }));

jest.mock('routes/components/state/emptyFilterState', () => ({ __esModule: true, EmptyFilterState: () => <div data-testid="efs" /> }));

describe('PriceListTable extra', () => {
	test('create button click, pagination callbacks, placeholder and sorting branches', () => {
		const addRateAction = jest.fn();
		const deleteRateAction = jest.fn();
		const items = [
			{ metric: { label_metric: 'cpu', label_measurement: 'core_hours', label_measurement_unit: 'Hrs' } },
			{ metric: { label_metric: 'memory', label_measurement: 'gibibyte', label_measurement_unit: 'GiB' } },
		];
		const metricsHash = {
			cpu: { core_hours: { label_measurement: 'Hrs', label_measurement_unit: 'Hrs' } },
			memory: { gibibyte: { label_measurement: 'GiB', label_measurement_unit: 'GiB' } },
		} as any;
		const { container } = render(<PriceListTable addRateAction={addRateAction} deleteRateAction={deleteRateAction} items={items as any} metricsHash={metricsHash} />);
		fireEvent.click(container.querySelector('#create')!);
		expect(addRateAction).toHaveBeenCalled();
		// Verify toolbar props rendered
		expect(container.querySelector('#price-list-toolbar')?.getAttribute('data-selected')).toBe('metrics');
		expect(container.querySelector('#price-list-toolbar')?.getAttribute('data-secondary')).toBe('2');
		// Pagination triggers
		fireEvent.click(container.querySelector('#p-top')!);
		fireEvent.click(container.querySelector('#pp-top')!);
		fireEvent.click(container.querySelector('#p-bot')!);
		fireEvent.click(container.querySelector('#pp-bot')!);
		// Row delete action
		fireEvent.click(container.querySelector('#rate-table')!);
		expect(deleteRateAction).toHaveBeenCalledWith(0);
		// Invoke sortCallback to hit state update branch
		act(() => {
			lastSortCallback?.({ index: 1, direction: 'asc' });
			lastSortCallback?.({ index: 2, direction: 'desc' });
		});
	});

	test('renders no-tiers empty state when no items and no filters (not EmptyFilterState)', () => {
		const metricsHash = { cpu: { core_hours: { label_measurement: 'Hrs', label_measurement_unit: 'Hrs' } } } as any;
		const { queryByTestId, queryById } = render(<PriceListTable addRateAction={jest.fn()} deleteRateAction={jest.fn()} items={[]} metricsHash={metricsHash} />);
		// EmptyFilterState mock should not be rendered
		expect(queryByTestId('efs')).toBeNull();
		// RateTable should not render when no items
		expect(document.querySelector('#rate-table')).toBeNull();
	});
}); 