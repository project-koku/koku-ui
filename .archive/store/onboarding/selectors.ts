import { RootState } from 'store/rootReducer';
import { stateKey } from './reducer';

export const selectOnboardingState = (state: RootState) => state[stateKey];

export const selectOnboardingName = (state: RootState) =>
  selectOnboardingState(state).name;

export const selectOnboardingConfirm = (state: RootState) =>
  selectOnboardingState(state).isConfirmShown;

export const selectOnboardingType = (state: RootState) =>
  selectOnboardingState(state).type;

export const selectOnboardingClusterID = (state: RootState) =>
  selectOnboardingState(state).clusterId;

export const selectOnboardingS3BucketName = (state: RootState) =>
  selectOnboardingState(state).s3BucketName;

export const selectOnboardingArn = (state: RootState) =>
  selectOnboardingState(state).arn;

export const selectOnboardingSourceKindChecked = (state: RootState) =>
  selectOnboardingState(state).sourceKindChecks;

export const selectOnboardingValidation = (state: RootState) => ({
  nameValid: selectOnboardingState(state).nameValid,
  typeValid: selectOnboardingState(state).typeValid,
  clusterIdValid: selectOnboardingState(state).clusterIdValid,
  s3BucketNameValid: selectOnboardingState(state).s3BucketNameValid,
  arnValid: selectOnboardingState(state).arnValid,
  azureCreds: azureCredsValidation(state),
  azureAuth: azureAuthValidation(state),
});

const azureCredsValidation = (state: RootState) => {
  const azureCreds = selectAzureCreds(state);
  const fields = Object.keys(azureCreds);
  return fields.length === 4 && fields.every(f => azureCreds[f].valid === true);
};

const azureAuthValidation = (state: RootState) => {
  const azureAuth = selectAzureAuth(state);
  const fields = Object.keys(azureAuth);
  return fields.length === 2 && fields.every(f => azureAuth[f].valid === true);
};

export const selectOnboardingDirty = (state: RootState) => {
  const obState = selectOnboardingState(state);
  return {
    name: obState.nameDirty,
    type: obState.typeDirty,
    clusterId: obState.clusterIdDirty,
    s3BucketName: obState.s3BucketNameDirty,
    arn: obState.arnDirty,
    clientId: obState.azure.credentials.clientId
      ? obState.azure.credentials.clientId
      : false,
    tenantId: obState.azure.credentials.tenantId
      ? obState.azure.credentials.tenantId
      : false,
    clientSecret: obState.azure.credentials.clientSecret
      ? obState.azure.credentials.clientSecret
      : false,
    subscriptionId: obState.azure.credentials.subscriptionId
      ? obState.azure.credentials.subscriptionId
      : false,
    resourceGroup: obState.azure.dataSource.resourceGroup
      ? obState.azure.dataSource.resourceGroup
      : false,
    storageAccount: obState.azure.dataSource.storageAccount
      ? obState.azure.dataSource.storageAccount
      : false,
  };
};

export const selectOnboardingIsInvalid = (state: RootState) => {
  const data = selectOnboardingValidation(state);
  return Object.keys(data).some(k => data[k] === false);
};

export const selectOnboardingModal = (state: RootState) =>
  selectOnboardingState(state).isOpen;

export const selectApiErrors = (state: RootState) =>
  selectOnboardingState(state).apiErrors;

export const selectApiStatus = (state: RootState) =>
  selectOnboardingState(state).apiStatus;

const selectAzure = (key, fields, defaultValue) => (state: RootState) => {
  const azureData = selectOnboardingState(state).azure[key] || {};
  return fields.reduce((acc, curr) => {
    const fieldState = azureData[curr];
    if (fieldState === undefined) {
      return { ...acc, [curr]: defaultValue };
    }
    return { ...acc, [curr]: fieldState };
  }, {});
};

export const selectAzureCreds = selectAzure(
  'credentials',
  ['clientId', 'tenantId', 'clientSecret', 'subscriptionId'],
  { value: '', valid: true, dirty: false }
);

export const selectAzureAuth = selectAzure(
  'dataSource',
  ['resourceGroup', 'storageAccount'],
  { value: '', valid: true, dirty: false }
);
