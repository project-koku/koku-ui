import { runExport } from 'api/exports/ocpExport';
import { ReportType } from 'api/reports/report';
import { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { RootState } from 'store/rootReducer';
import { createAsyncAction } from 'typesafe-actions';

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
  reportType: ReportType,
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
