import { runExport } from 'api/exports/exportUtils';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { RootState } from 'store/rootReducer';
import { createAsyncAction } from 'typesafe-actions';

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
  reportPathsType: ReportPathsType,
  reportType: ReportType,
  query: string
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    dispatch(fetchExportRequest());
    runExport(reportPathsType, reportType, query)
      .then(res => {
        dispatch(fetchExportSuccess(res.data));
      })
      .catch(err => {
        dispatch(fetchExportFailure(err));
      });
  };
}
