import axios from 'axios';

import type { RosData, RosMeta, RosReport } from './ros';
import { RosType } from './ros';

export interface RecommendationValue {
  amount?: number;
  format?: string;
}

export interface RecommendationItem {
  // confidence_level?: number;
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
  duration_in_hours?: string;
  monitoring_start_time?: string;
  monitoring_end_time?: string;
  notifications?: [
    {
      type?: string;
      message?: string;
    },
  ];
}

export interface RecommendationItems {
  short_term?: RecommendationItem;
  medium_term?: RecommendationItem;
  long_term?: RecommendationItem;
}

export interface RecommendationReportData extends RosData {
  recommendations?: {
    duration_based?: RecommendationItems;
  };
}

export interface RecommendationReportMeta extends RosMeta {
  // TBD...
}

export interface RecommendationReport extends RosReport {
  meta: RecommendationReportMeta;
  data: RecommendationReportData[];
}

export const RosTypePaths: Partial<Record<RosType, string>> = {
  [RosType.ros]: 'recommendations/openshift',
};

// This fetches a recommendation by ID
export function runRosReport(reportType: RosType, query: string) {
  const path = RosTypePaths[reportType];
  const queryString = query ? `/${query}` : '';
  return axios.get<RecommendationReport>(`${path}${queryString}`);
}

// This fetches a recommendations list
export function runRosReports(reportType: RosType, query: string) {
  const path = RosTypePaths[reportType];
  const queryString = query ? `?${query}` : '';
  return axios.get<RecommendationReport>(`${path}${queryString}`);
}
