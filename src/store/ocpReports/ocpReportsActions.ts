import { OcpReport, OcpReportType, runReport } from 'api/ocpReports';
import { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { FetchStatus } from 'store/common';
import { RootState } from 'store/rootReducer';
import { createStandardAction } from 'typesafe-actions';
import { dropCurrentMonthData } from 'utils/dropCurrentMonthData';
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
        // Todo: For testing purposes
        // dispatch(fetchOcpReportSuccess(test as any, meta));
        const repsonseData = dropCurrentMonthData(res, query);
        dispatch(fetchOcpReportSuccess(repsonseData, meta));
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
