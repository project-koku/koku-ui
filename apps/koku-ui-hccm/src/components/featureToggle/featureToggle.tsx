import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useUnleashClient } from '@unleash/proxy-client-react';
import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FeatureToggleActions } from 'store/featureToggle';

export const enum FeatureToggle {
  awsEc2Instances = 'cost-management.koku-ui-hccm.aws-ec2-instances', // https://issues.redhat.com/browse/COST-4855
  debug = 'cost-management.koku-ui-hccm.debug', // Logs user data (e.g., account ID) in browser console
  exactFilter = 'cost-management.koku-ui-hccm.exact-filter', // Exact filter https://issues.redhat.com/browse/COST-6744
  exports = 'cost-management.koku-ui-hccm.exports', // Async exports https://issues.redhat.com/browse/COST-2223
  gpu = 'cost-management.koku-ui-hccm.gpu', // Cost model GPU metrics https://issues.redhat.com/browse/COST-5334
  namespace = 'cost-management.koku-ui-ros.namespace', // Namespace recommendations https://issues.redhat.com/browse/COST-6267
  systems = 'cost-management.koku-ui-hccm.systems', // Systems https://issues.redhat.com/browse/COST-5718
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

export const useIsExactFilterToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.exactFilter);
};

export const useIsExportsToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.exports);
};

export const useIsGpuToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.gpu);
};

export const useIsNamespaceToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.namespace);
};

export const useIsSystemsToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.systems);
};

// The FeatureToggle component saves feature toggles in store for places where Unleash hooks not available
export const useFeatureToggle = () => {
  const dispatch = useDispatch();
  const { auth } = useChrome();

  const isAwsEc2InstancesToggleEnabled = useIsAwsEc2InstancesToggleEnabled();
  const isDebugToggleEnabled = useIsDebugToggleEnabled();
  const isExactFilterToggleEnabled = useIsExactFilterToggleEnabled();
  const isExportsToggleEnabled = useIsExportsToggleEnabled();
  const isGpuToggleEnabled = useIsGpuToggleEnabled();
  const isNamespaceToggleEnabled = useIsNamespaceToggleEnabled();
  const isSystemsToggleEnabled = useIsSystemsToggleEnabled();

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
        isDebugToggleEnabled,
        isExactFilterToggleEnabled,
        isExportsToggleEnabled,
        isGpuToggleEnabled,
        isNamespaceToggleEnabled,
        isSystemsToggleEnabled,
      })
    );
    if (isDebugToggleEnabled) {
      // eslint-disable-next-line no-console
      fetchUser(identity => console.log('User identity:', identity));
    }
  }, [
    isAwsEc2InstancesToggleEnabled,
    isDebugToggleEnabled,
    isExactFilterToggleEnabled,
    isExportsToggleEnabled,
    isGpuToggleEnabled,
    isNamespaceToggleEnabled,
    isSystemsToggleEnabled,
  ]);
};

export default useFeatureToggle;
