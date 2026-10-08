import type { ReportPathsType, ReportType } from 'api/reports/report';
import type { SettingsType } from 'api/settings';

export interface Export {
  data: string;
}

/** Paths discriminator for export routing (reports + settings exports). */
export type ExportPathsType = ReportPathsType | SettingsType.currency;

/** Type key passed through to the provider-specific runExport. */
export type ExportType = ReportType | SettingsType;
