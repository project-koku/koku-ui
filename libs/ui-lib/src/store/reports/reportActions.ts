import type { Report, ReportPathsType, ReportType } from '@koku-ui/api/reports/report';
import { runReport } from '@koku-ui/api/reports/reportUtils';
import type { AxiosError } from 'axios';
import { createAction } from 'typesafe-actions';

import type { ThunkAction } from '../common';
import { FetchStatus } from '../common';
import type { RootState } from '../rootReducer';
import { getFetchId } from './reportCommon';
import { selectReport, selectReportError, selectReportFetchStatus } from './reportSelectors';

const expirationMS = 30 * 60 * 1000; // 30 minutes

interface ReportActionMeta {
  fetchId: string;
}

export const fetchReportRequest = createAction('report/request')<ReportActionMeta>();
export const fetchReportSuccess = createAction('report/success')<Report, ReportActionMeta>();
export const fetchReportFailure = createAction('report/failure')<AxiosError, ReportActionMeta>();

export function fetchReport(
  reportPathsType: ReportPathsType,
  reportType: ReportType,
  reportQueryString: string
): ThunkAction {
  return (dispatch, getState) => {
    if (!isReportExpired(getState(), reportPathsType, reportType, reportQueryString)) {
      return;
    }

    const meta: ReportActionMeta = {
      fetchId: getFetchId(reportPathsType, reportType, reportQueryString),
    };

    dispatch(fetchReportRequest(meta));
    runReport(reportPathsType, reportType, reportQueryString)
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

function isReportExpired(
  state: RootState,
  reportPathsType: ReportPathsType,
  reportType: ReportType,
  reportQueryString: string
) {
  const report = selectReport(state, reportPathsType, reportType, reportQueryString);
  const fetchError = selectReportError(state, reportPathsType, reportType, reportQueryString);
  const fetchStatus = selectReportFetchStatus(state, reportPathsType, reportType, reportQueryString);
  if (fetchError || fetchStatus === FetchStatus.inProgress) {
    return false;
  }

  if (!report) {
    return true;
  }

  const now = Date.now();
  return now > report.timeRequested + expirationMS;
}
