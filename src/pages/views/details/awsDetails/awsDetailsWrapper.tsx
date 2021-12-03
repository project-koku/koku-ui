import { CostTypeWrapper } from 'pages/views/components/costType';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import AwsDetails from './awsDetails';

type AwsDetailsWrapperProps = RouteComponentProps<void>;

const AwsDetailsWrapper: React.FunctionComponent<AwsDetailsWrapperProps> = props => {
  return (
    <CostTypeWrapper>
      <AwsDetails {...props} />
    </CostTypeWrapper>
  );
};

export default AwsDetailsWrapper;
