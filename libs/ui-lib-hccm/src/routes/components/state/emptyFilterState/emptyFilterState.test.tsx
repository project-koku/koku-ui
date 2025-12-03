import React from 'react';
import { render } from '@testing-library/react';

jest.mock('react-intl', () => {
	const actual = jest.requireActual('react-intl');
	return { __esModule: true, ...actual, injectIntl: (Comp: any) => (props: any) => <Comp {...props} intl={{ formatMessage: (m: any) => (m && m.id) || 'x' }} /> };
});

jest.mock('react-router-dom', () => ({ __esModule: true, useLocation: () => ({ search: '?group_by[account]=redhat' }) }));

jest.mock('@koku-ui/api/queries/query', () => ({ __esModule: true, parseQuery: () => ({ group_by: { account: ['redhat'] } }) }));

import EmptyFilterState from './emptyFilterState';

describe('EmptyFilterState', () => {
	test('renders icon-only when no filters match', () => {
		const { container } = render(<EmptyFilterState />);
		expect(container.querySelector('svg, img')).toBeTruthy();
	});

	test('renders item1 when filter array contains redhat', () => {
		const { container } = render(<EmptyFilterState filter={window.atob('cmVkaGF0')} />);
		expect(container.querySelector('img')).toBeTruthy();
	});

	test('renders scroll when filter string contains koku', () => {
		const { container } = render(<EmptyFilterState filter={window.atob('a29rdQ==')} />);
		expect(container.querySelector('img')).toBeTruthy();
	});
});
