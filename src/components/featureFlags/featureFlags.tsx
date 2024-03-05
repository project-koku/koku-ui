import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useUnleashClient } from '@unleash/proxy-client-react';
import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { featureFlagsActions } from 'store/featureFlags';

// eslint-disable-next-line no-shadow
export const enum FeatureToggle {
  clusterInfo = 'cost-management.ui.cluster.info', // https://issues.redhat.com/browse/COST-4559
  exports = 'cost-management.ui.exports', // Async exports https://issues.redhat.com/browse/COST-2223
  finsights = 'cost-management.ui.finsights', // RHEL support for FINsights https://issues.redhat.com/browse/COST-3306
  ibm = 'cost-management.ui.ibm', // IBM https://issues.redhat.com/browse/COST-935
  ros = 'cost-management.ui.ros', // ROS support https://issues.redhat.com/browse/COST-3477
  rosBeta = 'cost-management.ui.ros-beta', // ROS support https://issues.redhat.com/browse/COST-3477
  settingsPlatform = 'cost-management.ui.settings.platform', // Platform projects https://issues.redhat.com/browse/COST-3818
  tagMapping = 'cost-management.ui.tag.mapping', // https://issues.redhat.com/browse/COST-3824
}

const useIsFlagEnabled = (flag: FeatureToggle) => {
  const client = useUnleashClient();
  return client.isEnabled(flag);
};

export const useIsClusterInfoFeatureEnabled = () => {
  return useIsFlagEnabled(FeatureToggle.clusterInfo);
};

export const useIsExportsFeatureEnabled = () => {
  return useIsFlagEnabled(FeatureToggle.exports);
};

export const useIsFinsightsFeatureEnabled = () => {
  return useIsFlagEnabled(FeatureToggle.finsights);
};

export const useIsIbmFeatureEnabled = () => {
  return useIsFlagEnabled(FeatureToggle.ibm);
};

export const useIsRosFeatureEnabled = () => {
  const { isBeta } = useChrome();
  const isRosFeatureEnabled = useIsFlagEnabled(FeatureToggle.ros);
  const isRosFeatureBetaEnabled = useIsFlagEnabled(FeatureToggle.rosBeta) && isBeta(); // Enabled for prod-beta
  return isRosFeatureEnabled || isRosFeatureBetaEnabled;
};

export const useIsSettingsPlatformFeatureEnabled = () => {
  return useIsFlagEnabled(FeatureToggle.settingsPlatform);
};

export const useIsTagMappingFeatureEnabled = () => {
  return useIsFlagEnabled(FeatureToggle.tagMapping);
};

// The FeatureFlags component saves feature flags in store for places where Unleash hooks not available
export const useFeatureFlags = () => {
  const dispatch = useDispatch();

  const isClusterInfoFeatureEnabled = useIsClusterInfoFeatureEnabled();
  const isExportsFeatureEnabled = useIsExportsFeatureEnabled();
  const isFinsightsFeatureEnabled = useIsFinsightsFeatureEnabled();
  const isIbmFeatureEnabled = useIsIbmFeatureEnabled();
  const isRosFeatureEnabled = useIsRosFeatureEnabled();
  const isSettingsPlatformFeatureEnabled = useIsSettingsPlatformFeatureEnabled();
  const isTagMappingFeatureEnabled = useIsTagMappingFeatureEnabled();

  useLayoutEffect(() => {
    // Workaround for code that doesn't use hooks
    dispatch(
      featureFlagsActions.setFeatureFlags({
        isClusterInfoFeatureEnabled,
        isExportsFeatureEnabled,
        isFinsightsFeatureEnabled,
        isIbmFeatureEnabled,
        isRosFeatureEnabled,
        isSettingsPlatformFeatureEnabled,
        isTagMappingFeatureEnabled,
      })
    );
  });
};

export default useFeatureFlags;
