import { AccountSettings } from 'components/accountSettings';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import AwsDetails from './awsDetails';

type AwsDetailsWrapperProps = RouteComponentProps<void>;

const AwsDetailsWrapper: React.FunctionComponent<AwsDetailsWrapperProps> = props => {
  return (
    <AccountSettings>
      <AwsDetails {...props} />
    </AccountSettings>
  );
};

export default AwsDetailsWrapper;
