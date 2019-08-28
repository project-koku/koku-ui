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
});

export const selectOnboardingDirty = (state: RootState) => {
  const obState = selectOnboardingState(state);
  return {
    name: obState.nameDirty,
    type: obState.typeDirty,
    clusterId: obState.clusterIdDirty,
    s3BucketName: obState.s3BucketNameDirty,
    arn: obState.arnDirty,
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
