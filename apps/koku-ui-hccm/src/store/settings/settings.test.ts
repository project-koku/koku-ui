import { FetchStatus } from 'store/common';
import { settingsStateKey, getFetchId } from './settingsCommon';
import { settingsReducer, defaultState } from './settingsReducer';
import {
	fetchSettings,
	fetchSettingsFailure,
	fetchSettingsRequest,
	fetchSettingsSuccess,
	resetNotifications,
	resetStatus,
	updateCategorySettings,
	updatePlatformSettings,
	updateTagSettings,
	updateTagSettingsFailure,
	updateTagSettingsRequest,
	updateTagSettingsSuccess,
} from './settingsActions';
import * as selectors from './settingsSelectors';

// Mock i18n to return message ids for predictable assertions
jest.mock('components/i18n', () => ({ __esModule: true, intl: { formatMessage: (m: any) => m?.id || 'msg' } }));

// Partially mock api, keeping enums/paths while stubbing functions
jest.mock('api/settings', () => {
	const actual = jest.requireActual('api/settings');
	return {
		__esModule: true,
		...actual,
		fetchSettings: jest.fn(),
		updateCategorySettings: jest.fn(),
		updatePlatformSettings: jest.fn(),
		updateTagSettings: jest.fn(),
	};
});

import { SettingsType } from 'api/settings';
import * as api from 'api/settings';

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

	test('scoped resetNotifications/resetStatus only clear the given fetchId', () => {
		const tagsFid = getFetchId(SettingsType.tags, 'q=1');
		const enableFid = getFetchId(SettingsType.tagsEnable);
		let state = settingsReducer(undefined as any, fetchSettingsRequest({ fetchId: tagsFid } as any));
		state = settingsReducer(state, updateTagSettingsRequest({ fetchId: enableFid } as any));
		state = settingsReducer(
			state,
			updateTagSettingsSuccess({} as any, { fetchId: enableFid, notification: { title: 'enabled' } } as any)
		);
		state = settingsReducer(
			state,
			fetchSettingsSuccess({ data: [] } as any, { fetchId: tagsFid } as any)
		);

		state = settingsReducer(state, resetNotifications({ fetchId: enableFid }));
		expect(state.notification?.get(enableFid)).toBeUndefined();
		expect(state.status?.get(tagsFid)).toBe(FetchStatus.complete);

		state = settingsReducer(state, resetStatus({ fetchId: enableFid }));
		expect(state.status?.get(enableFid)).toBeUndefined();
		expect(state.status?.get(tagsFid)).toBe(FetchStatus.complete);
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
		slice = settingsReducer(slice, updateTagSettingsRequest({ fetchId: fid } as any));
		expect(selectors.selectSettingsFetchStatus(makeRoot(slice), SettingsType.tags, '')).toBe(FetchStatus.inProgress);

		slice = settingsReducer(slice, updateTagSettingsSuccess({} as any, { fetchId: fid, notification: { title: 't' } } as any));
		expect(selectors.selectSettingsFetchStatus(makeRoot(slice), SettingsType.tags, '')).toBe(FetchStatus.complete);
		expect(selectors.selectSettingsNotification(makeRoot(slice), SettingsType.tags, '')).toEqual({ title: 't' });

		slice = settingsReducer(slice, updateTagSettingsFailure({} as any, { fetchId: fid, notification: { title: 'e' } } as any));
		expect(selectors.selectSettingsError(makeRoot(slice), SettingsType.tags, '')).toEqual({});
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

	test('fetchSettings thunk: does not dispatch when in progress', async () => {
		const type = SettingsType.tags;
		const query = '';
		const fid = getFetchId(type, query);
		const slice: any = emptySlice();
		slice.status.set(fid, FetchStatus.inProgress);
		const dispatched: any[] = [];
		const getState = () => makeRoot(slice);
		await (fetchSettings(type, query) as any)((a: any) => dispatched.push(a), getState);
		expect(dispatched.length).toBe(0);
	});

	// Intentionally no retry after failure — tags (and similar) render <Unavailable /> when settingsError is set.
	test('fetchSettings thunk: does not dispatch when a prior error exists', async () => {
		const type = SettingsType.tags;
		const query = '';
		const fid = getFetchId(type, query);
		const slice: any = emptySlice();
		slice.errors.set(fid, new Error('x') as any);
		const dispatched: any[] = [];
		const getState = () => makeRoot(slice);
		await (fetchSettings(type, query) as any)((a: any) => dispatched.push(a), getState);
		expect(dispatched.length).toBe(0);
	});

	test.each([
		[SettingsType.costCategoriesEnable, 'settingsSuccessCostCategories', 'settings/category/update'],
		[SettingsType.costCategoriesDisable, 'settingsSuccessCostCategories', 'settings/category/update'],
		[SettingsType.platformProjectsAdd, 'settingsSuccessPlatformProjects', 'settings/platform/update'],
		[SettingsType.platformProjectsRemove, 'settingsSuccessPlatformProjects', 'settings/platform/update'],
		[SettingsType.tagsEnable, 'settingsSuccessTags', 'settings/tag/update'],
		[SettingsType.tagsDisable, 'settingsSuccessTags', 'settings/tag/update'],
		[SettingsType.tagsMappingsChildAdd, 'settingsSuccessTags', 'settings/tag/update'],
		[SettingsType.tagsMappingsChildRemove, 'settingsSuccessTags', 'settings/tag/update'],
		[SettingsType.tagsMappingsParentRemove, 'settingsSuccessTags', 'settings/tag/update'],
	])('update thunk success builds notification title for %s', async (type, expectedMsgId, actionPrefix) => {
		const getState = () => makeRoot(emptySlice());
		const dispatched: any[] = [];
		const payload = { ids: ['1', '2'] };

		if (
			type === SettingsType.costCategoriesEnable ||
			type === SettingsType.costCategoriesDisable
		) {
			(api.updateCategorySettings as jest.Mock).mockResolvedValue({} as any);
			await (updateCategorySettings(type, payload) as any)((a: any) => dispatched.push(a), getState);
		} else if (
			type === SettingsType.platformProjectsAdd ||
			type === SettingsType.platformProjectsRemove
		) {
			(api.updatePlatformSettings as jest.Mock).mockResolvedValue({} as any);
			await (updatePlatformSettings(type, [{ project: 'p', group: 'platform' }]) as any)(
				(a: any) => dispatched.push(a),
				getState
			);
		} else {
			(api.updateTagSettings as jest.Mock).mockResolvedValue({} as any);
			await (updateTagSettings(type, payload) as any)((a: any) => dispatched.push(a), getState);
		}

		expect(dispatched[0].type).toBe(`${actionPrefix}/request`);
		expect(dispatched[1].type).toBe(`${actionPrefix}/success`);
		expect(dispatched[1].meta.notification.title).toBe(expectedMsgId);
	});

	test('updateTagSettings thunk: early return when in progress', async () => {
		const type = SettingsType.tagsEnable;
		const fid = getFetchId(type);
		const slice: any = emptySlice();
		slice.status.set(fid, FetchStatus.inProgress);
		const dispatched: any[] = [];
		const getState = () => makeRoot(slice);
		await (updateTagSettings(type, { ids: ['x'] }) as any)((a: any) => dispatched.push(a), getState);
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
	])('updateTagSettings thunk error builds notification for %s', async (type, error, expectTitle, expectDesc) => {
		(api.updateTagSettings as jest.Mock).mockRejectedValue(error);
		const dispatched: any[] = [];
		const getState = () => makeRoot(emptySlice());
		await (updateTagSettings(type as SettingsType, { ids: ['x'] }) as any)((a: any) => dispatched.push(a), getState);
		expect(dispatched[0].type).toBe('settings/tag/update/request');
		expect(dispatched[1].type).toBe('settings/tag/update/failure');
		expect(dispatched[1].meta.notification.title).toBe(expectTitle);
		expect(dispatched[1].meta.notification.description).toBe(expectDesc);
	});

	test('updatePlatformSettings thunk error builds generic notification', async () => {
		(api.updatePlatformSettings as jest.Mock).mockRejectedValue({ response: { status: 500 } });
		const dispatched: any[] = [];
		const getState = () => makeRoot(emptySlice());
		await (updatePlatformSettings(SettingsType.platformProjectsAdd, [{ project: 'p' }]) as any)(
			(a: any) => dispatched.push(a),
			getState
		);
		expect(dispatched[0].type).toBe('settings/platform/update/request');
		expect(dispatched[1].type).toBe('settings/platform/update/failure');
		expect(dispatched[1].meta.notification.title).toBe('settingsErrorTitle');
		expect(dispatched[1].meta.notification.description).toBe('settingsErrorDesc');
	});
});
