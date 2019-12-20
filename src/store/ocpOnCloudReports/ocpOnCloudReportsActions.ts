import {
  OcpOnCloudReport,
  OcpOnCloudReportType,
  runReport,
} from 'api/ocpOnCloudReports';
import { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { FetchStatus } from 'store/common';
import { RootState } from 'store/rootReducer';
import { createStandardAction } from 'typesafe-actions';
import { dropCurrentMonthData } from 'utils/dropCurrentMonthData';
import { getReportId } from './ocpOnCloudReportsCommon';
import {
  selectReport,
  selectReportFetchStatus,
} from './ocpOnCloudReportsSelectors';

const expirationMS = 30 * 60 * 1000; // 30 minutes

interface OcpOnCloudReportActionMeta {
  reportId: string;
}

export const fetchOcpOnCloudReportRequest = createStandardAction(
  'ocpOnCloudReports/request'
)<OcpOnCloudReportActionMeta>();
export const fetchOcpOnCloudReportSuccess = createStandardAction(
  'ocpOnCloudReports/success'
)<OcpOnCloudReport, OcpOnCloudReportActionMeta>();
export const fetchOcpOnCloudReportFailure = createStandardAction(
  'ocpOnCloudReports/failure'
)<AxiosError, OcpOnCloudReportActionMeta>();

export function fetchReport(
  reportType: OcpOnCloudReportType,
  query: string
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    if (!isReportExpired(getState(), reportType, query)) {
      return;
    }

    const meta: OcpOnCloudReportActionMeta = {
      reportId: getReportId(reportType, query),
    };

    dispatch(fetchOcpOnCloudReportRequest(meta));
    runReport(reportType, query)
      .then(res => {
        const repsonseData = dropCurrentMonthData(res, query);
        dispatch(fetchOcpOnCloudReportSuccess(repsonseData, meta));
      })
      .catch(err => {
        dispatch(fetchOcpOnCloudReportFailure(err, meta));
      });
  };
}

function isReportExpired(
  state: RootState,
  reportType: OcpOnCloudReportType,
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
