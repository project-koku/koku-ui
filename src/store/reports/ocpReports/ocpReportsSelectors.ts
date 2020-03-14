import { OcpReportType } from 'api/reports/ocpReports';
import { RootState } from 'store/rootReducer';
import { getReportId, ocpReportsStateKey } from './ocpReportsCommon';

export const selectReportsState = (state: RootState) =>
  state[ocpReportsStateKey];

export const selectReport = (
  state: RootState,
  reportType: OcpReportType,
  query: string
) => selectReportsState(state).byId.get(getReportId(reportType, query));

export const selectReportFetchStatus = (
  state: RootState,
  reportType: OcpReportType,
  query: string
) => selectReportsState(state).fetchStatus.get(getReportId(reportType, query));

export const selectReportError = (
  state: RootState,
  reportType: OcpReportType,
  query: string
) => selectReportsState(state).errors.get(getReportId(reportType, query));
