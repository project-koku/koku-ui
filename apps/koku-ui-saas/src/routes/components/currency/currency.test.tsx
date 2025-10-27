import React from 'react';
import { render, fireEvent } from '@testing-library/react';

jest.mock('react-intl', () => {
	const actual = jest.requireActual('react-intl');
	return { __esModule: true, ...actual, injectIntl: (Comp: any) => (props: any) => <Comp {...props} intl={{ formatMessage: (_m: any, v?: any) => v?.units || 'x' }} /> };
});

jest.mock('react-redux', () => ({ __esModule: true, connect: (_m: any, _d: any) => (C: any) => (p: any) => <C {...p} /> }));

jest.mock('routes/components/selectWrapper', () => ({ __esModule: true, SelectWrapper: ({ id, options, onSelect, selection }: any) => (
	<button id={id} data-options={JSON.stringify(options)} onClick={() => onSelect({}, selection || options[0])} />
)}));

const setCurrency = jest.fn();
jest.mock('utils/sessionStorage', () => ({ __esModule: true, setCurrency: (...args: any[]) => setCurrency(...args) }));

import Currency from './currency';

describe('Currency', () => {
	test('builds options and renders select', () => {
		const { container } = render(<Currency showLabel />);
		const btn = container.querySelector('#currency-select') as HTMLButtonElement;
		expect(btn).toBeTruthy();
		const options = JSON.parse(btn.getAttribute('data-options') || '[]');
		expect(options.length).toBeGreaterThan(0);
	});

	test('onSelect updates sessionStorage and calls callback', () => {
		const onSelect = jest.fn();
		const { container } = render(<Currency currency="USD" onSelect={onSelect} />);
		fireEvent.click(container.querySelector('#currency-select')!);
		expect(setCurrency).toHaveBeenCalled();
		expect(onSelect).toHaveBeenCalled();
	});

	test('does not write to sessionStorage when isSessionStorage is false', () => {
		const { container } = render(<Currency isSessionStorage={false} />);
		fireEvent.click(container.querySelector('#currency-select')!);
		expect(setCurrency).not.toHaveBeenCalled();
	});
}); 