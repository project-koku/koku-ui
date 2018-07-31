import { Report, ReportType, runReport } from 'api/reports';
import { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { createStandardAction } from 'typesafe-actions';
import { FetchStatus } from '../common';
import { RootState } from '../rootReducer';
import { getReportId } from './reportsCommon';
import { selectReport, selectReportFetchStatus } from './reportsSelectors';

const expirationMS = 30 * 60 * 1000; // 30 minutes

interface ReportActionMeta {
  reportId: string;
}

export const fetchReportRequest = createStandardAction('reports/request')<
  ReportActionMeta
>();
export const fetchReportSuccess = createStandardAction('reports/success')<
  Report,
  ReportActionMeta
>();
export const fetchReportFailure = createStandardAction('reports/failure')<
  AxiosError,
  ReportActionMeta
>();

export function fetchReport(
  reportType: ReportType,
  query: string
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    if (!isReportExpired(getState(), reportType, query)) {
      return;
    }

    const meta: ReportActionMeta = {
      reportId: getReportId(reportType, query),
    };

    dispatch(fetchReportRequest(meta));
    runReport(reportType, query)
      .then(res => {
        dispatch(fetchReportSuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchReportFailure(err, meta));
      });
  };
}

function isReportExpired(
  state: RootState,
  reportType: ReportType,
  query: string
) {
  const report = selectReport(state, reportType, query);
  const fetchStatus = selectReportFetchStatus(state, reportType, query);
  if (fetchStatus === FetchStatus.inProgress) {
    return false;
  }

  if (!report) {
    return true;
  }

  const now = Date.now();
  return now > report.timeRequested + expirationMS;
}
