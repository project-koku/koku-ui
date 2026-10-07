import type { ExportPathsType, ExportType } from 'api/export/export';
import type { RootState } from 'store/rootReducer';

import { exportStateKey, getFetchId } from './exportCommon';

export const selectExportState = (state: RootState) => state[exportStateKey];

export const selectExport = (
  state: RootState,
  exportPathsType: ExportPathsType,
  exportType: ExportType,
  exportQueryString: string
) => selectExportState(state).byId.get(getFetchId(exportPathsType, exportType, exportQueryString));

export const selectExportError = (
  state: RootState,
  exportPathsType: ExportPathsType,
  exportType: ExportType,
  exportQueryString: string
) => selectExportState(state).errors.get(getFetchId(exportPathsType, exportType, exportQueryString));

export const selectExportFetchNotification = (
  state: RootState,
  exportPathsType: ExportPathsType,
  exportType: ExportType,
  exportQueryString: string
) => selectExportState(state).notification?.get(getFetchId(exportPathsType, exportType, exportQueryString));

export const selectExportFetchStatus = (
  state: RootState,
  exportPathsType: ExportPathsType,
  exportType: ExportType,
  exportQueryString: string
) => selectExportState(state).fetchStatus.get(getFetchId(exportPathsType, exportType, exportQueryString));
