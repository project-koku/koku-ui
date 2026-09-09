import * as mod from './index';

describe('ros index wiring', () => {
  test('exports reducer, selectors, actions, and stateKey', () => {
    const initial = mod.rosReducer(undefined as any, { type: '@@INIT' } as any);
    expect(initial.available).toBeInstanceOf(Map);
    expect(initial.byId).toBeInstanceOf(Map);
    expect(initial.errors).toBeInstanceOf(Map);
    expect(initial.fetchStatus).toBeInstanceOf(Map);

    const root: any = { [mod.rosStateKey]: initial };
    expect(mod.rosSelectors.selectRosState(root)).toBe(initial);
    expect(typeof mod.rosActions.fetchRos).toBe('function');
  });
});
