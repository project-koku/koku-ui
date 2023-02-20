import { useUnleashClient, useUnleashContext } from '@unleash/proxy-client-react';
import { useLayoutEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { featureFlagsActions } from 'store/featureFlags';

// eslint-disable-next-line no-shadow
export const enum FeatureToggle {
  costDistribution = 'cost-management.ui.cost-distribution', // Cost distribution https://issues.redhat.com/browse/COST-3249
  costType = 'cost-management.ui.cost-type', // AWS as filtered by OpenShift cost types https://issues.redhat.com/browse/COST-3122
  currency = 'cost-management.ui.currency', // Currency support https://issues.redhat.com/browse/COST-1277
  exports = 'cost-management.ui.exports', // Async exports https://issues.redhat.com/browse/COST-2223
  finsights = 'cost-management.ui.finsights', // RHEL support for FINsights https://issues.redhat.com/browse/COST-3306
  ibm = 'cost-management.ui.ibm', // IBM https://issues.redhat.com/browse/COST-935
  negativeFiltering = 'cost-management.ui.negative-filtering', // Negative (aka exclude) filtering https://issues.redhat.com/browse/COST-2773
  oci = 'cost-management.ui.oci', // Oracle Cloud Infrastructure https://issues.redhat.com/browse/COST-2358
  platformCosts = 'cost-management.ui.platform-costs', // OCP platform costs https://issues.redhat.com/browse/COST-2774
  ros = 'cost-management.ui.ros', // ROS support https://issues.redhat.com/browse/COST-3477
}

// The FeatureFlags component saves feature flags in store for places where Unleash hooks not available
const useFeatureFlags = () => {
  const updateContext = useUnleashContext();
  const client = useUnleashClient();
  const dispatch = useDispatch();

  const fetchUser = callback => {
    const insights = (window as any).insights;
    if (insights && insights.chrome && insights.chrome.auth && insights.chrome.auth.getUser) {
      insights.chrome.auth.getUser().then(user => {
        callback(user.identity.account_number);
      });
    }
  };

  const isMounted = useRef(false);
  useLayoutEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Update everytime or flags may be false
  useLayoutEffect(() => {
    fetchUser(userId => {
      if (isMounted.current) {
        updateContext({
          userId,
        });
      }
    });
  });

  useLayoutEffect(() => {
    // Wait for the new flags to pull in from the different context
    const fetchFlags = async userId => {
      await updateContext({ userId }).then(() => {
        dispatch(
          featureFlagsActions.setFeatureFlags({
            isCurrencyFeatureEnabled: client.isEnabled(FeatureToggle.currency),
            isCostDistributionFeatureEnabled: client.isEnabled(FeatureToggle.costDistribution),
            isCostTypeFeatureEnabled: client.isEnabled(FeatureToggle.costType),
            isExportsFeatureEnabled: client.isEnabled(FeatureToggle.exports),
            isFinsightsFeatureEnabled: client.isEnabled(FeatureToggle.finsights),
            isNegativeFilteringFeatureEnabled: client.isEnabled(FeatureToggle.negativeFiltering),
            isIbmFeatureEnabled: client.isEnabled(FeatureToggle.ibm),
            isOciFeatureEnabled: client.isEnabled(FeatureToggle.oci),
            isPlatformCostsFeatureEnabled: client.isEnabled(FeatureToggle.platformCosts),
            isRosFeatureEnabled: client.isEnabled(FeatureToggle.ros),
          })
        );
      });
    };
    fetchUser(userId => {
      if (isMounted.current) {
        fetchFlags(userId);
      }
    });
  });
};

export default useFeatureFlags;
