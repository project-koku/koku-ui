import { runExport } from 'api/ocpOnCloudExport';
import { OcpOnCloudReportType } from 'api/ocpOnCloudReports';
import { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { RootState } from 'store/rootReducer';
import { createAsyncAction } from 'typesafe-actions';

export const {
  request: fetchOcpOnCloudExportRequest,
  success: fetchOcpOnCloudExportSuccess,
  failure: fetchOcpOnCloudExportFailure,
} = createAsyncAction(
  'ocpOnCloudExport/request',
  'ocpOnCloudExport/success',
  'ocpOnCloudExport/failure'
)<void, string, AxiosError>();

export function exportReport(
  reportType: OcpOnCloudReportType,
  query: string
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    dispatch(fetchOcpOnCloudExportRequest());
    runExport(reportType, query)
      .then(res => {
        dispatch(fetchOcpOnCloudExportSuccess(res.data));
      })
      .catch(err => {
        dispatch(fetchOcpOnCloudExportFailure(err));
      });
  };
}
