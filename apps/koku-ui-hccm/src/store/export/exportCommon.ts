import type { ExportPathsType, ExportType } from 'api/export/export';

export const exportStateKey = 'export';

export function getFetchId(exportPathsType: ExportPathsType, exportType: ExportType, exportQueryString: string) {
  return `${exportPathsType}-${exportType}--${exportQueryString}`;
}
