import { runExport } from 'api/ocpExport';
import { OcpReportType } from 'api/ocpReports';
import { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { createAsyncAction } from 'typesafe-actions';
import { RootState } from '../rootReducer';

export const {
  request: fetchOcpExportRequest,
  success: fetchOcpExportSuccess,
  failure: fetchOcpExportFailure,
} = createAsyncAction(
  'ocpExport/request',
  'ocpExport/success',
  'ocpExport/failure'
)<void, string, AxiosError>();

export function exportReport(
  reportType: OcpReportType,
  query: string
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    dispatch(fetchOcpExportRequest());
    runExport(reportType, query)
      .then(res => {
        dispatch(fetchOcpExportSuccess(res.data));
      })
      .catch(err => {
        dispatch(fetchOcpExportFailure(err));
      });
  };
}
