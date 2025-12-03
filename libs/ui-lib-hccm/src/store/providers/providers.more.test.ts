import { providersReducer } from './providersReducer';
import { fetchProvidersFailure, fetchProvidersSuccess } from './providersActions';
import * as selectors from './providersSelectors';
import { getFetchId, stateKey } from './providersCommon';

const key = 'aws' as any;
const q = '';
const fetchId = getFetchId(key, q);

describe('providers store more', () => {
	test('fetch success and selectors retrieve data', () => {
		const payload = { meta: {}, data: [] } as any;
		const slice = providersReducer(undefined as any, fetchProvidersSuccess(payload, { fetchId }));
		const root: any = { [stateKey]: slice };
		const selected = selectors.selectProviders(root, key, q) as any;
		expect(selected.meta).toEqual(payload.meta);
		expect(selected.data).toEqual(payload.data);
		expect(typeof selected.timeRequested).toBe('number');
	});

	test('failure stores error', () => {
		const err = new Error('x') as any;
		const slice = providersReducer(undefined as any, fetchProvidersFailure(err, { fetchId }));
		const root: any = { [stateKey]: slice };
		expect(selectors.selectProvidersError(root, key, q)).toBe(err);
	});
}); 