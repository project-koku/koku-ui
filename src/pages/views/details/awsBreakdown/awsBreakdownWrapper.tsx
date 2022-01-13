import { AccountSettings } from 'pages/views/components/accountSettings';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import AwsBreakdown from './awsBreakdown';

type AwsBreakdownWrapperProps = RouteComponentProps<void>;

const AwsBreakdownWrapper: React.FunctionComponent<AwsBreakdownWrapperProps> = props => {
  return (
    <AccountSettings>
      <AwsBreakdown {...props} />
    </AccountSettings>
  );
};

export default AwsBreakdownWrapper;
