import { axiosInstance } from 'api';

import type { RosData, RosMeta, RosReport } from './ros';
import { RosType } from './ros';

export interface Notification {
  code?: number;
  message?: string;
  type?: string;
}

export interface RecommendationValue {
  amount?: number;
  format?: string;
}

export interface RecommendationValues {
  limits: {
    cpu?: RecommendationValue;
    memory?: RecommendationValue;
  };
  requests: {
    cpu?: RecommendationValue;
    memory?: RecommendationValue;
  };
}

export interface RecommendationEngine {
  config: RecommendationValues;
  notifications?: {
    [key: string]: Notification;
  };
  pods_count?: number;
  variation: RecommendationValues;
}

export interface UsageValue {
  min?: number;
  q1?: number;
  median?: number;
  q3?: number;
  max?: number;
  format?: string;
}

export interface RecommendationTerm {
  duration_in_hours?: number;
  monitoring_start_time?: string;
  notifications?: {
    [key: string]: Notification;
  };
  plots?: {
    datapoints?: number;
    plots_data?: {
      [date: string]: {
        cpuUsage?: UsageValue;
        memoryUsage?: UsageValue;
      };
    };
  };
  recommendation_engines?: {
    cost: RecommendationEngine;
    performance: RecommendationEngine;
  };
}

export interface RecommendationTerms {
  long_term?: RecommendationTerm;
  medium_term?: RecommendationTerm;
  short_term?: RecommendationTerm;
}

export interface Recommendations {
  current?: RecommendationValues;
  monitoring_end_time?: string;
  notifications?: {
    [key: string]: Notification;
  };
  recommendation_terms?: RecommendationTerms;
}

export interface RecommendationReportData extends RosData {
  recommendations?: Recommendations;
}

export interface RecommendationReport extends RosReport {
  meta: RosMeta;
  data: RecommendationReportData[];
}

export const RosTypePaths: Partial<Record<RosType, string>> = {
  [RosType.ros]: 'recommendations/openshift',
};

// This fetches a recommendation by ID
export function runRosReport(reportType: RosType, query: string) {
  const path = RosTypePaths[reportType];
  const queryString = query ? `/${query}` : '';
  return axiosInstance.get<RecommendationReport>(`${path}${queryString}`);
}

// This fetches a recommendations list
export function runRosReports(reportType: RosType, query: string) {
  const path = RosTypePaths[reportType];
  const queryString = query ? `?${query}` : '';
  return axiosInstance.get<RecommendationReport>(`${path}${queryString}`);
}
