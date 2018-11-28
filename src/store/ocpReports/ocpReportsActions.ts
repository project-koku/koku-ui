import { OcpReport, OcpReportType, runReport } from 'api/ocpReports';
import { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { createStandardAction } from 'typesafe-actions';
import { FetchStatus } from '../common';
import { RootState } from '../rootReducer';
import { getReportId } from './ocpReportsCommon';
import { selectReport, selectReportFetchStatus } from './ocpReportsSelectors';

const expirationMS = 30 * 60 * 1000; // 30 minutes

interface OcpReportActionMeta {
  reportId: string;
}

export const fetchOcpReportRequest = createStandardAction('ocpReports/request')<
  OcpReportActionMeta
>();
export const fetchOcpReportSuccess = createStandardAction('ocpReports/success')<
  OcpReport,
  OcpReportActionMeta
>();
export const fetchOcpReportFailure = createStandardAction('ocpReports/failure')<
  AxiosError,
  OcpReportActionMeta
>();

export function fetchReport(
  reportType: OcpReportType,
  query: string
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    if (!isReportExpired(getState(), reportType, query)) {
      return;
    }

    const meta: OcpReportActionMeta = {
      reportId: getReportId(reportType, query),
    };

    dispatch(fetchOcpReportRequest(meta));
    runReport(reportType, query)
      .then(res => {
        dispatch(fetchOcpReportSuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchOcpReportFailure(err, meta));
      });
  };
}

function isReportExpired(
  state: RootState,
  reportType: OcpReportType,
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
