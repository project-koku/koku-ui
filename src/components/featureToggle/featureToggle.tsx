import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useUnleashClient } from '@unleash/proxy-client-react';
import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FeatureToggleActions } from 'store/featureToggle';

// eslint-disable-next-line no-shadow
export const enum FeatureToggle {
  awsEc2Instances = 'cost-management.ui.aws-ec2-instances', // https://issues.redhat.com/browse/COST-4855
  clusterInfo = 'cost-management.ui.cluster.info', // https://issues.redhat.com/browse/COST-4559
  debug = 'cost-management.ui.debug',
  exports = 'cost-management.ui.exports', // Async exports https://issues.redhat.com/browse/COST-2223
  finsights = 'cost-management.ui.finsights', // RHEL support for FINsights https://issues.redhat.com/browse/COST-3306
  ibm = 'cost-management.ui.ibm', // IBM https://issues.redhat.com/browse/COST-935
  ocpCloudNetworking = 'cost-management.ui.ocp-cloud-networking', // https://issues.redhat.com/browse/COST-4781
  ocpProjectStorage = 'cost-management.ui.ocp-project-storage', // https://issues.redhat.com/browse/COST-4856
  ros = 'cost-management.ui.ros', // ROS support https://issues.redhat.com/browse/COST-3477
  rosBeta = 'cost-management.ui.ros-beta', // ROS support https://issues.redhat.com/browse/COST-3477
  settingsPlatform = 'cost-management.ui.settings.platform', // Platform projects https://issues.redhat.com/browse/COST-3818
  tagMapping = 'cost-management.ui.tag.mapping', // https://issues.redhat.com/browse/COST-3824
}

const useIsToggleEnabled = (toggle: FeatureToggle) => {
  const client = useUnleashClient();
  return client.isEnabled(toggle);
};

export const useIsAwsEc2InstancesToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.awsEc2Instances);
};

export const useIsDebugToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.debug);
};

export const useIsClusterInfoToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.clusterInfo);
};

export const useIsExportsToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.exports);
};

export const useIsFinsightsToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.finsights);
};

export const useIsIbmToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.ibm);
};

export const useIsOcpCloudNetworkingToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.ocpCloudNetworking);
};

export const useIsOcpProjectStorageToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.ocpProjectStorage);
};

export const useIsRosToggleEnabled = () => {
  const { isBeta } = useChrome();
  const isRosToggleEnabled = useIsToggleEnabled(FeatureToggle.ros);
  const isRosFeatureBetaEnabled = useIsToggleEnabled(FeatureToggle.rosBeta) && isBeta(); // Enabled for prod-beta
  return isRosToggleEnabled || isRosFeatureBetaEnabled;
};

export const useIsSettingsPlatformToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.settingsPlatform);
};

export const useIsTagMappingToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.tagMapping);
};

// The FeatureToggle component saves feature toggles in store for places where Unleash hooks not available
export const useFeatureToggle = () => {
  const dispatch = useDispatch();
  const { auth } = useChrome();

  const isAwsEc2InstancesToggleEnabled = useIsAwsEc2InstancesToggleEnabled();
  const isClusterInfoToggleEnabled = useIsClusterInfoToggleEnabled();
  const isDebugToggleEnabled = useIsDebugToggleEnabled();
  const isExportsToggleEnabled = useIsExportsToggleEnabled();
  const isFinsightsToggleEnabled = useIsFinsightsToggleEnabled();
  const isIbmToggleEnabled = useIsIbmToggleEnabled();
  const isOcpCloudNetworkingToggleEnabled = useIsOcpCloudNetworkingToggleEnabled();
  const isOcpProjectStorageToggleEnabled = useIsOcpProjectStorageToggleEnabled();
  const isRosToggleEnabled = useIsRosToggleEnabled();
  const isSettingsPlatformToggleEnabled = useIsSettingsPlatformToggleEnabled();
  const isTagMappingToggleEnabled = useIsTagMappingToggleEnabled();

  const fetchUser = callback => {
    auth.getUser().then(user => {
      callback((user as any).identity);
    });
  };

  useLayoutEffect(() => {
    // Workaround for code that doesn't use hooks
    dispatch(
      FeatureToggleActions.setFeatureToggle({
        isAwsEc2InstancesToggleEnabled,
        isClusterInfoToggleEnabled,
        isDebugToggleEnabled,
        isExportsToggleEnabled,
        isFinsightsToggleEnabled,
        isIbmToggleEnabled,
        isOcpCloudNetworkingToggleEnabled,
        isOcpProjectStorageToggleEnabled,
        isRosToggleEnabled,
        isSettingsPlatformToggleEnabled,
        isTagMappingToggleEnabled,
      })
    );
    if (isDebugToggleEnabled) {
      // eslint-disable-next-line no-console
      fetchUser(identity => console.log('User identity:', identity));
    }
  }, [
    isAwsEc2InstancesToggleEnabled,
    isClusterInfoToggleEnabled,
    isDebugToggleEnabled,
    isExportsToggleEnabled,
    isFinsightsToggleEnabled,
    isIbmToggleEnabled,
    isOcpCloudNetworkingToggleEnabled,
    isOcpProjectStorageToggleEnabled,
    isRosToggleEnabled,
    isSettingsPlatformToggleEnabled,
    isTagMappingToggleEnabled,
  ]);
};

export default useFeatureToggle;
