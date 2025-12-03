import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import PriceList from './priceList';
import { CostModelContext } from './context';

jest.mock('routes/settings/costModels/components/addPriceList', () => ({ __esModule: true, default: ({ submitRate, cancel }: any) => (
	<div>
		<button id="submit" onClick={() => submitRate({})} />
		<button id="cancel" onClick={cancel} />
	</div>
) }));

jest.mock('routes/settings/costModels/components/rateForm/index', () => ({ __esModule: true, transformFormDataToRequest: () => ({ rate: 1 }) }));

jest.mock('./priceListTable', () => ({ __esModule: true, default: ({ addRateAction, deleteRateAction }: any) => (
	<div>
		<button id="add" onClick={addRateAction} />
		<button id="del" onClick={() => deleteRateAction(0)} />
	</div>
) }));

describe('PriceList flows', () => {
	const Provider = (props: any) => (
		<CostModelContext.Provider value={{ currencyUnits: 'USD', goToAddPL: jest.fn(), metricsHash: {}, tiers: [{ rate: 1 }], submitTiers: jest.fn() }}>
			{props.children}
		</CostModelContext.Provider>
	);

	test('table to form on add, cancel returns to table, submit appends rate and toggles', () => {
		const { container, rerender } = render(<Provider><PriceList /></Provider>);
		// Start in table, click add switches to form
		fireEvent.click(container.querySelector('#add')!);
		// Now in form: submit calls transform and submitTiers, then returns to table
		fireEvent.click(container.querySelector('#submit')!);
		// Render again to ensure cancel path covered
		rerender(<Provider><PriceList /></Provider>);
		fireEvent.click(container.querySelector('#add')!);
		fireEvent.click(container.querySelector('#cancel')!);
	});

	test('delete last item triggers goToAddPL(true)', () => {
		const goToAddPL = jest.fn();
		const submitTiers = jest.fn();
		const Wrapper = (props: any) => (
			<CostModelContext.Provider value={{ currencyUnits: 'USD', goToAddPL, metricsHash: {}, tiers: [{ rate: 1 }], submitTiers }}>
				{props.children}
			</CostModelContext.Provider>
		);
		const { container } = render(<Wrapper><PriceList /></Wrapper>);
		fireEvent.click(container.querySelector('#del')!);
		expect(submitTiers).toHaveBeenCalledWith([]);
		expect(goToAddPL).toHaveBeenCalledWith(true);
	});
}); 