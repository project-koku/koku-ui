import { runExport } from 'api/exports/ocpCloudExport';
import { OcpCloudReportType } from 'api/reports/ocpCloudReports';
import { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { RootState } from 'store/rootReducer';
import { createAsyncAction } from 'typesafe-actions';

export const {
  request: fetchOcpCloudExportRequest,
  success: fetchOcpCloudExportSuccess,
  failure: fetchOcpCloudExportFailure,
} = createAsyncAction(
  'ocpCloudExport/request',
  'ocpCloudExport/success',
  'ocpCloudExport/failure'
)<void, string, AxiosError>();

export function exportReport(
  reportType: OcpCloudReportType,
  query: string
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    dispatch(fetchOcpCloudExportRequest());
    runExport(reportType, query)
      .then(res => {
        dispatch(fetchOcpCloudExportSuccess(res.data));
      })
      .catch(err => {
        dispatch(fetchOcpCloudExportFailure(err));
      });
  };
}
