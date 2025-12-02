import type { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';

import type { RootState } from '../rootReducer';
import { getFetchId, reportStateKey } from './reportCommon';

export const selectReportState = (state: RootState) => state[reportStateKey];

export const selectReport = (
  state: RootState,
  reportPathsType: ReportPathsType,
  reportType: ReportType,
  reportQueryString: string
) => selectReportState(state).byId.get(getFetchId(reportPathsType, reportType, reportQueryString));

export const selectReportFetchStatus = (
  state: RootState,
  reportPathsType: ReportPathsType,
  reportType: ReportType,
  reportQueryString: string
) => selectReportState(state)?.fetchStatus.get(getFetchId(reportPathsType, reportType, reportQueryString));

export const selectReportError = (
  state: RootState,
  reportPathsType: ReportPathsType,
  reportType: ReportType,
  reportQueryString: string
) => selectReportState(state)?.errors.get(getFetchId(reportPathsType, reportType, reportQueryString));
