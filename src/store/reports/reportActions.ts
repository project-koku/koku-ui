import type { Report } from 'api/reports/report';
import type { ReportPathsType, ReportType } from 'api/reports/report';
import { runReport } from 'api/reports/reportUtils';
import type { AxiosError } from 'axios';
import type { ThunkAction } from 'store/common';
import { FetchStatus } from 'store/common';
import type { RootState } from 'store/rootReducer';
import { createAction } from 'typesafe-actions';

import { getReportId } from './reportCommon';
import { selectReport, selectReportFetchStatus } from './reportSelectors';

const expirationMS = 30 * 60 * 1000; // 30 minutes

interface ReportActionMeta {
  reportId: string;
}

export const fetchReportRequest = createAction('report/request')<ReportActionMeta>();
export const fetchReportSuccess = createAction('report/success')<Report, ReportActionMeta>();
export const fetchReportFailure = createAction('report/failure')<AxiosError, ReportActionMeta>();

export function fetchReport(reportPathsType: ReportPathsType, reportType: ReportType, query: string): ThunkAction {
  return (dispatch, getState) => {
    if (!isReportExpired(getState(), reportPathsType, reportType, query)) {
      return;
    }

    const meta: ReportActionMeta = {
      reportId: getReportId(reportPathsType, reportType, query),
    };

    dispatch(fetchReportRequest(meta));
    runReport(reportPathsType, reportType, query)
      .then(res => {
        // See https://github.com/project-koku/koku-ui/pull/580
        // const repsonseData = dropCurrentMonthData(res, query);
        dispatch(fetchReportSuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchReportFailure(err, meta));
      });
  };
}

function isReportExpired(state: RootState, reportPathsType: ReportPathsType, reportType: ReportType, query: string) {
  const report = selectReport(state, reportPathsType, reportType, query);
  const fetchStatus = selectReportFetchStatus(state, reportPathsType, reportType, query);
  if (fetchStatus === FetchStatus.inProgress) {
    return false;
  }

  if (!report) {
    return true;
  }

  const now = Date.now();
  return now > report.timeRequested + expirationMS;
}
