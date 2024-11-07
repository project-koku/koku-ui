import { createAction } from 'typesafe-actions';

export interface FeatureToggleActionMeta {
  isAccountInfoDetailsToggleEnabled?: boolean;
  isAccountInfoEmptyStateToggleEnabled?: boolean;
  isAwsEc2InstancesToggleEnabled?: boolean;
  isChartSkeletonToggleEnabled?: boolean;
  isDebugToggleEnabled?: boolean;
  isDetailsDateRangeToggleEnabled?: boolean;
  isExportsToggleEnabled?: boolean;
  isFinsightsToggleEnabled?: boolean;
  isIbmToggleEnabled?: boolean;
  isOcpCloudGroupBysToggleEnabled?: boolean;
  isProviderEmptyStateToggleEnabled?: boolean;
}

export const setFeatureToggle = createAction('feature/init_feature_toggle')<FeatureToggleActionMeta>();
export const resetState = createAction('feature/reset_state')();
