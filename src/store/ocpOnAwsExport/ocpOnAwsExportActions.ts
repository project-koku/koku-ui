import { runExport } from 'api/ocpOnAwsExport';
import { OcpOnAwsReportType } from 'api/ocpOnAwsReports';
import { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { RootState } from 'store/rootReducer';
import { createAsyncAction } from 'typesafe-actions';

export const {
  request: fetchOcpOnAwsExportRequest,
  success: fetchOcpOnAwsExportSuccess,
  failure: fetchOcpOnAwsExportFailure,
} = createAsyncAction(
  'ocpOnAwsExport/request',
  'ocpOnAwsExport/success',
  'ocpOnAwsExport/failure'
)<void, string, AxiosError>();

export function exportReport(
  reportType: OcpOnAwsReportType,
  query: string
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    dispatch(fetchOcpOnAwsExportRequest());
    runExport(reportType, query)
      .then(res => {
        dispatch(fetchOcpOnAwsExportSuccess(res.data));
      })
      .catch(err => {
        dispatch(fetchOcpOnAwsExportFailure(err));
      });
  };
}
