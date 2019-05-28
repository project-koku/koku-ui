import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { addProvider as apiCreateProvider } from 'api/providers';
import { Provider, ProviderRequest } from 'api/providers';
import { AxiosError } from 'axios';
import i18next from 'i18next';
import { Dispatch } from 'react-redux';
import { sourcesActions } from 'store/sourceSettings';
import {
  createAction,
  createAsyncAction,
  createStandardAction,
} from 'typesafe-actions';
import { Validator } from 'utils/validators';

export const updateType = createStandardAction('onboarding/update/type')<
  string,
  Validator
>();

export const updateName = createStandardAction('onboarding/update/name')<
  string,
  Validator
>();

export const updateClusterID = createStandardAction(
  'onboarding/update/clusterId'
)<string, Validator>();

export const updateS3BucketName = createStandardAction(
  'onboarding/update/s3BucketName'
)<string, Validator>();

export const updateArn = createStandardAction('onboarding/update/ARN')<
  string,
  Validator
>();

interface CheckPayload {
  item: string;
  value: boolean;
}

export const updateSourceKindCheckList = createStandardAction(
  'onboarding/update/sourceKindCheck'
)<CheckPayload>();

export const checkSourceKindCheckList = createAction(
  'onboarding/checkAll/sourceKindCheck'
);

export const openModal = createAction('onboarding/modal/open');

export const closeModal = createAction('onboarding/modal/close');

export const cancelOnboarding = createAction('onboarding/cancel');

export const {
  request: addSourceRequest,
  success: addSourceSuccess,
  failure: addSourceFailure,
} = createAsyncAction(
  'onboarding/source/add/request',
  'onboarding/source/add/success',
  'onboarding/source/add/failure'
)<void, Provider, AxiosError>();

export function addSource(request: ProviderRequest, sideEffect?: () => void) {
  return (dispatch: Dispatch) => {
    dispatch(addSourceRequest());
    return apiCreateProvider(request)
      .then(response => {
        dispatch(addSourceSuccess(response.data));
        sourcesActions.fetchSources()(dispatch);
        dispatch(
          addNotification({
            title: i18next.t('onboarding.notification.title', {
              name: request.name,
            }),
            description: i18next.t('onboarding.notification.description'),
            dismissable: true,
            variant: 'success',
          })
        );
        if (sideEffect !== null) {
          sideEffect();
        }
      })
      .catch(err => {
        dispatch(addSourceFailure(err));
      });
  };
}
