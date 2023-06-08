import { useUnleashClient, useUnleashContext } from '@unleash/proxy-client-react';
import { useLayoutEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { featureFlagsActions } from 'store/featureFlags';

// eslint-disable-next-line no-shadow
export const enum FeatureToggle {
  costCategories = 'cost-management.ui.cost-categories', // AWS cost categories https://issues.redhat.com/browse/COST-3611
  costDistribution = 'cost-management.ui.cost-distribution', // OCP distributed overhead costs https://issues.redhat.com/browse/COST-3681
  exports = 'cost-management.ui.exports', // Async exports https://issues.redhat.com/browse/COST-2223
  finsights = 'cost-management.ui.finsights', // RHEL support for FINsights https://issues.redhat.com/browse/COST-3306
  ibm = 'cost-management.ui.ibm', // IBM https://issues.redhat.com/browse/COST-935
  ros = 'cost-management.ui.ros', // ROS support https://issues.redhat.com/browse/COST-3477
  rosBeta = 'cost-management.ui.ros-beta', // ROS support https://issues.redhat.com/browse/COST-3477
  settings = 'cost-management.ui.settings', // Settings page https://issues.redhat.com/browse/COST-3307
  settingsPlatform = 'cost-management.ui.settings.platform', // Platform projects https://issues.redhat.com/browse/COST-3818
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
            isCostCategoriesFeatureEnabled: client.isEnabled(FeatureToggle.costCategories),
            isCostDistributionFeatureEnabled: client.isEnabled(FeatureToggle.costDistribution),
            isExportsFeatureEnabled: client.isEnabled(FeatureToggle.exports),
            isFinsightsFeatureEnabled: client.isEnabled(FeatureToggle.finsights),
            isIbmFeatureEnabled: client.isEnabled(FeatureToggle.ibm),
            isRosFeatureEnabled:
              client.isEnabled(FeatureToggle.ros) ||
              (client.isEnabled(FeatureToggle.rosBeta) && insights && insights.chrome && insights.chrome.isBeta()),
            isSettingsFeatureEnabled: client.isEnabled(FeatureToggle.settings),
            isSettingsPlatformFeatureEnabled: client.isEnabled(FeatureToggle.settingsPlatform),
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
