import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useUnleashClient } from '@unleash/proxy-client-react';
import { useLayoutEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FeatureToggleActions } from 'store/featureToggle';

// Build-time flags from webpack DefinePlugin (`fec.config.js` / `webpack-onprem.config.ts`). Not Unleash toggles.
export const isSettingsDataRetentionPeriodEnabled = process.env.KOKU_UI_SETTINGS_DATA_RETENTION_PERIOD === 'true'; // https://redhat.atlassian.net/browse/COST-7396
export const isSettingsSourcesTabEnabled = process.env.KOKU_UI_SETTINGS_SOURCES_TAB === 'true';

// Unleash feature toggles
export const enum FeatureToggle {
  awsEc2Instances = 'cost-management.koku-ui-hccm.aws-ec2-instances', // https://redhat.atlassian.net/browse/COST-4855
  debug = 'cost-management.koku-ui-hccm.debug', // Logs user data (e.g., account ID) in browser console
  display = 'cost-management.koku-ui-hccm.display', // https://redhat.atlassian.net/browse/COST-7396
  efficiency = 'cost-management.koku-ui-hccm.efficiency', // Efficiency scores https://redhat.atlassian.net/browse/COST-7170
  exactFilter = 'cost-management.koku-ui-hccm.exact-filter', // Exact filter https://redhat.atlassian.net/browse/COST-6744
  exports = 'cost-management.koku-ui-hccm.exports', // Async exports https://redhat.atlassian.net/browse/COST-2223
  gpu = 'cost-management.koku-ui-hccm.gpu', // Cost model GPU metrics https://redhat.atlassian.net/browse/COST-5334
  mig = 'cost-management.koku-ui-hccm.mig', // Cost of MIG support https://redhat.atlassian.net/browse/COST-7239
  namespace = 'cost-management.koku-ui-ros.namespace', // Namespace recommendations https://redhat.atlassian.net/browse/COST-6267
  priceList = 'cost-management.koku-ui-hccm.price-list', // Life cycle of price list https://redhat.atlassian.net/browse/COST-7330
  systems = 'cost-management.koku-ui-hccm.systems', // Systems https://redhat.atlassian.net/browse/COST-5718
  wastedCost = 'cost-management.koku-ui-hccm.wasted-cost', // Wasted cost https://redhat.atlassian.net/browse/COST-7460
}

const useIsToggleEnabled = (toggle: FeatureToggle) => {
  const client = useUnleashClient();
  return client?.isEnabled?.(toggle) ?? false;
};

export const useIsAwsEc2InstancesToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.awsEc2Instances);
};

export const useIsDebugToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.debug);
};

export const useIsDisplayToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.display);
};

export const useIsExactFilterToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.exactFilter);
};

export const useIsEfficiencyToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.efficiency);
};

export const useIsExportsToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.exports);
};

export const useIsGpuToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.gpu);
};

export const useIsMigToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.mig);
};

export const useIsNamespaceToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.namespace);
};

export const useIsOrgAdmin = () => {
  const { auth } = useChrome();
  const [isOrgAdmin, setIsOrgAdmin] = useState(false);

  useLayoutEffect(() => {
    let ignore = false;

    auth.getUser().then(user => {
      if (!ignore) {
        setIsOrgAdmin(!!(user as any).identity?.user?.is_org_admin);
      }
    });

    return () => {
      ignore = true;
    };
  }, [auth]);

  return isOrgAdmin;
};

export const useIsPriceListToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.priceList);
};

export const useIsSystemsToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.systems);
};

export const useIsWastedCostToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.wastedCost);
};

// The FeatureToggle component saves feature toggles in store for places where Unleash hooks not available
export const useFeatureToggle = () => {
  const dispatch = useDispatch();
  const { auth } = useChrome();

  const isAwsEc2InstancesToggleEnabled = useIsAwsEc2InstancesToggleEnabled();
  const isDebugToggleEnabled = useIsDebugToggleEnabled();
  const isDisplayToggleEnabled = useIsDisplayToggleEnabled();
  const isEfficiencyToggleEnabled = useIsEfficiencyToggleEnabled();
  const isExactFilterToggleEnabled = useIsExactFilterToggleEnabled();
  const isExportsToggleEnabled = useIsExportsToggleEnabled();
  const isGpuToggleEnabled = useIsGpuToggleEnabled();
  const isMigToggleEnabled = useIsMigToggleEnabled();
  const isNamespaceToggleEnabled = useIsNamespaceToggleEnabled();
  const isPriceListToggleEnabled = useIsPriceListToggleEnabled();
  const isSystemsToggleEnabled = useIsSystemsToggleEnabled();
  const isWastedCostToggleEnabled = useIsWastedCostToggleEnabled();

  const fetchUser = callback => {
    auth.getUser().then(user => {
      callback((user as any).identity);
    });
  };

  // Flag indicating user has org admin permissions
  let isOrgAdmin = false;
  fetchUser(identity => (isOrgAdmin = identity?.user?.is_org_admin));

  useLayoutEffect(() => {
    // Workaround for code that doesn't use hooks
    dispatch(
      FeatureToggleActions.setFeatureToggle({
        isAwsEc2InstancesToggleEnabled,
        isDebugToggleEnabled,
        isDisplayToggleEnabled,
        isEfficiencyToggleEnabled,
        isExactFilterToggleEnabled,
        isExportsToggleEnabled,
        isGpuToggleEnabled,
        isMigToggleEnabled,
        isNamespaceToggleEnabled,
        isOrgAdmin,
        isPriceListToggleEnabled,
        isSystemsToggleEnabled,
        isWastedCostToggleEnabled,
      })
    );
    if (isDebugToggleEnabled) {
      // eslint-disable-next-line no-console
      fetchUser(identity => console.log('User identity:', identity));
    }
  }, [
    isAwsEc2InstancesToggleEnabled,
    isDebugToggleEnabled,
    isDisplayToggleEnabled,
    isEfficiencyToggleEnabled,
    isExactFilterToggleEnabled,
    isExportsToggleEnabled,
    isGpuToggleEnabled,
    isMigToggleEnabled,
    isNamespaceToggleEnabled,
    isOrgAdmin,
    isPriceListToggleEnabled,
    isSystemsToggleEnabled,
    isWastedCostToggleEnabled,
  ]);
};

export default useFeatureToggle;
