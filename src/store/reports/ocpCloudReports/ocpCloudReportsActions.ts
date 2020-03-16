import { OcpCloudReport, runReport } from 'api/reports/ocpCloudReports';
import { ReportType } from 'api/reports/report';
import { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { FetchStatus } from 'store/common';
import { RootState } from 'store/rootReducer';
import { createStandardAction } from 'typesafe-actions';
import { getReportId } from './ocpCloudReportsCommon';
import {
  selectReport,
  selectReportFetchStatus,
} from './ocpCloudReportsSelectors';

const expirationMS = 30 * 60 * 1000; // 30 minutes

interface OcpCloudReportActionMeta {
  reportId: string;
}

export const fetchOcpCloudReportRequest = createStandardAction(
  'ocpCloudReports/request'
)<OcpCloudReportActionMeta>();
export const fetchOcpCloudReportSuccess = createStandardAction(
  'ocpCloudReports/success'
)<OcpCloudReport, OcpCloudReportActionMeta>();
export const fetchOcpCloudReportFailure = createStandardAction(
  'ocpCloudReports/failure'
)<AxiosError, OcpCloudReportActionMeta>();

export function fetchReport(
  reportType: ReportType,
  query: string
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    if (!isReportExpired(getState(), reportType, query)) {
      return;
    }

    const meta: OcpCloudReportActionMeta = {
      reportId: getReportId(reportType, query),
    };

    dispatch(fetchOcpCloudReportRequest(meta));
    runReport(reportType, query)
      .then(res => {
        // See https://github.com/project-koku/koku-ui/pull/580
        // const repsonseData = dropCurrentMonthData(res, query);
        dispatch(fetchOcpCloudReportSuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchOcpCloudReportFailure(err, meta));
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
