import { addProvider as apiCreateProvider } from 'api/providers';
import { FetchStatus } from 'store/common';
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

test('display the confirm dialog hides the onboarding wizard', async () => {
  const store = createObStore();
  store.dispatch(actions.openModal());
  expect(selectors.selectOnboardingModal(store.getState())).toBe(true);
  expect(selectors.selectOnboardingConfirm(store.getState())).toBe(false);
  store.dispatch(actions.displayConfirm());
  expect(selectors.selectOnboardingModal(store.getState())).toBe(false);
  expect(selectors.selectOnboardingConfirm(store.getState())).toBe(true);
});

test('in confirm dialog on click continue, display onboarding wizard', async () => {
  const store = createObStore();
  store.dispatch(actions.openModal());
  store.dispatch(actions.displayConfirm());
  store.dispatch(actions.hideConfirm());
  expect(selectors.selectOnboardingModal(store.getState())).toBe(true);
  expect(selectors.selectOnboardingConfirm(store.getState())).toBe(false);
});

test('update azure creds', async () => {
  const store = createObStore();
  expect(selectors.selectAzureCreds(store.getState())).toEqual({
    clientId: { value: '', valid: true, dirty: false },
    tenantId: { value: '', valid: true, dirty: false },
    subscriptionId: { value: '', valid: true, dirty: false },
    clientSecret: { value: '', valid: true, dirty: false },
  });
  store.dispatch(
    actions.updateCreds({ name: 'clientId', value: 'h' }, () => true)
  );
  expect(selectors.selectAzureCreds(store.getState())).toEqual({
    clientId: { value: 'h', valid: true, dirty: true },
    tenantId: { value: '', valid: true, dirty: false },
    subscriptionId: { value: '', valid: true, dirty: false },
    clientSecret: { value: '', valid: true, dirty: false },
  });
  store.dispatch(
    actions.updateCreds({ name: 'tenantId', value: 't' }, () => false)
  );
  expect(selectors.selectAzureCreds(store.getState())).toEqual({
    clientId: { value: 'h', valid: true, dirty: true },
    tenantId: { value: 't', valid: false, dirty: true },
    subscriptionId: { value: '', valid: true, dirty: false },
    clientSecret: { value: '', valid: true, dirty: false },
  });
});

test('update azure auth', async () => {
  const store = createObStore();
  expect(selectors.selectAzureAuth(store.getState())).toEqual({
    resourceGroup: { value: '', valid: true, dirty: false },
    storageAccount: { value: '', valid: true, dirty: false },
  });
  store.dispatch(
    actions.updateDataSource({ name: 'resourceGroup', value: 'rg' }, () => true)
  );
  expect(selectors.selectAzureAuth(store.getState())).toEqual({
    resourceGroup: { value: 'rg', valid: true, dirty: true },
    storageAccount: { value: '', valid: true, dirty: false },
  });
  store.dispatch(
    actions.updateDataSource(
      { name: 'storageAccount', value: 'sa2' },
      () => false
    )
  );
  expect(selectors.selectAzureAuth(store.getState())).toEqual({
    resourceGroup: { value: 'rg', valid: true, dirty: true },
    storageAccount: { value: 'sa2', valid: false, dirty: true },
  });
});
