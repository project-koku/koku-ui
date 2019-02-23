import { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { ActionType, getType } from 'typesafe-actions';
import {
  addSourceFailure,
  addSourceRequest,
  addSourceSuccess,
  cancelOnboarding,
  checkKorekutaCheckList,
  checkSourceKindCheckList,
  closeModal,
  openModal,
  updateClusterID,
  updateKorekutaCheckList,
  updateName,
  updateSourceKindCheckList,
  updateType,
} from './actions';

export type Actions = ActionType<
  | typeof updateClusterID
  | typeof updateName
  | typeof updateType
  | typeof updateSourceKindCheckList
  | typeof updateKorekutaCheckList
  | typeof openModal
  | typeof closeModal
  | typeof cancelOnboarding
  | typeof checkSourceKindCheckList
  | typeof checkKorekutaCheckList
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
  sourceKindChecks: object;
  korekutaChecks: object;
  isOpen: boolean;
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
  sourceKindChecks: {
    'check-ocp-version': false,
    'check-operator-metering': false,
    'check-insights-client': false,
    'check-ansible-epel': false,
    'check-oc': false,
  },
  korekutaChecks: {
    'check-ocp-api': false,
    'check-ocp-metering-operator-token-path': false,
    'check-ocp-operator-metering-namespace': false,
    'check-super-user-password': false,
  },
  isOpen: false,
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
    case getType(updateSourceKindCheckList):
      return {
        ...state,
        sourceKindChecks: {
          ...state.sourceKindChecks,
          [action.payload.item]: action.payload.value,
        },
      };
    case getType(updateKorekutaCheckList):
      return {
        ...state,
        korekutaChecks: {
          ...state.korekutaChecks,
          [action.payload.item]: action.payload.value,
        },
      };
    case getType(checkSourceKindCheckList):
      const skVal = areAllChecked(state.sourceKindChecks) ? false : true;
      return {
        ...state,
        sourceKindChecks: setAll(state.sourceKindChecks, skVal),
      };
    case getType(checkKorekutaCheckList):
      const kVal = areAllChecked(state.korekutaChecks) ? false : true;
      return {
        ...state,
        sourceKindChecks: setAll(state.korekutaChecks, kVal),
      };
    case getType(cancelOnboarding):
      return defaultState;
    case getType(openModal):
      return { ...state, isOpen: true };
    case getType(closeModal):
      return { ...state, isOpen: false };
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
        ...state,
        apiStatus: FetchStatus.complete,
        apiErrors: null,
      };
    default:
      return state;
  }
}
