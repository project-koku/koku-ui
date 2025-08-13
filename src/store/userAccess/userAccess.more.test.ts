import { userAccessReducer } from './userAccessReducer';
import { fetchUserAccessFailure, fetchUserAccessSuccess } from './userAccessActions';
import * as selectors from './userAccessSelectors';
import { getFetchId, stateKey } from './userAccessCommon';

const key = 'koku' as any;
const q = '';
const fetchId = getFetchId(key, q);

describe('userAccess store more', () => {
	test('success stores access and selector returns it', () => {
		const payload = { data: [] } as any;
		const slice = userAccessReducer(undefined as any, fetchUserAccessSuccess(payload, { fetchId }));
		const root: any = { [stateKey]: slice };
		expect(selectors.selectUserAccess(root, key, q)).toEqual(payload);
	});

	test('failure stores error', () => {
		const err = new Error('err') as any;
		const slice = userAccessReducer(undefined as any, fetchUserAccessFailure(err, { fetchId }));
		const root: any = { [stateKey]: slice };
		expect(selectors.selectUserAccessError(root, key, q)).toBe(err);
	});
}); 