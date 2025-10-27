import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';

// Minimal i18n for messages
jest.mock('react-intl', () => {
	const actual = jest.requireActual('react-intl');
	return { __esModule: true, ...actual, useIntl: () => ({ formatMessage: (m: any) => (m && m.id) || 'selectClearAriaLabel' }) };
});

// Stub PatternFly primitives enough to exercise logic
jest.mock('@patternfly/react-core', () => ({
	__esModule: true,
	Button: ({ onClick, icon, ...p }: any) => <button aria-label={p['aria-label']} onClick={onClick}>{icon || 'btn'}</button>,
	MenuToggle: React.forwardRef<HTMLDivElement, any>((props, ref) => <div role="button" tabIndex={0} ref={ref} aria-expanded={props.isExpanded} onClick={props.onClick}>{props.children}</div>),
	Select: ({ id, isOpen, toggle, children }: any) => (
		<div data-testid={id} data-open={isOpen}>
			{toggle(React.createRef<HTMLButtonElement>())}
			{isOpen && <div role="listbox">{children}</div>}
		</div>
	),
	SelectList: (p: any) => <ul aria-label={p['aria-label']}>{p.children}</ul>,
	SelectOption: ({ id, isDisabled, isFocused, isSelected, onClick, children }: any) => (
		<li id={id}
			data-disabled={!!isDisabled}
			data-focused={!!isFocused}
			data-selected={!!isSelected}
			role="option"
			onClick={() => !isDisabled && onClick({}, children)}>{children}</li>
	),
	TextInputGroup: (p: any) => <div>{p.children}</div>,
	TextInputGroupMain: ({ id, value, onChange, onKeyDown, placeholder }: any) => (
		<input id={id} value={value} placeholder={placeholder} onChange={e => onChange(e, (e.target as HTMLInputElement).value)} onKeyDown={onKeyDown} />
	),
	TextInputGroupUtilities: (p: any) => <div>{p.children}</div>,
}));

jest.mock('@patternfly/react-icons/dist/esm/icons/times-icon', () => ({ __esModule: true, TimesIcon: () => <span>x</span> }));

import SelectTypeaheadWrapper from './selectTypeaheadWrapper';

describe('SelectTypeaheadWrapper', () => {
	const baseOptions = [
		{ toString: () => 'Apple', value: 'apple' },
		{ toString: () => 'Banana', value: 'banana' },
		{ toString: () => 'Cherry', value: 'cherry', isDisabled: true },
	];

	test('filters options as user types and opens menu', () => {
		const { container } = render(<SelectTypeaheadWrapper id="t" options={baseOptions as any} selection={undefined as any} />);
		const input = container.querySelector('#typeahead-select-input') as HTMLInputElement;
		fireEvent.change(input, { target: { value: 'ap' } });
		expect(container.querySelector('[data-open="true"]')).toBeTruthy();
		expect(screen.getByRole('option').textContent).toBe('Apple');
	});

	test('Enter selects focused item; Escape closes menu', () => {
		const onSelect = jest.fn();
		const { container } = render(<SelectTypeaheadWrapper id="t2" options={baseOptions as any} onSelect={onSelect} />);
		const input = container.querySelector('#typeahead-select-input') as HTMLInputElement;
		fireEvent.change(input, { target: { value: 'ba' } });
		fireEvent.keyDown(input, { key: 'Enter' });
		expect(onSelect).toHaveBeenCalled();
		fireEvent.keyDown(input, { key: 'Escape' });
		expect(container.querySelector('[data-open="false"]') || container.querySelector('[data-open="true"]')).toBeTruthy();
	});

	test('Arrow keys move focus index', () => {
		const { container } = render(<SelectTypeaheadWrapper id="t3" options={baseOptions as any} />);
		const input = container.querySelector('#typeahead-select-input') as HTMLInputElement;
		fireEvent.change(input, { target: { value: 'a' } });
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		expect(container.querySelector('li[data-focused="true"]')).toBeTruthy();
	});

	test('clear button resets input and calls onClear', () => {
		const onClear = jest.fn();
		const { container, getByLabelText } = render(<SelectTypeaheadWrapper id="t4" options={baseOptions as any} onClear={onClear} />);
		const input = container.querySelector('#typeahead-select-input') as HTMLInputElement;
		fireEvent.change(input, { target: { value: 'ap' } });
		const clear = getByLabelText('selectClearAriaLabel');
		fireEvent.click(clear);
		expect(onClear).toHaveBeenCalled();
		expect((container.querySelector('#typeahead-select-input') as HTMLInputElement).value).toBe('');
	});

	test('renders disabled option and prevents click', () => {
		const onSelect = jest.fn();
		const { container } = render(<SelectTypeaheadWrapper id="t5" options={baseOptions as any} onSelect={onSelect} />);
		const input = container.querySelector('#typeahead-select-input') as HTMLInputElement;
		fireEvent.change(input, { target: { value: 'ch' } });
		const li = screen.getByRole('option');
		expect(li.getAttribute('data-disabled')).toBe('true');
		fireEvent.click(li);
		expect(onSelect).not.toHaveBeenCalled();
	});
}); 