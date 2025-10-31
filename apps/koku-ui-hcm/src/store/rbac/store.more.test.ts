import { reducer as rbacReducer, stateKey as rbacStateKey } from './reducer';
import { fetchRbacFailure, fetchRbacSuccess } from './actions';
import { selectRbacNotification, selectRbacStatus } from './selectors';

describe('rbac store more', () => {
	test('updates status and notification on success and failure', () => {
		const ok = rbacReducer(undefined as any, fetchRbacSuccess({ data: { is_org_admin: true, permissions: [] } } as any));
		const rootOk: any = { [rbacStateKey]: ok };
		expect(selectRbacStatus(rootOk)).toBe(2); // FetchStatus.complete
		const errState = rbacReducer(undefined as any, fetchRbacFailure(new Error('x') as any, { notification: {} } as any));
		const rootErr: any = { [rbacStateKey]: errState };
		expect(selectRbacNotification(rootErr)).toBeDefined();
	});
}); 