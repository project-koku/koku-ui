import { AccountSettings } from 'components/accountSettings';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Overview from './overview';

type OverviewWrapperProps = RouteComponentProps<void>;

const OverviewWrapper: React.FunctionComponent<OverviewWrapperProps> = props => {
  return (
    <AccountSettings>
      <Overview {...props} />
    </AccountSettings>
  );
};

export default OverviewWrapper;
