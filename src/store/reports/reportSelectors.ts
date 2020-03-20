import { ReportType } from 'api/reports/report';
import { RootState } from 'store/rootReducer';
import { getReportId, reportStateKey } from './reportCommon';

export const selectReportState = (state: RootState) => state[reportStateKey];

export const selectReport = (
  state: RootState,
  reportType: ReportType,
  query: string
) => selectReportState(state).byId.get(getReportId(reportType, query));

export const selectReportFetchStatus = (
  state: RootState,
  reportType: ReportType,
  query: string
) => selectReportState(state).fetchStatus.get(getReportId(reportType, query));

export const selectReportError = (
  state: RootState,
  reportType: ReportType,
  query: string
) => selectReportState(state).errors.get(getReportId(reportType, query));
