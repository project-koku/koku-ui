import { OcpOnAwsReportType } from 'api/ocpOnAwsReports';
import { RootState } from 'store/rootReducer';
import { getReportId, ocpOnAwsReportsStateKey } from './ocpOnAwsReportsCommon';

export const selectReportsState = (state: RootState) =>
  state[ocpOnAwsReportsStateKey];

export const selectReport = (
  state: RootState,
  reportType: OcpOnAwsReportType,
  query: string
) => selectReportsState(state).byId.get(getReportId(reportType, query));

export const selectReportFetchStatus = (
  state: RootState,
  reportType: OcpOnAwsReportType,
  query: string
) => selectReportsState(state).fetchStatus.get(getReportId(reportType, query));

export const selectReportError = (
  state: RootState,
  reportType: OcpOnAwsReportType,
  query: string
) => selectReportsState(state).errors.get(getReportId(reportType, query));
