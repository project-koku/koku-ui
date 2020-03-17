import { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { ActionType, getType } from 'typesafe-actions';
import {
  addSourceFailure,
  addSourceRequest,
  addSourceSuccess,
  cancelOnboarding,
  checkSourceKindCheckList,
  closeModal,
  displayConfirm,
  hideConfirm,
  openModal,
  updateArn,
  updateClusterID,
  updateCreds,
  updateDataSource,
  updateName,
  updateS3BucketName,
  updateSourceKindCheckList,
  updateType,
} from './actions';

export type Actions = ActionType<
  | typeof updateClusterID
  | typeof updateName
  | typeof updateType
  | typeof updateS3BucketName
  | typeof updateArn
  | typeof updateCreds
  | typeof updateDataSource
  | typeof updateSourceKindCheckList
  | typeof openModal
  | typeof closeModal
  | typeof cancelOnboarding
  | typeof displayConfirm
  | typeof hideConfirm
  | typeof checkSourceKindCheckList
  | typeof addSourceRequest
  | typeof addSourceSuccess
  | typeof addSourceFailure
>;

type State = Readonly<{
  type: string;
  typeValid: boolean;
  typeDirty: boolean;
  name: string;
  nameValid: boolean;
  nameDirty: boolean;
  clusterId: string;
  clusterIdValid: boolean;
  clusterIdDirty: boolean;
  s3BucketName: string;
  s3BucketNameValid: boolean;
  s3BucketNameDirty: boolean;
  arn: string;
  arnValid: boolean;
  arnDirty: boolean;
  azure: {
    credentials: {
      [k: string]: { value: string; valid: boolean; dirty: boolean };
    };
    dataSource: {
      [k: string]: { value: string; valid: boolean; dirty: boolean };
    };
  };
  sourceKindChecks: object;
  isOpen: boolean;
  isConfirmShown: boolean;
  apiStatus: FetchStatus;
  apiErrors: AxiosError;
}>;

export const defaultState: State = {
  type: '',
  typeValid: true,
  typeDirty: false,
  name: '',
  nameValid: true,
  nameDirty: false,
  clusterId: '',
  clusterIdValid: true,
  clusterIdDirty: false,
  s3BucketName: '',
  s3BucketNameValid: true,
  s3BucketNameDirty: false,
  arn: '',
  arnValid: true,
  arnDirty: false,
  sourceKindChecks: {
    install_openshift: false,
    install_others: false,
  },
  azure: {
    credentials: {},
    dataSource: {},
  },
  isOpen: false,
  isConfirmShown: false,
  apiStatus: FetchStatus.none,
  apiErrors: null,
};

const areAllChecked = state => Object.keys(state).every(k => state[k]);

const setAll = (state, value) => {
  return Object.keys(state)
    .map(k => ({ [k]: value }))
    .reduce((acc, curr) => ({ ...acc, ...curr }));
};

export const stateKey = 'onboarding';

export function reducer(state: State = defaultState, action: Actions): State {
  switch (action.type) {
    case getType(updateType):
      return {
        ...state,
        type: action.payload,
        typeValid: action.meta(action.payload),
        typeDirty: true,
      };
    case getType(updateName):
      return {
        ...state,
        name: action.payload,
        nameValid: action.meta(action.payload),
        nameDirty: true,
      };
    case getType(updateClusterID):
      return {
        ...state,
        clusterId: action.payload,
        clusterIdValid: action.meta(action.payload),
        clusterIdDirty: true,
      };
    case getType(updateS3BucketName):
      return {
        ...state,
        s3BucketName: action.payload,
        s3BucketNameValid: action.meta(action.payload),
        s3BucketNameDirty: true,
      };
    case getType(updateArn):
      return {
        ...state,
        arn: action.payload,
        arnValid: action.meta(action.payload),
        arnDirty: true,
      };
    case getType(updateSourceKindCheckList):
      return {
        ...state,
        sourceKindChecks: {
          ...state.sourceKindChecks,
          [action.payload.item]: action.payload.value,
        },
      };
    case getType(checkSourceKindCheckList):
      const skVal = areAllChecked(state.sourceKindChecks) ? false : true;
      return {
        ...state,
        sourceKindChecks: setAll(state.sourceKindChecks, skVal),
      };
    case getType(updateCreds):
      return {
        ...state,
        azure: {
          ...state.azure,
          credentials: {
            ...state.azure.credentials,
            [action.payload.name]: {
              value: action.payload.value,
              valid: action.meta(action.payload.value),
              dirty: true,
            },
          },
        },
      };
    case getType(updateDataSource):
      return {
        ...state,
        azure: {
          ...state.azure,
          dataSource: {
            ...state.azure.dataSource,
            [action.payload.name]: {
              value: action.payload.value,
              valid: action.meta(action.payload.value),
              dirty: true,
            },
          },
        },
      };
    case getType(cancelOnboarding):
      return defaultState;
    case getType(openModal):
      return { ...state, isOpen: true };
    case getType(closeModal):
      return { ...state, isOpen: false };
    case getType(displayConfirm):
      return { ...state, isOpen: false, isConfirmShown: true };
    case getType(hideConfirm):
      return { ...state, isOpen: true, isConfirmShown: false };
    case getType(addSourceRequest):
      return {
        ...state,
        apiStatus: FetchStatus.inProgress,
        apiErrors: null,
      };
    case getType(addSourceFailure):
      return {
        ...state,
        apiStatus: FetchStatus.complete,
        apiErrors: action.payload,
      };
    case getType(addSourceSuccess):
      return {
        ...defaultState,
        apiStatus: FetchStatus.complete,
      };
    default:
      return state;
  }
}
