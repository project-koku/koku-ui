import { createMockStoreCreator } from 'store/mockStore';
import * as actions from './actions';
import { reducer as obReducer, stateKey } from './reducer';
import * as selectors from './selectors';

const createObStore = createMockStoreCreator({
  [stateKey]: obReducer,
});

test('default state', async () => {
  const store = createObStore();
  expect(selectors.selectOnboardingState(store.getState())).toMatchSnapshot();
});

test('update a value alter it in store and set the validation', async () => {
  const validation = (value: string) => value !== 'bad_value';
  [
    {
      update: actions.updateType,
      selector: selectors.selectOnboardingType,
      validKey: 'typeValid',
    },
    {
      update: actions.updateClusterID,
      selector: selectors.selectOnboardingClusterID,
      validKey: 'clusterIdValid',
    },
    {
      update: actions.updateName,
      selector: selectors.selectOnboardingName,
      validKey: 'nameValid',
    },
  ].forEach(testCase => {
    const store = createObStore();
    store.dispatch(testCase.update('ok_value', validation));
    expect(testCase.selector(store.getState())).toBe('ok_value');
    expect(
      selectors.selectOnboardingValidation(store.getState())[testCase.validKey]
    ).toBe(true);

    store.dispatch(testCase.update('bad_value', validation));
    expect(testCase.selector(store.getState())).toBe('bad_value');
    expect(
      selectors.selectOnboardingValidation(store.getState())[testCase.validKey]
    ).toBe(false);
  });
});
