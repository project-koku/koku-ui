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

// The FeatureFlags component saves feature flags in store for places where Unleash hooks not available
const useFeatureFlags = () => {
  const client = useUnleashClient();
  const dispatch = useDispatch();
  const { isBeta } = useChrome();

  useLayoutEffect(() => {
    // Workaround for code that doesn't use hooks
    const flags = {
      isClusterInfoFeatureEnabled: client.isEnabled(FeatureToggle.clusterInfo),
      isExportsFeatureEnabled: client.isEnabled(FeatureToggle.exports),
      isFinsightsFeatureEnabled: client.isEnabled(FeatureToggle.finsights),
      isIbmFeatureEnabled: client.isEnabled(FeatureToggle.ibm),
      isRosFeatureEnabled: client.isEnabled(FeatureToggle.ros) || (client.isEnabled(FeatureToggle.rosBeta) && isBeta()), // Need to check beta in prod
      isSettingsPlatformFeatureEnabled: client.isEnabled(FeatureToggle.settingsPlatform),
      isTagMappingFeatureEnabled: client.isEnabled(FeatureToggle.tagMapping),
    };
    dispatch(featureFlagsActions.setFeatureFlags(flags));
  });
};

export default useFeatureFlags;
