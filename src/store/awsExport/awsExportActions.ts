import { runExport } from 'api/awsExport';
import { AwsReportType } from 'api/awsReports';
import { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { createAsyncAction } from 'typesafe-actions';
import { RootState } from '../rootReducer';

export const {
  request: fetchAwsExportRequest,
  success: fetchAwsExportSuccess,
  failure: fetchAwsExportFailure,
} = createAsyncAction(
  'awsExport/request',
  'awsExport/success',
  'awsExport/failure'
)<void, string, AxiosError>();

export function exportReport(
  reportType: AwsReportType,
  query: string
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    dispatch(fetchAwsExportRequest());
    runExport(reportType, query)
      .then(res => {
        dispatch(fetchAwsExportSuccess(res.data));
      })
      .catch(err => {
        dispatch(fetchAwsExportFailure(err));
      });
  };
}
