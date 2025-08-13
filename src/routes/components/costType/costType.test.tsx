import React from 'react';
import { render, fireEvent } from '@testing-library/react';

jest.mock('react-intl', () => {
	const actual = jest.requireActual('react-intl');
	return { __esModule: true, ...actual, injectIntl: (Comp: any) => (props: any) => <Comp {...props} intl={{ formatMessage: (m: any) => (m && m.id) || 'x' }} /> };
});

jest.mock('react-redux', () => ({ __esModule: true, connect: (_m: any, _d: any) => (C: any) => (p: any) => <C {...p} /> }));

jest.mock('routes/components/selectWrapper', () => ({ __esModule: true, SelectWrapper: ({ id, options, onSelect, selection }: any) => (
	<button id={id} data-options={JSON.stringify(options)} onClick={() => onSelect({}, selection || options[0])} />
)}));

const setCostType = jest.fn();
jest.mock('utils/sessionStorage', () => ({ __esModule: true, setCostType: (...args: any[]) => setCostType(...args) }));

import CostType, { CostTypes } from './costType';

describe('CostType', () => {
	test('renders label when showLabel true and builds options from messages', () => {
		const { container } = render(<CostType showLabel />);
		expect(container.querySelector('#cost-type-select')).toBeTruthy();
		const btn = container.querySelector('#cost-type-select') as HTMLButtonElement;
		const options = JSON.parse(btn.getAttribute('data-options') || '[]');
		expect(options.length).toBeGreaterThan(0);
	});

	test('onSelect updates sessionStorage and calls callback', () => {
		const onSelect = jest.fn();
		const { container } = render(<CostType costType={CostTypes.blended} onSelect={onSelect} />);
		fireEvent.click(container.querySelector('#cost-type-select')!);
		expect(setCostType).toHaveBeenCalled();
		expect(onSelect).toHaveBeenCalled();
	});

	test('does not write to sessionStorage when isSessionStorage is false', () => {
		const { container } = render(<CostType isSessionStorage={false} />);
		fireEvent.click(container.querySelector('#cost-type-select')!);
		expect(setCostType).not.toHaveBeenCalled();
	});
}); 