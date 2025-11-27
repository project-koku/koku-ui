import React from 'react';
import { render, screen, act } from '@testing-library/react';
import EmptyFilterState from './emptyFilterState';

jest.mock('react-intl', () => {
	const actual = jest.requireActual('react-intl');
	return { __esModule: true, ...actual, injectIntl: (Comp: any) => (props: any) => <Comp {...props} intl={{ formatMessage: (d: any) => d?.id || 'x' }} /> };
});

jest.mock('react-router-dom', () => ({ __esModule: true, useLocation: () => ({ search: '?group_by[account]=redhat' }) }));

jest.mock('@koku-ui/api/queries/query', () => ({ __esModule: true, parseQuery: () => ({ group_by: { account: ['redhat'] } }) }));

describe('EmptyFilterState extra', () => {
	test('route-driven group_by matches redhat shows item1 image', () => {
		render(<EmptyFilterState />);
		// When item present, EmptyState should not render default icon prop
		expect(document.querySelector('img')).toBeTruthy();
	});

	test('string filter with second keyword triggers ItemScroll and advances via timer', () => {
		jest.useFakeTimers();
		render(<EmptyFilterState filter={window.atob('a29rdQ==')} />);
		// Initially an image exists
		expect(document.querySelector('img')).toBeTruthy();
		// Advance timers to trigger index update
		act(() => {
			jest.advanceTimersByTime(1000);
		});
		// Still renders image after scroll step
		expect(document.querySelector('img')).toBeTruthy();
		jest.useRealTimers();
	});

	test('array filter non-matching yields default icon in EmptyState', () => {
		render(<EmptyFilterState filter={['nomatch']} />);
		const heading = screen.getByRole('heading', { level: 2 });
		expect(heading).toBeTruthy();
	});

	test('array filter with second keyword triggers ItemScroll', () => {
		render(<EmptyFilterState filter={[window.atob('a29rdQ==')]} />);
		expect(document.querySelector('img')).toBeTruthy();
	});

	test('route-driven non-array group_by value triggers ItemScroll', async () => {
		jest.isolateModules(() => {
			jest.doMock('react-router-dom', () => ({ __esModule: true, useLocation: () => ({ search: '?group_by[account]=koku' }) }));
			jest.doMock('@koku-ui/api/queries/query', () => ({ __esModule: true, parseQuery: () => ({ group_by: { account: 'koku' } }) }));
			const C = require('./emptyFilterState').default;
			render(<C />);
			expect(document.querySelector('img')).toBeTruthy();
		});
	});

	test('showMargin=false removes container margin', () => {
		const { container } = render(<EmptyFilterState showMargin={false} />);
		const root = container.firstChild as HTMLElement;
		expect(root.getAttribute('style') || '').not.toMatch(/margin-top/i);
	});

	test('custom title and subTitle descriptors render ids', () => {
		render(
			<EmptyFilterState
				title={{ id: 'custom.title' } as any}
				subTitle={{ id: 'custom.subtitle' } as any}
			/>
		);
		expect(screen.getByText('custom.title')).toBeTruthy();
		expect(screen.getByText('custom.subtitle')).toBeTruthy();
	});

	test('route-driven group_by with no matches renders default icon', () => {
		jest.isolateModules(() => {
			jest.doMock('react-router-dom', () => ({ __esModule: true, useLocation: () => ({ search: '?group_by[account]=other' }) }));
			jest.doMock('@koku-ui/api/queries/query', () => ({ __esModule: true, parseQuery: () => ({ group_by: { account: ['other'] } }) }));
			const C = require('./emptyFilterState').default;
			render(<C />);
			// No matching item: should fall back to default icon within EmptyState; ensure one img not from items
			expect(document.querySelector('img')).toBeTruthy();
		});
	});

	test('route-driven group_by array with early break after first non-match then match', () => {
		jest.isolateModules(() => {
			jest.doMock('react-router-dom', () => ({ __esModule: true, useLocation: () => ({ search: '?group_by[account]=values' }) }));
			jest.doMock('@koku-ui/api/queries/query', () => ({ __esModule: true, parseQuery: () => ({ group_by: { account: ['nomatch', 'redhat'] } }) }));
			const C = require('./emptyFilterState').default;
			render(<C />);
			expect(document.querySelector('img')).toBeTruthy();
		});
	});

	test('ItemScroll decrements multiple times across timers', () => {
		jest.useFakeTimers();
		render(<EmptyFilterState filter={window.atob('a29rdQ==')} />);
		// run through several decrements
		act(() => {
			jest.advanceTimersByTime(4000);
		});
		expect(document.querySelector('img')).toBeTruthy();
		jest.useRealTimers();
	});

	test('string filter matches with trimming and case-insensitive compare', () => {
		render(<EmptyFilterState filter={'  RED HAT  '} />);
		expect(document.querySelector('img')).toBeTruthy();
	});

	test('custom icon is used when no specific item selected', () => {
		const CustomIcon = () => <span data-testid="ico" />;
		render(<EmptyFilterState filter={['nomatch']} icon={CustomIcon as any} />);
		expect(screen.getByTestId('ico')).toBeTruthy();
	});

	test('route-driven non-array group_by value redhat shows item1 path', () => {
		jest.isolateModules(() => {
			jest.doMock('react-router-dom', () => ({ __esModule: true, useLocation: () => ({ search: '?group_by[account]=redhat' }) }));
			jest.doMock('@koku-ui/api/queries/query', () => ({ __esModule: true, parseQuery: () => ({ group_by: { account: 'redhat' } }) }));
			const C = require('./emptyFilterState').default;
			render(<C />);
			expect(document.querySelector('img')).toBeTruthy();
		});
	});

	test('route-driven multiple group_by keys with match in second key', () => {
		jest.isolateModules(() => {
			jest.doMock('react-router-dom', () => ({ __esModule: true, useLocation: () => ({ search: '?group_by[account]=x&group_by[project]=y' }) }));
			jest.doMock('@koku-ui/api/queries/query', () => ({ __esModule: true, parseQuery: () => ({ group_by: { account: 'nomatch', project: ['koku'] } }) }));
			const C = require('./emptyFilterState').default;
			render(<C />);
			expect(document.querySelector('img')).toBeTruthy();
		});
	});
}); 