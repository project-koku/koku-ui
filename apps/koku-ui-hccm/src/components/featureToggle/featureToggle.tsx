import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useUnleashClient } from '@unleash/proxy-client-react';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FeatureToggleActions } from 'store/featureToggle';

import { FeatureToggleType } from './featureToggleType';

// Build-time flags from webpack DefinePlugin (`fec.config.js` / `webpack-onprem.config.ts`). Not Unleash toggles.
export const isSettingsDataRetentionPeriodEnabled = process.env.KOKU_UI_SETTINGS_DATA_RETENTION_PERIOD === 'true'; // https://redhat.atlassian.net/browse/COST-7396
export const isSettingsSourcesTabEnabled = process.env.KOKU_UI_SETTINGS_SOURCES_TAB === 'true';

const useIsToggleEnabled = (toggle: FeatureToggleType) => {
  const client = useUnleashClient();
  return client?.isEnabled?.(toggle) ?? false;
};

export const useIsAwsEc2InstancesToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggleType.awsEc2Instances);
};

export const useIsDebugToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggleType.debug);
};

export const useIsDisplayToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggleType.display);
};

export const useIsExactFilterToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggleType.exactFilter);
};

export const useIsEfficiencyToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggleType.efficiency);
};

export const useIsExportsToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggleType.exports);
};

export const useIsGpuToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggleType.gpu);
};

export const useIsMigToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggleType.mig);
};

export const useIsNamespaceToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggleType.namespace);
};

export const useIsOrgAdmin = () => {
  const { auth } = useChrome();
  const [isOrgAdmin, setIsOrgAdmin] = useState(false);

  useEffect(() => {
    let ignore = false;

    auth.getUser().then(user => {
      if (!ignore) {
        setIsOrgAdmin(!!(user as any)?.identity?.user?.is_org_admin);
      }
    });

    return () => {
      ignore = true;
    };
  }, [auth]);

  return isOrgAdmin;
};

export const useIsPriceListToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggleType.priceList);
};

export const useIsPriceListRatesToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggleType.priceListRates);
};

export const useIsSystemsToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggleType.systems);
};

export const useIsWastedCostToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggleType.wastedCost);
};

// FeatureToggle saves feature toggles in store for places where the Unleash hook is not available
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
  const isPriceListRatesToggleEnabled = useIsPriceListRatesToggleEnabled();
  const isSystemsToggleEnabled = useIsSystemsToggleEnabled();
  const isWastedCostToggleEnabled = useIsWastedCostToggleEnabled();

  const fetchUser = callback => {
    auth.getUser().then(user => {
      callback((user as any).identity);
    });
  };

  // Flag indicating user has org admin permissions
  const isOrgAdmin = useIsOrgAdmin();

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
        isPriceListRatesToggleEnabled,
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
    isPriceListRatesToggleEnabled,
    isSystemsToggleEnabled,
    isWastedCostToggleEnabled,
  ]);
};

export default useFeatureToggle;
