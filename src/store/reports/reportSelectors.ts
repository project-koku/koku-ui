import { ReportPathsType, ReportType } from 'api/reports/report';
import type { RootState } from 'store/rootReducer';

import { getReportId, reportStateKey } from './reportCommon';

export const selectReportState = (state: RootState) => state[reportStateKey];

export const selectReport = (
  state: RootState,
  reportPathsType: ReportPathsType,
  reportType: ReportType,
  query: string
) => selectReportState(state).byId.get(getReportId(reportPathsType, reportType, query));

export const selectReportFetchStatus = (
  state: RootState,
  reportPathsType: ReportPathsType,
  reportType: ReportType,
  query: string
) => selectReportState(state).fetchStatus.get(getReportId(reportPathsType, reportType, query));

export const selectReportError = (
  state: RootState,
  reportPathsType: ReportPathsType,
  reportType: ReportType,
  query: string
) => selectReportState(state).errors.get(getReportId(reportPathsType, reportType, query));
