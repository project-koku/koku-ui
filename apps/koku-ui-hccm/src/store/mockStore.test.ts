import { AnyAction } from 'redux';
import { createMockStoreCreator } from './mockStore';

const simpleReducer = (state = { a: 1 }, _action: AnyAction) => state;

describe('createMockStoreCreator', () => {
	test('creates mock store with single reducer function', () => {
		const create = createMockStoreCreator(simpleReducer as any);
		const store = create({ a: 2 } as any);
		expect(store.getState()).toEqual({ a: 2 });
	});

	test('creates mock store with reducers map object', () => {
		const root = { one: (s = 1) => s, two: (s = 2) => s } as any;
		const create = createMockStoreCreator(root);
		const store = create({ one: 10, two: 20 } as any);
		expect(store.getState()).toEqual({ one: 10, two: 20 });
	});
}); 