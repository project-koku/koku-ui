import { useFlag } from '@unleash/proxy-client-react';
import { FunctionComponent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { featureActions } from 'store/feature';

interface FeatureProps extends RouteComponentProps {
  children?: React.ReactNode;
}

// eslint-disable-next-line no-shadow
const enum FeatureToggle {
  currency = 'cost-management.currency', // Currency support https://issues.redhat.com/browse/COST-1277
  exports = 'cost-management.exports', // Async exports https://issues.redhat.com/browse/COST-2223
  ibm = 'cost-management.ibm', // IBM https://issues.redhat.com/browse/COST-935
  oci = 'cost-management.oci', // Oracle Cloud Infrastructure
}

const FeatureBase: FunctionComponent<FeatureProps> = ({ children = null }): any => {
  const dispatch = useDispatch();
  const isCurrencyFeatureEnabled = useFlag(FeatureToggle.currency);
  const isExportsFeatureEnabled = useFlag(FeatureToggle.exports);
  const isIbmFeatureEnabled = useFlag(FeatureToggle.ibm);
  const isOciFeatureEnabled = useFlag(FeatureToggle.oci);

  useEffect(() => {
    dispatch(
      featureActions.initFeatures({
        isCurrencyFeatureEnabled,
        isExportsFeatureEnabled,
        isIbmFeatureEnabled,
        isOciFeatureEnabled,
      })
    );
  }, []);

  return children;
};

const Feature = withRouter(FeatureBase);

export { Feature, FeatureToggle };
