import { runExport } from 'api/export';
import { ReportType } from 'api/reports';
import { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { createAsyncAction } from 'typesafe-actions';
import { RootState } from '../rootReducer';

export const {
  request: fetchExportRequest,
  success: fetchExportSuccess,
  failure: fetchExportFailure,
} = createAsyncAction('export/request', 'export/success', 'export/failure')<
  void,
  string,
  AxiosError
>();

export function exportReport(
  reportType: ReportType,
  query: string
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    dispatch(fetchExportRequest());
    runExport(reportType, query)
      .then(res => {
        dispatch(fetchExportSuccess(res.data));
      })
      .catch(err => {
        dispatch(fetchExportFailure(err));
      });
  };
}
