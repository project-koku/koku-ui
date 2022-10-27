import { useUnleashClient, useUnleashContext } from '@unleash/proxy-client-react';
import React, { useLayoutEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import type { RouteComponentProps } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { featureFlagsActions } from 'store/featureFlags';

interface FeatureFlagsOwnProps {
  children?: React.ReactNode;
}

type FeatureFlagsProps = FeatureFlagsOwnProps & RouteComponentProps<void>;

// eslint-disable-next-line no-shadow
export const enum FeatureToggle {
  currency = 'cost-management.ui.currency', // Currency support https://issues.redhat.com/browse/COST-1277
  excludes = 'cost-management.ui.negative-filtering', // Contains filter https://issues.redhat.com/browse/COST-2773
  exports = 'cost-management.ui.exports', // Async exports https://issues.redhat.com/browse/COST-2223
  ibm = 'cost-management.ui.ibm', // IBM https://issues.redhat.com/browse/COST-935
  oci = 'cost-management.ui.oci', // Oracle Cloud Infrastructure https://issues.redhat.com/browse/COST-2358
}

let userId;
const insights = (window as any).insights;
if (insights && insights.chrome && insights.chrome.auth && insights.chrome.auth.getUser) {
  insights.chrome.auth.getUser().then(user => {
    userId = user.identity.account_number;
  });
}

// The FeatureFlags component saves feature flags in store for places where Unleash hooks not available
const FeatureFlagsBase: React.FC<FeatureFlagsProps> = ({ children = null }) => {
  const updateContext = useUnleashContext();
  const client = useUnleashClient();
  const dispatch = useDispatch();

  const isMounted = useRef(false);
  useLayoutEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Update everytime or flags may be false
  useLayoutEffect(() => {
    if (userId && isMounted.current) {
      updateContext({
        userId,
      });
    }
  });

  useLayoutEffect(() => {
    // Wait for the new flags to pull in from the different context
    const fetchFlags = async () => {
      await updateContext({ userId }).then(() => {
        dispatch(
          featureFlagsActions.setFeatureFlags({
            isCurrencyFeatureEnabled: client.isEnabled(FeatureToggle.currency),
            isExcludesFeatureEnabled: client.isEnabled(FeatureToggle.excludes),
            isExportsFeatureEnabled: client.isEnabled(FeatureToggle.exports),
            isIbmFeatureEnabled: client.isEnabled(FeatureToggle.ibm),
            isOciFeatureEnabled: client.isEnabled(FeatureToggle.oci),
          })
        );
      });
    };
    if (userId && isMounted.current) {
      fetchFlags();
    }
  });

  return <>{children}</>;
};

const FeatureFlags = withRouter(FeatureFlagsBase);

export default FeatureFlags;
