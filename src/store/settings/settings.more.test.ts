import { settingsReducer } from './settingsReducer';
import { fetchSettingsFailure, fetchSettingsSuccess } from './settingsActions';
import * as selectors from './settingsSelectors';
import { settingsStateKey, getFetchId } from './settingsCommon';

const type = 'aws' as any;
const q = '';
const fetchId = getFetchId(type, q);

describe('settings store more', () => {
	test('fetch success stores payload and selectors return it', () => {
		const payload = { data: [] } as any;
		const slice = settingsReducer(undefined as any, fetchSettingsSuccess(payload, { fetchId }));
		const root: any = { [settingsStateKey]: slice };
		expect(selectors.selectSettings(root, type, q)).toEqual(payload);
	});

	test('failure stores error', () => {
		const err = new Error('oops') as any;
		const slice = settingsReducer(undefined as any, fetchSettingsFailure(err, { fetchId }));
		const root: any = { [settingsStateKey]: slice };
		expect(selectors.selectSettingsError(root, type, q)).toBe(err);
	});
}); 