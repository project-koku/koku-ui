import {
  OcpOnAwsReport,
  OcpOnAwsReportType,
  runReport,
} from 'api/ocpOnAwsReports';
import { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { FetchStatus } from 'store/common';
import { RootState } from 'store/rootReducer';
import { createStandardAction } from 'typesafe-actions';
import { dropCurrentMonthData } from 'utils/dropCurrentMonthData';
import { getReportId } from './ocpOnAwsReportsCommon';
import {
  selectReport,
  selectReportFetchStatus,
} from './ocpOnAwsReportsSelectors';

const expirationMS = 30 * 60 * 1000; // 30 minutes

interface OcpOnAwsReportActionMeta {
  reportId: string;
}

export const fetchOcpOnAwsReportRequest = createStandardAction(
  'ocpOnAwsReports/request'
)<OcpOnAwsReportActionMeta>();
export const fetchOcpOnAwsReportSuccess = createStandardAction(
  'ocpOnAwsReports/success'
)<OcpOnAwsReport, OcpOnAwsReportActionMeta>();
export const fetchOcpOnAwsReportFailure = createStandardAction(
  'ocpOnAwsReports/failure'
)<AxiosError, OcpOnAwsReportActionMeta>();

export function fetchReport(
  reportType: OcpOnAwsReportType,
  query: string
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    if (!isReportExpired(getState(), reportType, query)) {
      return;
    }

    const meta: OcpOnAwsReportActionMeta = {
      reportId: getReportId(reportType, query),
    };

    dispatch(fetchOcpOnAwsReportRequest(meta));
    runReport(reportType, query)
      .then(res => {
        const repsonseData = dropCurrentMonthData(res, query);
        dispatch(fetchOcpOnAwsReportSuccess(repsonseData, meta));
      })
      .catch(err => {
        dispatch(fetchOcpOnAwsReportFailure(err, meta));
      });
  };
}

function isReportExpired(
  state: RootState,
  reportType: OcpOnAwsReportType,
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
