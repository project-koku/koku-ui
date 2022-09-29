import { useFlag } from '@unleash/proxy-client-react';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { featureFlagsActions } from 'store/featureFlags';

interface FeatureFlagsOwnProps {
  children?: React.ReactNode;
}

type FeatureFlagsProps = FeatureFlagsOwnProps & RouteComponentProps<void>;

// eslint-disable-next-line no-shadow
const enum FeatureToggle {
  currency = 'cost-management.ui.currency', // Currency support https://issues.redhat.com/browse/COST-1277
  excludes = 'cost-management.ui.negative-filtering', // Contains filter https://issues.redhat.com/browse/COST-2773
  exports = 'cost-management.ui.exports', // Async exports https://issues.redhat.com/browse/COST-2223
  ibm = 'cost-management.ui.ibm', // IBM https://issues.redhat.com/browse/COST-935
  oci = 'cost-management.ui.oci', // Oracle Cloud Infrastructure https://issues.redhat.com/browse/COST-2358
}

const FeatureFlagsBase: React.FC<FeatureFlagsProps> = ({ children = null }) => {
  const dispatch = useDispatch();

  const isCurrencyFeatureEnabled = useFlag(FeatureToggle.currency);
  const isExcludesFeatureEnabled = useFlag(FeatureToggle.excludes);
  const isExportsFeatureEnabled = useFlag(FeatureToggle.exports);
  const isIbmFeatureEnabled = useFlag(FeatureToggle.ibm);
  const isOciFeatureEnabled = useFlag(FeatureToggle.oci);

  useEffect(() => {
    dispatch(
      featureFlagsActions.setFeatureFlags({
        isCurrencyFeatureEnabled,
        isExcludesFeatureEnabled,
        isExportsFeatureEnabled,
        isIbmFeatureEnabled,
        isOciFeatureEnabled,
      })
    );
  }, []);

  return <>{children}</>;
};

const FeatureFlags = withRouter(FeatureFlagsBase);

export { FeatureFlags, FeatureToggle };
