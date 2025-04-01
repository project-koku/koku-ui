import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useUnleashClient } from '@unleash/proxy-client-react';
import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FeatureToggleActions } from 'store/featureToggle';

export const enum FeatureToggle {
  costBreakdownChart = 'cost-management.ui.cost-breakdown-chart', // https://issues.redhat.com/browse/COST-5852
  debug = 'cost-management.ui.debug',
  exports = 'cost-management.ui.exports', // Async exports https://issues.redhat.com/browse/COST-2223
  finsights = 'cost-management.ui.finsights', // RHEL support for FINsights https://issues.redhat.com/browse/COST-3306
  ibm = 'cost-management.ui.ibm', // IBM https://issues.redhat.com/browse/COST-935
}

const useIsToggleEnabled = (toggle: FeatureToggle) => {
  const client = useUnleashClient();
  return client.isEnabled(toggle);
};

export const useIsCostBreakdownChartToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.costBreakdownChart);
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

// The FeatureToggle component saves feature toggles in store for places where Unleash hooks not available
export const useFeatureToggle = () => {
  const dispatch = useDispatch();
  const { auth } = useChrome();

  const isCostBreakdownChartToggleEnabled = useIsCostBreakdownChartToggleEnabled();
  const isDebugToggleEnabled = useIsDebugToggleEnabled();
  const isExportsToggleEnabled = useIsExportsToggleEnabled();
  const isFinsightsToggleEnabled = useIsFinsightsToggleEnabled();
  const isIbmToggleEnabled = useIsIbmToggleEnabled();

  const fetchUser = callback => {
    auth.getUser().then(user => {
      callback((user as any).identity);
    });
  };

  useLayoutEffect(() => {
    // Workaround for code that doesn't use hooks
    dispatch(
      FeatureToggleActions.setFeatureToggle({
        isCostBreakdownChartToggleEnabled,
        isDebugToggleEnabled,
        isExportsToggleEnabled,
        isFinsightsToggleEnabled,
        isIbmToggleEnabled,
      })
    );
    if (isDebugToggleEnabled) {
      // eslint-disable-next-line no-console
      fetchUser(identity => console.log('User identity:', identity));
    }
  }, [
    isCostBreakdownChartToggleEnabled,
    isDebugToggleEnabled,
    isExportsToggleEnabled,
    isFinsightsToggleEnabled,
    isIbmToggleEnabled,
  ]);
};

export default useFeatureToggle;
