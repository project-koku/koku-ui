import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useUnleashClient, useUnleashContext } from '@unleash/proxy-client-react';
import { useLayoutEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { featureFlagsActions } from 'store/featureFlags';

// eslint-disable-next-line no-shadow
export const enum FeatureToggle {
  exports = 'cost-management.ui.exports', // Async exports https://issues.redhat.com/browse/COST-2223
  finsights = 'cost-management.ui.finsights', // RHEL support for FINsights https://issues.redhat.com/browse/COST-3306
  ibm = 'cost-management.ui.ibm', // IBM https://issues.redhat.com/browse/COST-935
  ros = 'cost-management.ui.ros', // ROS support https://issues.redhat.com/browse/COST-3477
  rosBeta = 'cost-management.ui.ros-beta', // ROS support https://issues.redhat.com/browse/COST-3477
  settingsPlatform = 'cost-management.ui.settings.platform', // Platform projects https://issues.redhat.com/browse/COST-3818
}

// The FeatureFlags component saves feature flags in store for places where Unleash hooks not available
const useFeatureFlags = () => {
  const updateContext = useUnleashContext();
  const client = useUnleashClient();
  const dispatch = useDispatch();
  const { auth } = useChrome();

  const fetchUser = callback => {
    auth.getUser().then(user => {
      callback((user as any).identity.account_number);
    });
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
            isExportsFeatureEnabled: client.isEnabled(FeatureToggle.exports),
            isFinsightsFeatureEnabled: client.isEnabled(FeatureToggle.finsights),
            isIbmFeatureEnabled: client.isEnabled(FeatureToggle.ibm),
            isRosFeatureEnabled:
              client.isEnabled(FeatureToggle.ros) ||
              (client.isEnabled(FeatureToggle.rosBeta) && insights && insights.chrome && insights.chrome.isBeta()),
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
