import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useUnleashClient } from '@unleash/proxy-client-react';
import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FeatureToggleActions } from 'store/featureToggle';

export const enum FeatureToggle {
  accountInfoEmptyState = 'cost-management.ui.account-info-empty-state', // https://issues.redhat.com/browse/COST-5335
  awsEc2Instances = 'cost-management.ui.aws-ec2-instances', // https://issues.redhat.com/browse/COST-4855
  debug = 'cost-management.ui.debug',
  exports = 'cost-management.ui.exports', // Async exports https://issues.redhat.com/browse/COST-2223
  finsights = 'cost-management.ui.finsights', // RHEL support for FINsights https://issues.redhat.com/browse/COST-3306
  ibm = 'cost-management.ui.ibm', // IBM https://issues.redhat.com/browse/COST-935
  ocpCloudNetworking = 'cost-management.ui.ocp-cloud-networking', // https://issues.redhat.com/browse/COST-4781
  ocpProjectStorage = 'cost-management.ui.ocp-project-storage', // https://issues.redhat.com/browse/COST-4856
  ros = 'cost-management.ui.ros', // ROS support https://issues.redhat.com/browse/COST-3477
}

const useIsToggleEnabled = (toggle: FeatureToggle) => {
  const client = useUnleashClient();
  return client.isEnabled(toggle);
};

export const useIsAccountInfoEmptyStateToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.accountInfoEmptyState);
};

export const useIsAwsEc2InstancesToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.awsEc2Instances);
};

export const useIsDebugToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.debug);
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
  return useIsToggleEnabled(FeatureToggle.ros);
};

// The FeatureToggle component saves feature toggles in store for places where Unleash hooks not available
export const useFeatureToggle = () => {
  const dispatch = useDispatch();
  const { auth } = useChrome();

  const isAccountInfoEmptyStateToggleEnabled = useIsAccountInfoEmptyStateToggleEnabled();
  const isAwsEc2InstancesToggleEnabled = useIsAwsEc2InstancesToggleEnabled();
  const isDebugToggleEnabled = useIsDebugToggleEnabled();
  const isExportsToggleEnabled = useIsExportsToggleEnabled();
  const isFinsightsToggleEnabled = useIsFinsightsToggleEnabled();
  const isIbmToggleEnabled = useIsIbmToggleEnabled();
  const isOcpCloudNetworkingToggleEnabled = useIsOcpCloudNetworkingToggleEnabled();
  const isOcpProjectStorageToggleEnabled = useIsOcpProjectStorageToggleEnabled();
  const isRosToggleEnabled = useIsRosToggleEnabled();

  const fetchUser = callback => {
    auth.getUser().then(user => {
      callback((user as any).identity);
    });
  };

  useLayoutEffect(() => {
    // Workaround for code that doesn't use hooks
    dispatch(
      FeatureToggleActions.setFeatureToggle({
        isAccountInfoEmptyStateToggleEnabled,
        isAwsEc2InstancesToggleEnabled,
        isDebugToggleEnabled,
        isExportsToggleEnabled,
        isFinsightsToggleEnabled,
        isIbmToggleEnabled,
        isOcpCloudNetworkingToggleEnabled,
        isOcpProjectStorageToggleEnabled,
        isRosToggleEnabled,
      })
    );
    if (isDebugToggleEnabled) {
      // eslint-disable-next-line no-console
      fetchUser(identity => console.log('User identity:', identity));
    }
  }, [
    isAccountInfoEmptyStateToggleEnabled,
    isAwsEc2InstancesToggleEnabled,
    isDebugToggleEnabled,
    isExportsToggleEnabled,
    isFinsightsToggleEnabled,
    isIbmToggleEnabled,
    isOcpCloudNetworkingToggleEnabled,
    isOcpProjectStorageToggleEnabled,
    isRosToggleEnabled,
  ]);
};

export default useFeatureToggle;
