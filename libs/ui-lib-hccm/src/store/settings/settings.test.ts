import { FetchStatus } from '../common';
import { settingsStateKey, getFetchId } from './settingsCommon';
import { settingsReducer, defaultState } from './settingsReducer';
import {
	fetchSettings,
	fetchSettingsFailure,
	fetchSettingsRequest,
	fetchSettingsSuccess,
	resetStatus,
	updateSettings,
	updateSettingsFailure,
	updateSettingsRequest,
	updateSettingsSuccess,
} from './settingsActions';
import * as selectors from './settingsSelectors';

// Mock i18n to return message ids for predictable assertions
jest.mock('@koku-ui/i18n/i18n/intl', () => ({
	__esModule: true,
	default: { formatMessage: (m: any) => m?.id || 'msg' },
}));

// Partially mock api, keeping enums/paths while stubbing functions
jest.mock('@koku-ui/api/settings', () => {
	const actual = jest.requireActual('@koku-ui/api/settings');
	return { __esModule: true, ...actual, fetchSettings: jest.fn(), updateSettings: jest.fn() };
});

import { SettingsType } from '@koku-ui/api/settings';
import * as api from '@koku-ui/api/settings';

describe('settings store', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const makeRoot = (slice: any) => ({ [settingsStateKey]: slice }) as any;
	const emptySlice = () => ({ byId: new Map(), errors: new Map(), notification: new Map(), status: new Map() });

	test('resetState returns default state', () => {
		let state = settingsReducer(undefined as any, fetchSettingsRequest({ fetchId: 'x' } as any));
		state = settingsReducer(state, (require('store/ui/uiActions') as any).resetState());
		expect(state).toEqual(defaultState);
	});

	test('resetStatus clears status map', () => {
		let state = settingsReducer(undefined as any, fetchSettingsRequest({ fetchId: 'a' } as any));
		state = settingsReducer(state, resetStatus());
		expect(state.status?.size).toBe(0);
	});

	test('request/success/failure reducer branches', () => {
		const fid = getFetchId(SettingsType.tags, 'q=1');
		let state = settingsReducer(undefined as any, fetchSettingsRequest({ fetchId: fid } as any));
		expect(state.status?.get(fid)).toBe(FetchStatus.inProgress);

		const payload: any = { data: { enabled: true }, meta: {} };
		state = settingsReducer(state, fetchSettingsSuccess(payload, { fetchId: fid } as any));
		expect(state.status?.get(fid)).toBe(FetchStatus.complete);
		expect(state.byId.get(fid)).toEqual(payload);
		expect(state.errors?.get(fid)).toBeNull();

		const err = new Error('boom') as any;
		state = settingsReducer(state, fetchSettingsFailure(err, { fetchId: fid } as any));
		expect(state.errors?.get(fid)).toBe(err);
	});

	test('selectors read state correctly', () => {
		const fid = getFetchId(SettingsType.tags, '');
		let slice: any = emptySlice();
		slice = settingsReducer(slice, updateSettingsRequest({ fetchId: fid } as any));
		expect(selectors.selectSettingsUpdateStatus(makeRoot(slice), SettingsType.tags)).toBe(FetchStatus.inProgress);

		slice = settingsReducer(slice, updateSettingsSuccess({} as any, { fetchId: fid, notification: { title: 't' } } as any));
		expect(selectors.selectSettingsUpdateStatus(makeRoot(slice), SettingsType.tags)).toBe(FetchStatus.complete);
		expect(selectors.selectSettingsUpdateNotification(makeRoot(slice), SettingsType.tags)).toEqual({ title: 't' });

		slice = settingsReducer(slice, updateSettingsFailure({} as any, { fetchId: fid, notification: { title: 'e' } } as any));
		expect(selectors.selectSettingsUpdateError(makeRoot(slice), SettingsType.tags)).toEqual({});
	});

	test('fetchSettings thunk: success dispatches request and success', async () => {
		const type = SettingsType.costCategories;
		const query = 'limit=1';
		const res = { data: { data: [], meta: {} } } as any;
		(api.fetchSettings as jest.Mock).mockResolvedValue(res);
		const dispatched: any[] = [];
		const getState = () => makeRoot(emptySlice());
		await (fetchSettings(type, query) as any)((a: any) => dispatched.push(a), getState);
		expect(dispatched[0].type).toBe('settings/fetch/request');
		expect(dispatched[1].type).toBe('settings/fetch/success');
		expect(dispatched[1].payload).toBe(res.data);
	});

	test('fetchSettings thunk: does not dispatch when in progress or has error', async () => {
		const type = SettingsType.tags;
		const query = '';
		const fid = getFetchId(type, query);
		const slice: any = emptySlice();
		slice.status.set(fid, FetchStatus.inProgress);
		const dispatched: any[] = [];
		const getState = () => makeRoot(slice);
		await (fetchSettings(type, query) as any)((a: any) => dispatched.push(a), getState);
		expect(dispatched.length).toBe(0);

		slice.status.delete(fid);
		slice.errors.set(fid, new Error('x') as any);
		await (fetchSettings(type, query) as any)((a: any) => dispatched.push(a), getState);
		expect(dispatched.length).toBe(0);
	});

	test.each([
		[SettingsType.costCategoriesEnable, 'settingsSuccessCostCategories'],
		[SettingsType.costCategoriesDisable, 'settingsSuccessCostCategories'],
		[SettingsType.platformProjectsAdd, 'settingsSuccessPlatformProjects'],
		[SettingsType.platformProjectsRemove, 'settingsSuccessPlatformProjects'],
		[SettingsType.tagsEnable, 'settingsSuccessTags'],
		[SettingsType.tagsDisable, 'settingsSuccessTags'],
		[SettingsType.tagsMappingsChildAdd, 'settingsSuccessTags'],
		[SettingsType.tagsMappingsChildRemove, 'settingsSuccessTags'],
		[SettingsType.tagsMappingsParentRemove, 'settingsSuccessTags'],
	])('updateSettings thunk success builds notification title for %s', async (type, expectedMsgId) => {
		(api.updateSettings as jest.Mock).mockResolvedValue({} as any);
		const dispatched: any[] = [];
		const getState = () => makeRoot(emptySlice());
		await (updateSettings(type as SettingsType, { ids: ['1', '2'] }) as any)((a: any) => dispatched.push(a), getState);
		expect(dispatched[0].type).toBe('settings/update/request');
		expect(dispatched[1].type).toBe('settings/update/success');
		expect(dispatched[1].meta.notification.title).toBe(expectedMsgId);
	});

	test('updateSettings thunk: early return when in progress', async () => {
		const type = SettingsType.tags;
		const fid = getFetchId(type);
		const slice: any = emptySlice();
		slice.status.set(fid, FetchStatus.inProgress);
		const dispatched: any[] = [];
		const getState = () => makeRoot(slice);
		await (updateSettings(type, { ids: ['x'] }) as any)((a: any) => dispatched.push(a), getState);
		expect(dispatched.length).toBe(0);
	});

	test.each([
		[
			SettingsType.tagsDisable,
			{ response: { status: 412, data: { error: true, ids: ['a', 'b'] } } },
			'settingsTagMappingDisableErrorTitle',
			'settingsTagMappingDisableErrorDesc',
		],
		[
			SettingsType.tagsDisable,
			{ response: { status: 412, data: { enabled: 5, limit: 3 } } },
			'settingsTagsErrorTitle',
			'settingsTagsErrorDesc',
		],
		[
			SettingsType.tagsMappingsChildAdd,
			{ response: { status: 400 } },
			'tagMappingAddErrorTitle',
			'tagMappingAddErrorDesc',
		],
		[
			SettingsType.platformProjectsAdd,
			{ response: { status: 500 } },
			'settingsErrorTitle',
			'settingsErrorDesc',
		],
	])('updateSettings thunk error builds notification for %s', async (type, error, expectTitle, expectDesc) => {
		(api.updateSettings as jest.Mock).mockRejectedValue(error);
		const dispatched: any[] = [];
		const getState = () => makeRoot(emptySlice());
		await (updateSettings(type as SettingsType, { ids: ['x'] }) as any)((a: any) => dispatched.push(a), getState);
		expect(dispatched[0].type).toBe('settings/update/request');
		expect(dispatched[1].type).toBe('settings/update/failure');
		expect(dispatched[1].meta.notification.title).toBe(expectTitle);
		expect(dispatched[1].meta.notification.description).toBe(expectDesc);
	});
}); 