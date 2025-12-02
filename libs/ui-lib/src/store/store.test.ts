import type { AxiosInstance } from 'axios';

jest.mock('@reduxjs/toolkit', () => ({
	__esModule: true,
	configureStore: jest.fn((opts: any) => ({ ...opts, dummy: true })),
}));

const interceptorsUse = jest.fn();
const axiosMock = {
	interceptors: { response: { use: interceptorsUse } },
} as unknown as AxiosInstance;

jest.mock('@koku-ui/api/api', () => ({ __esModule: true, default: axiosMock }));

describe('store.configureStore and middleware', () => {
	let configureStore: typeof import('./store').configureStore;
	let middleware: typeof import('./store').middleware;
	let rootReducer: any;
	let toolkit: any;

	beforeEach(async () => {
		jest.clearAllMocks();
		jest.resetModules();
		toolkit = await import('@reduxjs/toolkit');
		({ configureStore, middleware } = await import('./store'));
		({ rootReducer } = await import('./rootReducer'));
	});

	test('middleware disables serializableCheck for actions and state', () => {
		const fakeGetDefault = jest.fn((opts?: any) => opts);
		const mw = middleware(fakeGetDefault as any);
		expect(mw).toEqual({
			serializableCheck: {
				ignoreActions: true,
				ignoreState: true,
			},
		});
	});

	test('configureStore creates RTK store with rootReducer and wires axios response interceptor', () => {
		configureStore({} as any);
		expect(toolkit.configureStore).toHaveBeenCalledWith(
			expect.objectContaining({ reducer: rootReducer, middleware: expect.any(Function), preloadedState: {} })
		);
		expect(interceptorsUse).toHaveBeenCalled();
	});
}); 