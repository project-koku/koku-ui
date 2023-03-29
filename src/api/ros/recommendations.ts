import axios from 'axios';

import type { RosData, RosMeta, RosReport } from './ros';
import { RosType } from './ros';

export interface RecommendationValue {
  amount?: number;
  format?: string;
}

export interface RecommendationItem {
  monitoring_start_time?: string;
  monitoring_end_time?: string;
  duration_in_hours?: string;
  confidence_level?: number;
  config: {
    limits: {
      memory?: RecommendationValue;
      cpu?: RecommendationValue;
    };
    requests: {
      memory?: RecommendationValue;
      cpu?: RecommendationValue;
    };
  };
  variation: {
    limits: {
      memory?: RecommendationValue;
      cpu?: RecommendationValue;
    };
    requests: {
      memory?: RecommendationValue;
      cpu?: RecommendationValue;
    };
  };
}

export interface RecommendationItems {
  short_term?: RecommendationItem;
  medium_term?: RecommendationItem;
  long_term?: RecommendationItem;
}

export interface RecommendationReportData extends RosData {
  recommendations?: RecommendationItems;
}

export interface RecommendationReportMeta extends RosMeta {
  // TBD...
}

export interface RecommendationReport extends RosReport {
  meta: RecommendationReportMeta;
  data: RecommendationReportData[];
}

export const RosTypePaths: Partial<Record<RosType, string>> = {
  [RosType.cost]: 'reports/openshift/costs/',
  [RosType.ros]: 'recommendations/openshift/',
};

export function runRosReport(reportType: RosType, query: string) {
  const path = RosTypePaths[reportType];
  return axios.get<RecommendationReport>(query ? `${path}?${query}` : path);
}
