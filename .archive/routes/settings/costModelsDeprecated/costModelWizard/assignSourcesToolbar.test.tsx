import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { AssignSourcesToolbarBase } from './assignSourcesToolbar';

jest.mock('react-intl', () => {
	const actual = jest.requireActual('react-intl');
	return { __esModule: true, ...actual, injectIntl: (Comp: any) => (props: any) => <Comp {...props} intl={{ formatMessage: ({ id }: any) => id || 'x' }} /> };
});

jest.mock('@patternfly/react-core', () => ({
	__esModule: true,
	SearchInput: ({ id, value, onChange, onSearch, onClear, placeholder }: any) => (
		<div>
			<input id={id} aria-label={placeholder} value={value} onChange={e => onChange(null, (e.target as HTMLInputElement).value)} />
			<button id="clear" onClick={onClear}>clear</button>
			<button id="search" onClick={() => onSearch(null, value)}>search</button>
		</div>
	),
	Pagination: ({ onSetPage, onPerPageSelect, page, perPage }: any) => (
		<div>
			<button id="setPage" onClick={() => onSetPage(null, page + 1)} />
			<button id="setPerPage" onClick={() => onPerPageSelect(null, perPage + 10)} />
		</div>
	),
	Toolbar: ({ children }: any) => <div>{children}</div>,
	ToolbarContent: ({ children }: any) => <div>{children}</div>,
	ToolbarToggleGroup: ({ children }: any) => <div>{children}</div>,
	ToolbarItem: ({ children }: any) => <div>{children}</div>,
	ToolbarFilter: ({ children }: any) => <div>{children}</div>,
}));

describe('AssignSourcesToolbar', () => {
	test('search input change, clear, and search callbacks; pagination callbacks', () => {
		const onChange = jest.fn();
		const onSearch = jest.fn();
		const onClearAll = jest.fn();
		const onRemove = jest.fn();
		const onSetPage = jest.fn();
		const onPerPageSelect = jest.fn();
		const { container } = render(
			<AssignSourcesToolbarBase
				intl={{ formatMessage: ({ id }: any) => id } as any}
				filterInputProps={{ id: 'f', value: 'v', onChange, onSearch }}
				filter={{ onClearAll, onRemove, query: { name: ['a','b'] } }}
				paginationProps={{ isCompact: true, itemCount: 1, page: 1, perPage: 10, onSetPage, onPerPageSelect }}
			/>
		);
		const input = container.querySelector('input#f') as HTMLInputElement;
		fireEvent.change(input, { target: { value: 'abc' } });
		expect(onChange).toHaveBeenCalledWith('abc');
		fireEvent.click(container.querySelector('#clear')!);
		expect(onChange).toHaveBeenCalledWith('');
		fireEvent.click(container.querySelector('#search')!);
		expect(onSearch).toHaveBeenCalledWith(null, 'v');
		fireEvent.click(container.querySelector('#setPage')!);
		expect(onSetPage).toHaveBeenCalledWith(null, 2);
		fireEvent.click(container.querySelector('#setPerPage')!);
		expect(onPerPageSelect).toHaveBeenCalledWith(null, 20);
	});
}); 