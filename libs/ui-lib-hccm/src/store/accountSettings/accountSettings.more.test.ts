jest.mock('utils/sessionStorage', () => ({
	__esModule: true,
	isCostTypeAvailable: () => true,
	isCurrencyAvailable: () => true,
	setAccountCostType: jest.fn(),
	setAccountCurrency: jest.fn(),
	setCostType: jest.fn(),
	setCurrency: jest.fn(),
}));

import { accountSettingsReducer } from './accountSettingsReducer';
import { accountSettingsStateKey } from './accountSettingsCommon';
import { fetchAccountSettingsFailure, fetchAccountSettingsSuccess } from './accountSettingsActions';
import * as selectors from './accountSettingsSelectors';

const mockType = 'aws' as any;
const fetchId = `${mockType}`;

describe('accountSettings store more tests', () => {
	test('fetch success stores payload and selector returns it', () => {
		const slice = accountSettingsReducer(undefined as any, fetchAccountSettingsSuccess({ data: { currency: 'USD' } } as any, { fetchId }));
		const root: any = { [accountSettingsStateKey]: slice };
		expect(selectors.selectAccountSettings(root, mockType)).toEqual({ data: { currency: 'USD' } });
	});

	test('error action stores error and selector returns undefined by default', () => {
		const err = new Error('x') as any;
		const slice = accountSettingsReducer(undefined as any, fetchAccountSettingsFailure(err, { fetchId }));
		const root: any = { [accountSettingsStateKey]: slice };
		expect(selectors.selectAccountSettings(root, 'other' as any)).toBeUndefined();
		expect(selectors.selectAccountSettingsError(root, mockType)).toBe(err);
	});
}); 