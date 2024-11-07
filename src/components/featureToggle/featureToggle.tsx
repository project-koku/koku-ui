import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useUnleashClient } from '@unleash/proxy-client-react';
import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FeatureToggleActions } from 'store/featureToggle';

export const enum FeatureToggle {
  accountInfoDetails = 'cost-management.ui.account-info-details', // https://issues.redhat.com/browse/COST-5386
  accountInfoEmptyState = 'cost-management.ui.account-info-empty-state', // https://issues.redhat.com/browse/COST-5335
  awsEc2Instances = 'cost-management.ui.aws-ec2-instances', // https://issues.redhat.com/browse/COST-4855
  chartSkeleton = 'cost-management.ui.chart-skeleton', // https://issues.redhat.com/browse/COST-5573
  debug = 'cost-management.ui.debug',
  detailsDateRange = 'cost-management.ui.details-date-range', // https://issues.redhat.com/browse/COST-5563
  exports = 'cost-management.ui.exports', // Async exports https://issues.redhat.com/browse/COST-2223
  finsights = 'cost-management.ui.finsights', // RHEL support for FINsights https://issues.redhat.com/browse/COST-3306
  ibm = 'cost-management.ui.ibm', // IBM https://issues.redhat.com/browse/COST-935
  ocpCloudGroupBys = 'cost-management.ui.ocp-cloud-group-bys', // https://issues.redhat.com/browse/COST-5514
  providerEmptyState = 'cost-management.ui.provider-empty-state', // https://issues.redhat.com/browse/COST-5613
}

const useIsToggleEnabled = (toggle: FeatureToggle) => {
  const client = useUnleashClient();
  return client.isEnabled(toggle);
};

export const useIsAccountInfoDetailsToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.accountInfoDetails);
};

export const useIsAccountInfoEmptyStateToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.accountInfoEmptyState);
};

export const useIsAwsEc2InstancesToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.awsEc2Instances);
};

export const useIsChartSkeletonToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.chartSkeleton);
};

export const useIsDebugToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.debug);
};

export const useIsDetailsDateRangeToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.detailsDateRange);
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

export const useIsOcpCloudGroupBysToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.ocpCloudGroupBys);
};

export const useIsProviderEmptyStateToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.providerEmptyState);
};

// The FeatureToggle component saves feature toggles in store for places where Unleash hooks not available
export const useFeatureToggle = () => {
  const dispatch = useDispatch();
  const { auth } = useChrome();

  const isAccountInfoDetailsToggleEnabled = useIsAccountInfoDetailsToggleEnabled();
  const isAccountInfoEmptyStateToggleEnabled = useIsAccountInfoEmptyStateToggleEnabled();
  const isAwsEc2InstancesToggleEnabled = useIsAwsEc2InstancesToggleEnabled();
  const isChartSkeletonToggleEnabled = useIsChartSkeletonToggleEnabled();
  const isDebugToggleEnabled = useIsDebugToggleEnabled();
  const isDetailsDateRangeToggleEnabled = useIsDetailsDateRangeToggleEnabled();
  const isExportsToggleEnabled = useIsExportsToggleEnabled();
  const isFinsightsToggleEnabled = useIsFinsightsToggleEnabled();
  const isIbmToggleEnabled = useIsIbmToggleEnabled();
  const isOcpCloudGroupBysToggleEnabled = useIsOcpCloudGroupBysToggleEnabled();
  const isProviderEmptyStateToggleEnabled = useIsProviderEmptyStateToggleEnabled();

  const fetchUser = callback => {
    auth.getUser().then(user => {
      callback((user as any).identity);
    });
  };

  useLayoutEffect(() => {
    // Workaround for code that doesn't use hooks
    dispatch(
      FeatureToggleActions.setFeatureToggle({
        isAccountInfoDetailsToggleEnabled,
        isAccountInfoEmptyStateToggleEnabled,
        isAwsEc2InstancesToggleEnabled,
        isChartSkeletonToggleEnabled,
        isDebugToggleEnabled,
        isDetailsDateRangeToggleEnabled,
        isExportsToggleEnabled,
        isFinsightsToggleEnabled,
        isIbmToggleEnabled,
        isOcpCloudGroupBysToggleEnabled,
        isProviderEmptyStateToggleEnabled,
      })
    );
    if (isDebugToggleEnabled) {
      // eslint-disable-next-line no-console
      fetchUser(identity => console.log('User identity:', identity));
    }
  }, [
    isAccountInfoDetailsToggleEnabled,
    isAccountInfoEmptyStateToggleEnabled,
    isAwsEc2InstancesToggleEnabled,
    isChartSkeletonToggleEnabled,
    isDebugToggleEnabled,
    isDetailsDateRangeToggleEnabled,
    isExportsToggleEnabled,
    isFinsightsToggleEnabled,
    isIbmToggleEnabled,
    isOcpCloudGroupBysToggleEnabled,
    isProviderEmptyStateToggleEnabled,
  ]);
};

export default useFeatureToggle;
