import { runExport } from 'api/exports/awsExport';
import { AwsReportType } from 'api/reports/awsReports';
import { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { RootState } from 'store/rootReducer';
import { createAsyncAction } from 'typesafe-actions';

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
