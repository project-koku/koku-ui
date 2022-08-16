import { useFlag } from '@unleash/proxy-client-react';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

interface FeatureProps extends RouteComponentProps<void> {
  children?: React.ReactNode;
  defaultValue?: React.ReactNode;
  flag?: string;
}

// eslint-disable-next-line no-shadow
const enum FeatureToggle {
  currency = 'cost-management.currency', // Currency support https://issues.redhat.com/browse/COST-1277
  exports = 'cost-management.exports', // Async exports https://issues.redhat.com/browse/COST-2223
  ibm = 'cost-management.ibm', // IBM https://issues.redhat.com/browse/COST-935
  oci = 'cost-management.oci', // Oracle Cloud Infrastructure
}

const FeatureBase: React.SFC<FeatureProps> = ({ children, flag, defaultValue = null }): any => {
  const isEnabled = useFlag(flag);
  return isEnabled ? children : defaultValue;
};

const Feature = withRouter(FeatureBase);

export { Feature, FeatureProps, FeatureToggle };
