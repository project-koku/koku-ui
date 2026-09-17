import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useUnleashClient } from '@unleash/proxy-client-react';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FeatureToggleActions } from 'store/featureToggle';

import { FeatureToggleType } from './featureToggleType';

// Build-time flags from webpack DefinePlugin (`fec.config.js` / `webpack-onprem.config.ts`). Not Unleash toggles.
export const isOnPremEnabled = process.env.KOKU_UI_ONPREM_ENABLED === 'true';

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

export const useIsExchangeRateToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggleType.exchangeRate);
};

export const useIsExportsToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggleType.exports);
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

export const useIsPriceListRatesToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggleType.priceListRates);
};

export const useIsSystemsToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggleType.systems);
};

// FeatureToggle saves feature toggles in store for places where the Unleash hook is not available
export const useFeatureToggle = () => {
  const dispatch = useDispatch();
  const { auth } = useChrome();

  const isAwsEc2InstancesToggleEnabled = useIsAwsEc2InstancesToggleEnabled();
  const isDebugToggleEnabled = useIsDebugToggleEnabled();
  const isExchangeRateToggleEnabled = useIsExchangeRateToggleEnabled();
  const isExportsToggleEnabled = useIsExportsToggleEnabled();
  const isNamespaceToggleEnabled = useIsNamespaceToggleEnabled();
  const isPriceListRatesToggleEnabled = useIsPriceListRatesToggleEnabled();
  const isSystemsToggleEnabled = useIsSystemsToggleEnabled();

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
        isExchangeRateToggleEnabled,
        isExportsToggleEnabled,
        isNamespaceToggleEnabled,
        isOrgAdmin,
        isPriceListRatesToggleEnabled,
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
    isExchangeRateToggleEnabled,
    isExportsToggleEnabled,
    isNamespaceToggleEnabled,
    isOrgAdmin,
    isPriceListRatesToggleEnabled,
    isSystemsToggleEnabled,
  ]);
};

export default useFeatureToggle;
