import { addProvider as apiCreateProvider } from 'api/providers';
import { FetchStatus } from 'store/common';
import { createMockStoreCreator } from 'store/mockStore';
import * as actions from './actions';
import { reducer as obReducer, stateKey } from './reducer';
import * as selectors from './selectors';
// jest.mock('api/providers');

const createObStore = createMockStoreCreator({
  [stateKey]: obReducer,
});

test('default state', async () => {
  const store = createObStore();
  expect(selectors.selectOnboardingState(store.getState())).toMatchSnapshot();
});

test('open and close onboarding', async () => {
  const store = createObStore();
  expect(selectors.selectOnboardingModal(store.getState())).toBe(false);
  store.dispatch(actions.openModal());
  expect(selectors.selectOnboardingModal(store.getState())).toBe(true);
  store.dispatch(actions.closeModal());
  expect(selectors.selectOnboardingModal(store.getState())).toBe(false);
});

test('on sending request to create source', () => {
  const store = createObStore();
  expect(selectors.selectApiStatus(store.getState())).toBe(FetchStatus.none);
  store.dispatch(actions.addSource());
  expect(selectors.selectApiStatus(store.getState())).toBe(
    FetchStatus.inProgress
  );
});

test('on adding source successfully', async () => {
  const store = createObStore();
  expect(selectors.selectApiStatus(store.getState())).toBe(FetchStatus.none);
  store.dispatch(actions.addSourceSuccess());
  expect(selectors.selectApiStatus(store.getState())).toBe(
    FetchStatus.complete
  );
});

test('on failure adding source', async () => {
  const errObj = new Error('NO!');
  const store = createObStore();
  expect(selectors.selectApiStatus(store.getState())).toBe(FetchStatus.none);
  store.dispatch(actions.addSourceFailure(errObj));
  expect(selectors.selectApiStatus(store.getState())).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectApiErrors(store.getState())).toBe(errObj);
});

test('toggle check all items in ocp onboarding', async () => {
  const store = createObStore();
  let items = selectors.selectOnboardingSourceKindChecked(store.getState());
  expect(
    Object.keys(items).every(actionItem => items[actionItem] === false)
  ).toBeTruthy();
  store.dispatch(actions.checkSourceKindCheckList());
  items = selectors.selectOnboardingSourceKindChecked(store.getState());
  expect(
    Object.keys(items).every(actionItem => items[actionItem] === true)
  ).toBeTruthy();
  store.dispatch(actions.checkSourceKindCheckList());
  items = selectors.selectOnboardingSourceKindChecked(store.getState());
  expect(
    Object.keys(items).every(actionItem => items[actionItem] === false)
  ).toBeTruthy();
});

test('update item check in ocp onboarding', async () => {
  const store = createObStore();
  const actionItem = 'check-oc';
  let items = selectors.selectOnboardingSourceKindChecked(store.getState());
  expect(items[actionItem]).toBeFalsy();
  store.dispatch(
    actions.updateSourceKindCheckList({ item: 'check-oc', value: true })
  );
  items = selectors.selectOnboardingSourceKindChecked(store.getState());
  expect(items[actionItem]).toBeTruthy();
  store.dispatch(
    actions.updateSourceKindCheckList({ item: 'check-oc', value: false })
  );
  items = selectors.selectOnboardingSourceKindChecked(store.getState());
  expect(items[actionItem]).toBeFalsy();
});

test('update a value alter it in store and set validation', async () => {
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
    {
      update: actions.updateArn,
      selector: selectors.selectOnboardingArn,
      validKey: 'arnValid',
    },
    {
      update: actions.updateS3BucketName,
      selector: selectors.selectOnboardingS3BucketName,
      validKey: 's3BucketNameValid',
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

test('update a value alter its dirtyness', async () => {
  [
    {
      update: actions.updateType,
      key: 'type',
    },
    {
      update: actions.updateClusterID,
      key: 'clusterId',
    },
    {
      update: actions.updateName,
      key: 'name',
    },
    {
      update: actions.updateArn,
      key: 'arn',
    },
    {
      update: actions.updateS3BucketName,
      key: 's3BucketName',
    },
  ].forEach(testCase => {
    const store = createObStore();
    expect(
      selectors.selectOnboardingDirty(store.getState())[testCase.key]
    ).toBeFalsy();
    store.dispatch(testCase.update('something', () => true));
    expect(
      selectors.selectOnboardingDirty(store.getState())[testCase.key]
    ).toBeTruthy();
  });
});
